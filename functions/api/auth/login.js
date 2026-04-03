/**
 * Cloudflare Pages Function: Initiate GitHub OAuth Flow
 */
export async function onRequest(context) {
  const { env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  const scope = 'repo,read:user'; // Access to private repositories and user info
  const state = Math.random().toString(36).substring(7); // Random state for CSRF protection

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'GITHUB_CLIENT_ID is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&state=${state}`;

  return Response.redirect(githubAuthUrl);
}
