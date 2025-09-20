export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, action } = await request.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'subscribe') {
      await env.BLOG_DB.prepare(`
        INSERT INTO authors (email, subscribed, subscription_token)
        VALUES (?, 1, hex(randomblob(16)))
        ON CONFLICT(email) DO UPDATE SET subscribed = 1
      `).bind(email).run();
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed!' 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (action === 'unsubscribe') {
      await env.BLOG_DB.prepare(`
        UPDATE authors SET subscribed = 0 WHERE email = ?
      `).bind(email).run();
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Successfully unsubscribed!' 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Subscription API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update subscription' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}