/**
 * Cloudflare Pages Function: Fetch GitHub Stats and Gamify them
 * Securely uses GITHUB_TOKEN from Cloudflare's environment.
 */

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  const type = url.searchParams.get('type') || 'recap'; // Default to recap
  
  // Extract token from cookie or fallback to environment variable
  let token = env.GITHUB_TOKEN;
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
    const session = cookies['gw_session'];
    if (session && session.includes(':')) {
      const [userToken] = session.split(':');
      token = userToken;
    }
  }

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!token) {
    return new Response(JSON.stringify({ error: 'GitHub API token is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const stats = await fetchGitHubData(username, token);
    const gamified = gamify(stats);

    // Increment cumulative counter in the background (Only if NOT a battle)
    // OPTIMIZATION: To stay under Cloudflare KV's 1,000 writes/day free limit,
    // we only update the DB for ~10% of users, incrementing by 10 each time.
    const BATCH_SIZE = 10;
    if (env.STATS_KV && type !== 'battle' && Math.random() < (1 / BATCH_SIZE)) {
      context.waitUntil((async () => {
        try {
          const countStr = await env.STATS_KV.get('total_recaps');
          const currentCount = parseInt(countStr || '0', 10);
          await env.STATS_KV.put('total_recaps', (currentCount + BATCH_SIZE).toString());
        } catch (err) {
          console.error('KV Counter Error:', err);
        }
      })());
    }
    
    return new Response(JSON.stringify({ ...stats, gamified }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function fetchGitHubData(username, token) {
  const now = new Date();
  const from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
  const to = now.toISOString();

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        name
        login
        avatarUrl
        bio
        createdAt
        followers { totalCount }
        following { totalCount }
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              stargazerCount
              forkCount
              primaryLanguage { name color }
            }
          }
        }
        repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER) {
          nodes {
            name
            stargazerCount
            forkCount
            primaryLanguage { name color }
          }
        }
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalRepositoriesWithContributedCommits
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { contributionCount date weekday }
            }
          }
          commitContributionsByRepository(maxRepositories: 5) {
            repository { name stargazerCount }
            contributions(first: 100) {
              nodes { occurredAt }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json',
      'User-Agent': 'GitWrapped-Pages-Function'
    },
    body: JSON.stringify({ query, variables: { username, from, to } }),
  });

  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);

  const user = result.data.user;
  if (!user) throw new Error('User not found');

  const contributions = user.contributionsCollection;
  const calendar = contributions.contributionCalendar;
  
  const allDays = calendar.weeks.flatMap(w => 
    w.contributionDays.map(d => ({
      date: d.date,
      count: d.contributionCount,
      weekday: d.weekday
    }))
  );

  // Initialize metrics
  let currentStreak = 0, maxStreak = 0, maxDaily = 0, mostActiveDay = 'Monday';
  const dayCounts = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };

  allDays.forEach(day => {
    if (day.count > 0) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
      if (day.count > maxDaily) maxDaily = day.count;
      dayCounts[day.weekday.toString()] += day.count;
    } else {
      currentStreak = 0;
    }
  });

  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let maxDayCount = -1;
  Object.entries(dayCounts).forEach(([day, count]) => {
    if (count > maxDayCount) {
      maxDayCount = count;
      mostActiveDay = dayMap[parseInt(day)];
    }
  });

  // Calculate most active patterns from commits
  const hourCounts = {};
  contributions.commitContributionsByRepository.forEach(repo => {
    repo.contributions.nodes.forEach(commit => {
      const hour = new Date(commit.occurredAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
  });

  let mostActiveHour = 14, maxHourCount = -1;
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxHourCount) {
      maxHourCount = count;
      mostActiveHour = parseInt(hour);
    }
  });

  const languages = {};
  user.repositories.nodes.forEach(repo => {
    if (repo.primaryLanguage) languages[repo.primaryLanguage.name] = (languages[repo.primaryLanguage.name] || 0) + 1;
  });

  return {
    username: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatarUrl,
    bio: user.bio || '',
    createdAt: user.createdAt,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    totalCommits: contributions.totalCommitContributions,
    totalPRs: contributions.totalPullRequestContributions,
    totalIssues: contributions.totalIssueContributions,
    totalReposContributedTo: contributions.totalRepositoriesWithContributedCommits,
    topRepos: user.repositories.nodes.map(r => ({
      name: r.name,
      stars: r.stargazerCount,
      forks: r.forkCount,
      language: r.primaryLanguage?.name || 'Unknown',
      languageColor: r.primaryLanguage?.color
    })),
    pinnedRepos: user.pinnedItems.nodes.map(r => ({
      name: r.name,
      stars: r.stargazerCount,
      forks: r.forkCount,
      language: r.primaryLanguage?.name || 'Unknown',
      languageColor: r.primaryLanguage?.color
    })),
    contributionCalendar: allDays,
    languageDistribution: languages,
    mostActiveHour,
    mostActiveDay,
    longestStreak: maxStreak,
    maxDailyCommits: maxDaily,
  };
}

