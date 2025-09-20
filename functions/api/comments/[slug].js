export async function onRequestGet(context) {
  const { env, params } = context;
  const { slug } = params;

  try {
    const { results } = await env.BLOG_DB.prepare(`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        a.name as author_name,
        a.email as author_email
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

export async function onRequestPost(context) {
  const { request, env, params } = context;
  const { slug } = params;

  try {
    const data = await request.json();
    const { name, email, content } = data;

    // Insert or get author
    const authorResult = await env.BLOG_DB.prepare(`
      INSERT INTO authors (email, name, subscription_token)
      VALUES (?, ?, hex(randomblob(16)))
      ON CONFLICT(email) DO UPDATE SET name = excluded.name
      RETURNING id
    `).bind(email, name).run();

    const authorId = authorResult.results[0].id;

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