import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Book, Code2 } from 'lucide-react';

export default function Slide5Hits({ data }) {
  const topRepos = data.topRepos.slice(0, 3);

  return (
    <div className="slide-container space-y-6 md:space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-white/40 uppercase tracking-widest text-[10px] md:text-sm mb-2 block font-mono text-center md:text-left">Portfolio Highlights</span>
        <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight text-center md:text-left">Your Greatest Hits</h2>
        <p className="text-base md:text-xl text-white/60 mt-2 md:mt-4 leading-tight text-center md:text-left">The repositories that defined your year.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl overflow-hidden px-4 md:px-0">
        {topRepos.map((repo, i) => (
          <motion.div
            key={repo.name}
            initial={{ opacity: 0, x: -30, rotateY: 30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.5 + (i * 0.2), duration: 0.8 }}
            className={`flex flex-col glass rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden relative group hover:border-primary/50 transition-colors ${i > 1 ? 'hidden md:flex' : 'flex'}`}
          >
            <div className="h-1 md:h-2 bg-primary w-full opacity-30 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-4 md:p-8 flex flex-col h-full text-left">
              <div className="flex justify-between items-start mb-2 md:mb-6">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center p-2 md:p-3">
                  <Book className="w-full h-full text-primary" />
                </div>
                <div className="flex items-center gap-2 px-2 md:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-white/60">
                  <Code2 className="w-3 h-3 text-primary" />
                  {repo.language}
                </div>
              </div>

              <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 truncate group-hover:text-primary transition-colors">
                {repo.name}
              </h3>
              <p className="text-white/40 text-[10px] md:text-sm mb-4 md:mb-8 line-clamp-1 md:line-clamp-2 leading-tight">Built with passion and probably a few cups of coffee too many.</p>

              <div className="mt-auto pt-4 md:pt-6 border-t border-white/5 flex gap-4 md:gap-6">
                <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  <span className="font-mono text-white text-sm md:text-lg leading-none">{repo.stars}</span>
                </div>
                <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                  <GitFork className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                  <span className="font-mono text-white text-sm md:text-lg leading-none">{repo.forks}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
