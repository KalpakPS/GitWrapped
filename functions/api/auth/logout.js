/**
 * Cloudflare Pages Function: Logout
 */
export async function onRequest(context) {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'gw_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure'
    }
  });
}
