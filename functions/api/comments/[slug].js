export async function onRequestGet(context) {
  const { env, params } = context;
  const { slug } = params;

  try {
    const { results } = await env.BLOG_DB.prepare(`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        a.name as author_name
      FROM comments c
      JOIN authors a ON c.author_id = a.id
      WHERE c.post_slug = ? AND c.approved = 1
      ORDER BY c.created_at DESC
    `).bind(slug).all();

    return new Response(JSON.stringify(results || []), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Comments API Error:', error);
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PENDING_PER_HOUR = 3;

export async function onRequestPost(context) {
  const { request, env, params } = context;
  const { slug } = params;

  try {
    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: 'Invalid request' }, 400);
    }

    const name = String(data.name ?? '').trim();
    const email = String(data.email ?? '').trim().toLowerCase();
    const content = String(data.content ?? '').trim();
    const subscribe = data.subscribe ? 1 : 0;

    // Honeypot: real users never fill this hidden field
    if (data.website) {
      return json({ success: true, message: 'Comment submitted for moderation!' }, 201);
    }

    if (!/^[a-z0-9-]{1,200}$/i.test(slug)) {
      return json({ error: 'Invalid post' }, 400);
    }
    if (!name || name.length > 80) {
      return json({ error: 'Please enter a name (max 80 characters)' }, 400);
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return json({ error: 'Please enter a valid email' }, 400);
    }
    if (!content || content.length > 2000) {
      return json({ error: 'Comment must be 1-2000 characters' }, 400);
    }

    // Insert or get author. Existing authors keep their current subscription
    // state; only the token-based link can change it.
    const authorResult = await env.BLOG_DB.prepare(`
      INSERT INTO authors (email, name, subscribed, subscription_token)
      VALUES (?, ?, ?, hex(randomblob(16)))
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        subscription_token = COALESCE(authors.subscription_token, excluded.subscription_token)
      RETURNING id
    `).bind(email, name, subscribe).run();

    const authorId = authorResult.results[0].id;

    // Cheap per-author rate limit using existing data (no extra infrastructure)
    const recent = await env.BLOG_DB.prepare(`
      SELECT COUNT(*) AS n FROM comments
      WHERE author_id = ? AND created_at > datetime('now', '-1 hour')
    `).bind(authorId).first();
    if (recent && recent.n >= MAX_PENDING_PER_HOUR) {
      return json({ error: 'Too many comments. Please try again later.' }, 429);
    }

    // Insert comment
    await env.BLOG_DB.prepare(`
      INSERT INTO comments (post_slug, author_id, content, approved)
      VALUES (?, ?, ?, 0)
    `).bind(slug, authorId, content).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Comment submitted for moderation!' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Comment submission error:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit comment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}