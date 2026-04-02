import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / end);

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function Slide1Numbers({ data }) {
  const percentile = Math.min(99, Math.floor((data.gamified.powerLevel / 10000) * 100));

  return (
    <div className="slide-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 md:space-y-12"
      >
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-primary uppercase tracking-[0.3em] font-bold text-xs">Rolling Statistics</span>
          <h2 className="text-xl md:text-3xl font-medium text-white/60">Your last 365 days in numbers</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <span className="text-5xl md:text-8xl font-bold text-primary">
              <Counter value={data.totalCommits} />
            </span>
            <span className="text-sm md:text-lg text-white/40 uppercase tracking-widest mt-1 md:mt-2">Commits</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col"
          >
            <span className="text-5xl md:text-8xl font-bold text-primary">
              <Counter value={data.totalPRs} />
            </span>
            <span className="text-sm md:text-lg text-white/40 uppercase tracking-widest mt-1 md:mt-2">Pull Requests</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col"
          >
            <span className="text-5xl md:text-8xl font-bold text-primary">
              <Counter value={data.totalIssues} />
            </span>
            <span className="text-sm md:text-lg text-white/40 uppercase tracking-widest mt-1 md:mt-2">Issues</span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-lg md:text-2xl text-white/80 max-w-xl mx-auto leading-relaxed px-4"
        >
          You were busier than <span className="text-primary font-bold">{percentile}%</span> of GitHub users this year. Keep that momentum!
        </motion.p>
      </motion.div>
    </div>
  );
}
