export async function onRequest() {
  return new Response('Hello from root function!', { status: 200 });
}
