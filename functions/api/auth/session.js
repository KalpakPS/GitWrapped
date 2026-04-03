/**
 * Cloudflare Pages Function: Get current user session
 */
export async function onRequest(context) {
  const { request } = context;
  const cookieHeader = request.headers.get('Cookie');

  if (!cookieHeader) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {});

  const session = cookies['gw_session'];

  if (!session || !session.includes(':')) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const [token, username] = session.split(':');

  return new Response(JSON.stringify({ 
    loggedIn: true, 
    user: username 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
