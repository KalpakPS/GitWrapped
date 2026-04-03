import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar } from 'lucide-react';

export default function Slide4Heatmap({ data }) {
  const { contributionCalendar, longestStreak, totalCommits } = data;

  // Group by weeks for the grid
  const weeks = [];
  for (let i = 0; i < contributionCalendar.length; i += 7) {
    weeks.push(contributionCalendar.slice(i, i + 7));
  }

  const getColor = (count) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.03)';
    if (count < 2) return 'rgba(99, 102, 241, 0.2)';
    if (count < 5) return 'rgba(99, 102, 241, 0.5)';
    if (count < 10) return 'rgba(99, 102, 241, 0.8)';
    return 'rgba(99, 102, 241, 1)';
  };

  return (
    <div className="slide-container space-y-6 md:space-y-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <span className="text-white/40 uppercase tracking-widest text-[10px] md:text-sm mb-1 block font-mono">Temporal Heatmap</span>
        <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-none">Consistency is Key</h2>
        <p className="text-sm md:text-xl text-white/60 mt-2 md:mt-4 leading-tight px-4 mx-auto max-w-xl">You were a force of nature across <span className="text-primary font-bold">{totalCommits}</span> contributions.</p>
      </motion.div>

      <div className="w-full max-w-4xl overflow-x-auto pb-6 px-4 custom-scrollbar">
        <div className="flex gap-1 items-end min-w-max">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1 shrink-0">
              {week.map((day, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + (i * 0.01), type: "spring", stiffness: 200 }}
                  className="w-3 h-3 md:w-4 md:h-4 rounded-[2px] md:rounded-sm shrink-0"
                  style={{ backgroundColor: getColor(day.count) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl px-4"
      >
        <div className="glass p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6 text-center md:text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Flame className="w-12 h-12 md:w-24 md:h-24 text-primary fill-current" />
          </div>
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center p-2 shrink-0">
            <Flame className="w-5 h-5 md:w-8 md:h-8 text-primary fill-current" />
          </div>
          <div className="flex flex-col h-full overflow-hidden">
            <h3 className="text-white/40 uppercase tracking-widest text-[8px] md:text-xs font-semibold min-h-[24px] flex items-center justify-center md:justify-start">Longest Streak</h3>
            <p className="text-xl md:text-4xl font-bold text-white leading-none my-1">{longestStreak}</p>
            <span className="text-[10px] md:text-sm text-white/40 min-h-[32px] flex items-start justify-center md:justify-start">Consecutive Days</span>
          </div>
        </div>

        <div className="glass p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6 text-center md:text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy className="w-12 h-12 md:w-24 md:h-24 text-primary fill-current" />
          </div>
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center p-2 shrink-0">
            <Calendar className="w-5 h-5 md:w-8 md:h-8 text-primary" />
          </div>
          <div className="flex flex-col h-full overflow-hidden">
            <h3 className="text-white/40 uppercase tracking-widest text-[8px] md:text-xs font-semibold min-h-[24px] flex items-center justify-center md:justify-start">Active Days</h3>
            <p className="text-xl md:text-4xl font-bold text-white leading-none my-1">{contributionCalendar.filter(d => d.count > 0).length}</p>
            <span className="text-[10px] md:text-sm text-white/40 min-h-[32px] flex items-start justify-center md:justify-start">Out of 365</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
