import { gamify } from './gamify';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

/**
 * Fetch GitHub Wrapped data for a user via Secure Cloudflare Function
 * @param {string} username 
 * @returns {Promise<object>} wrappedData
 */
export async function getWrappedData(username, type = 'recap') {
  if (!username) throw new Error('Username is required');

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const response = await fetch(`/api/stats?username=${username}&type=${type}&tz=${tz}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch wrapped data');
  }

  return await response.json();
}

/**
 * Generate AI Roast or Hype
 * @param {string} username
 * @param {object} stats
 * @param {'roast' | 'hype' | 'battle'} mode
 * @param {object} user1
 * @param {object} user2
 * @returns {Promise<string>} aiMessage
 */
export async function getAIGeneration(username, stats, mode, user1 = null, user2 = null) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, stats, mode, user1, user2 })
  });

  if (!response.ok) {
     const errorData = await response.json();
     throw new Error(errorData.error || 'Failed to generate AI response');
  }

  const { message } = await response.json();
  return message;
}
