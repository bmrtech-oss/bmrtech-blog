const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: 'Invalid request' }, 400);
    }

    const email = String(data.email ?? '').trim().toLowerCase();
    const action = data.action;

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return json({ error: 'Please enter a valid email' }, 400);
    }

    if (action === 'subscribe') {
      // authors.name is NOT NULL, so new subscribers get an empty name
      await env.BLOG_DB.prepare(`
        INSERT INTO authors (email, name, subscribed, subscription_token)
        VALUES (?, '', 1, hex(randomblob(16)))
        ON CONFLICT(email) DO UPDATE SET subscribed = 1
      `).bind(email).run();

      return json({ success: true, message: 'Successfully subscribed!' });
    }

    if (action === 'unsubscribe') {
      await env.BLOG_DB.prepare(`
        UPDATE authors SET subscribed = 0 WHERE email = ?
      `).bind(email).run();

      return json({ success: true, message: 'Successfully unsubscribed!' });
    }

    return json({ error: 'Invalid action' }, 400);
  } catch (error) {
    console.error('Subscription API Error:', error);
    return json({ error: 'Failed to update subscription' }, 500);
  }
}
