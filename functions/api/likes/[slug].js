export async function onRequestGet(context) {
  const { env, params } = context;
  const { slug } = params;

  try {
    const result = await env.BLOG_DB.prepare(`
      SELECT count FROM likes WHERE post_slug = ?
    `).bind(slug).first();

    const count = result ? result.count : 0;
    
    return new Response(JSON.stringify({ count }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Likes API Error:', error);
    return new Response(JSON.stringify({ count: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost(context) {
  const { env, params } = context;
  const { slug } = params;

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

    return new Response(JSON.stringify({ count: result.count }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Like API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to like post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}