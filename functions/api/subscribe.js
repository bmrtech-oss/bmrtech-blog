const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_RE = /^[a-f0-9]{32}$/i;

// Changing or reading an existing subscription requires the private token that is
// sent in email links. An email address alone is never enough, so nobody can
// unsubscribe (or re-subscribe) somebody else.
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: 'Invalid request' }, 400);
    }

    const action = data.action;

    if (action === 'subscribe') {
      const email = String(data.email ?? '').trim().toLowerCase();
      if (!EMAIL_RE.test(email) || email.length > 254) {
        return json({ error: 'Please enter a valid email' }, 400);
      }

      // New addresses are added; existing ones are left untouched (including
      // earlier unsubscribes). authors.name is NOT NULL, so use an empty name.
      await env.BLOG_DB.prepare(`
        INSERT INTO authors (email, name, subscribed, subscription_token)
        VALUES (?, '', 1, hex(randomblob(16)))
        ON CONFLICT(email) DO UPDATE SET
          subscription_token = COALESCE(authors.subscription_token, excluded.subscription_token)
      `).bind(email).run();

      return json({ success: true, message: 'Thanks! You are on the list.' });
    }

    if (action === 'status' || action === 'unsubscribe' || action === 'resubscribe') {
      const token = String(data.token ?? '').trim();
      if (!TOKEN_RE.test(token)) {
        return json({ error: 'Invalid or expired link' }, 400);
      }

      const author = await env.BLOG_DB.prepare(`
        SELECT subscribed FROM authors WHERE subscription_token = ?
      `).bind(token).first();
      if (!author) {
        return json({ error: 'Invalid or expired link' }, 404);
      }

      if (action === 'status') {
        return json({ subscribed: !!author.subscribed });
      }

      const subscribed = action === 'resubscribe' ? 1 : 0;
      await env.BLOG_DB.prepare(`
        UPDATE authors SET subscribed = ?, updated_at = CURRENT_TIMESTAMP
        WHERE subscription_token = ?
      `).bind(subscribed, token).run();

      return json({
        success: true,
        subscribed: !!subscribed,
        message: subscribed ? 'You are subscribed again.' : 'You have been unsubscribed.',
      });
    }

    return json({ error: 'Invalid action' }, 400);
  } catch (error) {
    console.error('Subscription API Error:', error);
    return json({ error: 'Failed to update subscription' }, 500);
  }
}