// Gamification logic (self-contained to avoid import issues in Cloudflare Functions)
function gamify(stats) {
  const score = Math.round(
    (stats.totalCommits * 1.2) +
    (stats.totalPRs * 3) +
    (stats.totalIssues * 1.5) +
    (stats.topRepos.reduce((acc, repo) => acc + repo.stars, 0) * 5) +
    (stats.longestStreak * 2)
  );

  let tier = 'Novice';
  if (score > 10000) tier = 'Mythic';
  else if (score > 5000) tier = 'Legend';
  else if (score > 2500) tier = 'Principal';
  else if (score > 1000) tier = 'Senior';
  else if (score > 500) tier = 'Developer';
  else if (score > 100) tier = 'Apprentice';

  const elements = {
    'JavaScript': '⚡ Lightning',
    'TypeScript': '🌀 Storm',
    'Python': '🌿 Earth',
    'Rust': '🦀 Iron',
    'Go': '💨 Wind',
    'C': '⚙️ Metal',
    'C++': '⚙️ Metal',
    'Ruby': '💎 Crystal',
    'Java': '🔥 Forge',
    'Kotlin': '🔥 Forge',
    'HTML': '🏗️ Scaffold',
    'CSS': '🎨 Canvas',
  };
  const primaryLang = stats.topRepos[0]?.language || 'default';
  const element = elements[primaryLang] || '✨ Ether';

  let userClass = 'The Developer';
  if (stats.longestStreak >= 180) userClass = 'The Machine';
  else if (stats.topRepos.some(r => r.stars > 500)) userClass = 'The Architect';
  else if (stats.totalPRs > stats.totalCommits * 0.3) userClass = 'The Socialite';
  else if (stats.longestStreak >= 60) userClass = 'The Grinder';
  else if (stats.maxDailyCommits > 20) userClass = 'The Sprinter';
  else if (stats.mostActiveHour >= 22 || stats.mostActiveHour <= 4) userClass = 'Night Owl';
  else if (stats.mostActiveHour >= 5 && stats.mostActiveHour <= 9) userClass = 'Early Bird';
  
  const languagesCount = Object.keys(stats.languageDistribution).length;
  if (languagesCount >= 5) userClass = 'The Polyglot';

  return {
    powerLevel: score,
    tier,
    element,
    class: userClass,
    achievements: unlockAchievements(stats)
  };
}

function unlockAchievements(stats) {
  return [
    {
      id: 'first-blood',
      icon: '🩸',
      title: 'First Blood',
      description: 'First commit of the year',
      rarity: 'common',
      unlocked: stats.totalCommits > 0,
    },
    {
      id: 'night-shift',
      icon: '🌙',
      title: 'Night Shift',
      description: '10+ commits after midnight',
      rarity: 'common',
      unlocked: stats.mostActiveHour >= 0 && stats.mostActiveHour <= 4 && stats.totalCommits > 10,
    },
    {
      id: 'weekend-warrior',
      icon: '🛡️',
      title: 'Weekend Warrior',
      description: '20+ commits on weekends',
      rarity: 'common',
      unlocked: stats.mostActiveDay === 'Saturday' || stats.mostActiveDay === 'Sunday',
    },
    {
      id: 'streak-master',
      icon: '🔥',
      title: 'Streak Master',
      description: '30-day streak',
      rarity: 'rare',
      unlocked: stats.longestStreak >= 30,
    },
    {
      id: 'century-club',
      icon: '💯',
      title: 'Century Club',
      description: '100 commits in one month',
      rarity: 'rare',
      unlocked: stats.maxDailyCommits > 10,
    },
    {
      id: 'open-source-hero',
      icon: '🌟',
      title: 'Open Source Hero',
      description: 'PR merged into someone else\'s repo',
      rarity: 'rare',
      unlocked: stats.totalPRs > 5,
    },
    {
      id: 'the-1-percent',
      icon: '👑',
      title: 'The 1%',
      description: 'Top 1% of contributors globally',
      rarity: 'legendary',
      unlocked: stats.totalCommits > 1000,
    },
    {
      id: 'crab-whisperer',
      icon: '🦀',
      title: 'Crab Whisperer',
      description: 'Primary language is Rust',
      rarity: 'legendary',
      unlocked: stats.topRepos[0]?.language === 'Rust',
    },
    {
      id: 'hitchhiker',
      icon: '42',
      title: '42',
      description: 'The answer to life, the universe, and everything',
      rarity: 'legendary',
      unlocked: stats.totalCommits === 42,
    },
    {
      id: 'comeback-kid',
      icon: '📈',
      title: 'Comeback Kid',
      description: 'Significant spike after inactivity',
      rarity: 'legendary',
      unlocked: stats.maxDailyCommits > 50 && stats.longestStreak < 10,
    }
  ];
}
