import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, Ghost, Swords, Bird, Moon, Coffee, Boxes } from 'lucide-react';

const ClassIcon = ({ type }) => {
  switch (type) {
    case 'Night Owl': return <Moon className="w-8 h-8 text-indigo-400" />;
    case 'Early Bird': return <Bird className="w-8 h-8 text-yellow-400" />;
    case 'The Socialite': return <Swords className="w-8 h-8 text-pink-400" />;
    case 'The Machine': return <Boxes className="w-8 h-8 text-red-500" />;
    case 'The Grinder': return <Coffee className="w-8 h-8 text-orange-400" />;
    case 'The Architect': return <Shield className="w-8 h-8 text-blue-400" />;
    case 'The Sprinter': return <Zap className="w-8 h-8 text-yellow-300" />;
    case 'The Polyglot': return <Sparkles className="w-8 h-8 text-purple-400" />;
    default: return <Ghost className="w-8 h-8 text-gray-400" />;
  }
};

export default function Slide2Power({ data }) {
  const { powerLevel, tier, element, class: userClass } = data.gamified;

  return (
    <div className="slide-container space-y-8 md:space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <span className="text-white/40 uppercase tracking-widest text-[10px] md:text-sm mb-2 block font-mono">Statistical Archetype Unlocked</span>
        <h2 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary animate-gradient leading-tight">
          {tier}
        </h2>
      </motion.div>

      <div className="relative w-48 h-48 md:w-80 md:h-80 flex items-center justify-center">
        {/* Animated circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-white/5 fill-none"
            strokeWidth="6"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-primary fill-none"
            strokeWidth="6"
            strokeDasharray="100 100"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: Math.max(0, 100 - (powerLevel / 10000) * 100) }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ strokeLinecap: 'round' }}
          />
        </svg>

        <div className="z-10 flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-3xl md:text-6xl font-mono font-bold text-white mb-1"
          >
            {powerLevel.toLocaleString()}
          </motion.span>
          <span className="text-white/40 uppercase tracking-wider text-[10px] md:text-xs">Power Level</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl"
      >
        <div className="glass p-4 md:p-6 rounded-2xl border border-white/10 flex items-center gap-4 text-left">
          <div className="p-2 md:p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
            <ClassIcon type={userClass} />
          </div>
          <div>
            <h3 className="text-white/40 uppercase tracking-widest text-[10px] font-medium leading-none">Class</h3>
            <p className="text-lg md:text-xl font-bold text-white mt-1">{userClass}</p>
          </div>
        </div>

        <div className="glass p-4 md:p-6 rounded-2xl border border-white/10 flex items-center gap-4 text-left">
          <div className="p-2 md:p-3 rounded-xl bg-white/5 border border-white/10 text-xl md:text-2xl shrink-0">
            {element.split(' ')[0]}
          </div>
          <div>
            <h3 className="text-white/40 uppercase tracking-widest text-[10px] font-medium leading-none">Element</h3>
            <p className="text-lg md:text-xl font-bold text-white mt-1">{element.split(' ')[1]}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
