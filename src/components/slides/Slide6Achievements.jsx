import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, HelpCircle } from 'lucide-react';

const AchievementBadge = ({ achievement, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className={`relative p-3 md:p-6 rounded-2xl md:rounded-3xl cursor-pointer group transition-all duration-300 ${
        achievement.unlocked ? 'glass border-primary/20' : 'bg-white/5 border-white/5 opacity-40 grayscale blur-[1px]'
      }`}
      onClick={() => achievement.unlocked && setIsFlipped(!isFlipped)}
    >
      <div className="flex flex-col items-center gap-2 md:gap-4">
        <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-3xl ${
          achievement.unlocked ? 'bg-primary/20 ring-2 md:ring-4 ring-primary/10 transition-transform duration-500 group-hover:rotate-[360deg]' : 'bg-white/5'
        }`}>
          {achievement.unlocked ? achievement.icon : <HelpCircle className="w-5 h-5 md:w-8 md:h-8 text-white/20" />}
        </div>
        <div className="text-center">
          <h4 className="text-white font-bold text-[10px] md:text-sm tracking-tight truncate max-w-[80px] md:max-w-none">
            {achievement.unlocked ? achievement.title : 'Locked'}
          </h4>
          <p className="text-white/40 text-[8px] md:text-[10px] uppercase font-mono tracking-widest mt-0.5 md:mt-1">{achievement.rarity}</p>
        </div>
      </div>

      {achievement.unlocked && (
        <div className={`absolute inset-0 bg-primary p-2 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-500 ${
          isFlipped ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-12 pointer-events-none'
        }`}>
          <Trophy className="w-4 h-4 md:w-8 md:h-8 text-white mb-1 md:mb-2" />
          <p className="text-[9px] md:text-xs font-bold leading-tight text-white mb-1 md:mb-2">{achievement.description}</p>
          <span className="text-[8px] md:text-[10px] uppercase font-mono tracking-[0.2em] text-white/60 text-center">Unlocked</span>
        </div>
      )}

      {/* Rarity Indicator */}
      <div className={`absolute top-2 right-2 md:top-4 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
        achievement.rarity === 'legendary' ? 'bg-yellow-400 animate-pulse' :
        achievement.rarity === 'rare' ? 'bg-blue-400' : 'bg-gray-400'
      }`} />
    </motion.div>
  );
};

export default function Slide6Achievements({ data }) {
  const { achievements } = data.gamified;
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="slide-container space-y-6 md:space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-white/40 uppercase tracking-widest text-[10px] md:text-sm mb-2 block font-mono text-center md:text-left">Hall of Fame</span>
        <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight text-center md:text-left">Achievements</h2>
        <p className="text-base md:text-xl text-white/60 mt-2 md:mt-4 text-center md:text-left">You unlocked <span className="text-primary font-bold">{unlockedCount}</span> of {achievements.length} milestones.</p>
      </motion.div>

      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6 w-full max-w-5xl px-4 md:px-0">
        {achievements.map((a, i) => (
          <AchievementBadge key={a.id} achievement={a} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-primary text-white font-bold text-[10px] md:text-sm"
      >
         Tap any badge to reveal secrets
      </motion.div>
    </div>
  );
}
