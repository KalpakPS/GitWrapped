import { gamify } from './gamify';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

/**
 * Fetch GitHub Wrapped data for a user via Secure Cloudflare Function
 * @param {string} username 
 * @returns {Promise<object>} wrappedData
 */
export async function getWrappedData(username) {
  if (!username) throw new Error('Username is required');

  const response = await fetch(`/api/stats?username=${username}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch wrapped data');
  }

  return await response.json();
}

// Note: Internal API logic moved to functions/api/stats.js for security
