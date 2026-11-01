const SLUG_RE = /^[a-z0-9-]{1,200}$/i;
const SITE_ORIGINS = ['https://antinodelabs.com', 'https://www.antinodelabs.com'];

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export async function onRequestGet(context) {
  const { env, params } = context;
  const { slug } = params;

  if (!SLUG_RE.test(slug)) return json({ count: 0 });

  try {
    const result = await env.BLOG_DB.prepare(`
      SELECT count FROM likes WHERE post_slug = ?
    `).bind(slug).first();

    return json({ count: result ? result.count : 0 });
  } catch (error) {
    console.error('Likes API Error:', error);
    return json({ count: 0 });
  }
}

export async function onRequestPost(context) {
  const { request, env, params } = context;
  const { slug } = params;

  if (!SLUG_RE.test(slug)) return json({ error: 'Invalid post' }, 400);

  // Reject cross-site posts; browsers always send Origin on POST (localhost allowed for dev)
  const origin = request.headers.get('Origin') || '';
  const isLocal = /^http:\/\/localhost(:\d+)?$/.test(origin);
  if (!SITE_ORIGINS.includes(origin) && !isLocal) {
    return json({ error: 'Forbidden' }, 403);
  }

  try {
    // Upsert like count
    await env.BLOG_DB.prepare(`
      INSERT INTO likes (post_slug, count, last_updated)
      VALUES (?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(post_slug) DO UPDATE SET 
        count = count + 1,
        last_updated = CURRENT_TIMESTAMP
    `).bind(slug).run();

    const result = await env.BLOG_DB.prepare(`
      SELECT count FROM likes WHERE post_slug = ?
    `).bind(slug).first();

    return json({ count: result.count });
  } catch (error) {
    console.error('Like API Error:', error);
    return json({ error: 'Failed to like post' }, 500);
  }
}