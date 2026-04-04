/**
 * Cloudflare Pages Function: Securely handle Groq (Free Tier) AI generation
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { username, stats, mode, user1, user2 } = await request.json();
  const winner = (user1?.power || 0) > (user2?.power || 0) ? user1 : user2;
  const loser = (user1?.power || 0) > (user2?.power || 0) ? user2 : user1;
  const margin = Math.abs((user1?.power || 0) - (user2?.power || 0));
  const apiKey = env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Groq API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const roastPrompt = `
You are a ruthless, chronically online senior engineer who has zero patience for mediocre GitHub stats.

Your roasts should feel like:
- A brutal Twitter reply from a 10x dev
- Dry, cutting, sarcastic
- Specific to the stats (no generic insults)

Rules:
- Max 2 sentences
- No emojis, no hashtags
- No boring phrasing
- Each line should hit like a punchline

If stats are low → humiliate them creatively  
If stats are mid → mock their inconsistency  
If stats are high → backhanded compliment

Avoid safe jokes. Be clever, not childish.

---

Developer: ${username}
Commits: ${stats.commits}
PRs: ${stats.pullRequests}
Streak: ${stats.streak} days
Active: ${stats.activeDays}/365
Tier: ${stats.tier}
Archetype: ${stats.archetype}

---

Now roast them like you're tired of reviewing their code.
`;

  const hypePrompt = `
You are an unhinged, over-caffeinated tech hype man.
Your only job is to scream a single, legendary sentence of praise.

Rules:
- STRICTLY 1 sentence max
- No emojis, no hashtags
- Absolute cinema only
- Specific but explosive

---

Developer: ${username}
Commits: ${stats.commits}
PRs: ${stats.pullRequests}
Streak: ${stats.streak} days
Active: ${stats.activeDays}/365
Tier: ${stats.tier}
Archetype: ${stats.archetype}

---

Now hype them up in one legendary sentence.
`;


  const battlePrompt = `
You are an unhinged, legendary e-sports commentator for the GitHub Open Source Olympics — 
think ESPN meets Stack Overflow. You've seen thousands of code battles and you have OPINIONS.

PLAYER 1: @${user1?.username}
- Tier: ${user1?.tier} | Archetype: ${user1?.archetype}
- Commits: ${user1?.commits} | PRs: ${user1?.pullRequests} | Streak: ${user1?.streak} days
- Power Level: ${user1?.power}

PLAYER 2: @${user2?.username}
- Tier: ${user2?.tier} | Archetype: ${user2?.archetype}
- Commits: ${user2?.commits} | PRs: ${user2?.pullRequests} | Streak: ${user2?.streak} days
- Power Level: ${user2?.power}

WINNER: @${winner?.username}
LOSER: @${loser?.username}
MARGIN: ${margin} power points

YOUR RULES:
- TWO sentences. Hard limit. No more, no less.
- Each sentence must be at least 10 words long. Like this example sentence which is exactly twelve words long.
- No setup, no fluff, just straight to the savage verdict.
- Be specific to their stats and archetypes.
- No emojis. No hashtags.
- If margin is under 50, acknowledge it was close. If over 200, call it a massacre.

Commentate.
`;

  const prompt = mode === 'roast' ? roastPrompt : mode === 'hype' ? hypePrompt : battlePrompt;

  // Helper dedicated to fetching from Groq
  const callGroq = async (model) => {
    return fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are a witty GitHub stats analyzer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8
      })
    });
  };

  try {
    // Flagship Model Rotation (Top to bottom quality/availability)
    const models = [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'gemma2-9b-it'
    ];

    let response;
    let success = false;
    let lastError = null;

    for (const model of models) {
      response = await callGroq(model);

      // If successful, break rotation
      if (response.ok) {
        success = true;
        break;
      }

      // If we hit a rate limit (429), log and try the next one
      if (response.status === 429) {
        console.warn(`[AI] Model ${model} rate-limited. Trying next in rotation...`);
        lastError = 'Rate limited across all models';
        continue;
      }

      // If it's another error, capture it but keep trying rotation
      const errData = await response.json().catch(() => ({}));
      lastError = errData.error?.message || 'Unknown model error';
      console.error(`[AI] Model ${model} failed:`, lastError);
    }

    if (!success) {
      throw new Error(lastError || 'All AI models exhausted or unavailable');
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error.message || 'AI generation failed');
    }

    const aiMessage = result.choices[0].message.content;

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('AI Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
