/**
 * Calculate power level based on activity
 * @param {object} stats - GitHub stats
 * @returns {object} { score, tier }
 */
export function calcPowerLevel(stats) {
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

  return { score, tier };
}

/**
 * Assign elemental affinity based on dominant language
 * @param {string} primaryLanguage 
 * @returns {string} element
 */
export function assignElement(primaryLanguage) {
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
  return elements[primaryLanguage] || '✨ Ether';
}

/**
 * Map user behavior to a developer class
 * @param {object} stats 
 * @returns {string} developer class
 */
export function assignClass(stats) {
  if (stats.mostActiveHour >= 22 || stats.mostActiveHour <= 4) return 'Night Owl';
  if (stats.mostActiveHour >= 5 && stats.mostActiveHour <= 9) return 'Early Bird';
  if (stats.totalPRs > stats.totalCommits * 0.3) return 'The Socialite';
  if (stats.longestStreak >= 180) return 'The Machine';
  if (stats.longestStreak >= 60) return 'The Grinder';
  if (stats.topRepos.some(r => r.stars > 500)) return 'The Architect';
  if (stats.maxDailyCommits > 20) return 'The Sprinter';
  
  const languages = Object.keys(stats.languageDistribution).length;
  if (languages >= 5) return 'The Polyglot';
  
  return 'The Developer';
}

/**
 * Generate achievements based on yearly metrics
 * @param {object} stats 
 * @returns {Array} achievements
 */
export function unlockAchievements(stats) {
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
    },
  ];
}

/**
 * Merge all gamification logic for a complete profile
 * @param {object} stats 
 * @returns {object} gamified stats
 */
export function gamify(stats) {
  const { score, tier } = calcPowerLevel(stats);
  const element = assignElement(stats.topRepos[0]?.language || 'default');
  const userClass = assignClass(stats);
  const achievements = unlockAchievements(stats);

  return {
    powerLevel: score,
    tier,
    element,
    class: userClass,
    achievements,
  };
}
