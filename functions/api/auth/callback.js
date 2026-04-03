/**
 * Cloudflare Pages Function: GitHub OAuth Callback
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return new Response(JSON.stringify({ error: 'No code provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'GitWrapped'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error_description || data.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const accessToken = data.access_token;

    // Fetch user info to get the username
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'GitWrapped',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = await userResponse.json();
    const username = userData.login;

    // Set token in a secure HttpOnly cookie
    // Expiring in 24 hours
    const cookieValue = `${accessToken}:${username}`;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    
    // Redirect back to home with a success flag
    const redirectUrl = new URL(url.origin);
    redirectUrl.searchParams.set('auth_success', 'true');

    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl.toString(),
        'Set-Cookie': `gw_session=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; Secure`
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
