import React, { forwardRef } from 'react';
import { Swords, Trophy, Zap, Shield, Sparkles } from 'lucide-react';
import { Github } from './Icons';

/**
 * A match-report style card designed for image export (social sharing).
 * Refined for full stats and clean rectangular export.
 */
const BattleCard = forwardRef(({ user1, user2, data1, data2 }, ref) => {
  const p1 = data1.gamified.powerLevel;
  const p2 = data2.gamified.powerLevel;
  
  const StatItem = ({ label, v1, v2 }) => (
    <div className="flex flex-col items-center">
      <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`text-lg font-mono font-bold ${v1 >= v2 ? 'text-primary' : 'text-white/60'}`}>{v1?.toLocaleString()}</span>
        <span className="text-white/10 text-xs">|</span>
        <span className={`text-lg font-mono font-bold ${v2 >= v1 ? 'text-primary' : 'text-white/60'}`}>{v2?.toLocaleString()}</span>
      </div>
    </div>
  );

  return (
    <div 
      ref={ref}
      className="w-[800px] h-[600px] bg-black p-10 flex flex-col relative overflow-hidden text-white border-[12px] border-white/5 rounded-[40px]"
      style={{
        background: `radial-gradient(circle at center, #1a1a1a 0%, #000 100%)`
      }}
    >
      {/* Texture / Branding */}
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <Swords className="w-6 h-6 text-primary" />
          <span className="font-black italic tracking-widest text-xl uppercase">Code Battle</span>
        </div>
        <div className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold border border-white/10">
          Official Result Report
        </div>
      </div>

      {/* Main Players Area */}
      <div className="flex items-center justify-between gap-12 relative z-10 mb-4">
        {/* User 1 Panel */}
        <div className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all ${p1 >= p2 ? 'bg-primary/5 border-primary/40 shadow-[0_0_40px_rgba(99,102,241,0.15)]' : 'bg-white/5 border-white/10'}`}>
          <div className="relative">
            <img src={data1.avatarUrl} alt={user1} className="w-20 h-20 rounded-full border-4 border-white/10 shadow-2xl" />
            {p1 > p2 && <Trophy className="absolute -top-3 -right-3 w-7 h-7 text-yellow-500 drop-shadow-lg" />}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black truncate max-w-[220px]">@{user1}</h3>
            <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1 font-bold">{data1.gamified.class}</p>
          </div>
          <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${p1 >= p2 ? 'bg-primary border-primary text-white' : 'border-white/10 text-white/40'}`}>
            {data1.gamified.tier}
          </div>
        </div>

        {/* VS Indicator */}
        <div className="flex flex-col items-center">
           <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">VS</span>
           </div>
        </div>

        {/* User 2 Panel */}
        <div className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all ${p2 >= p1 ? 'bg-primary/5 border-primary/40 shadow-[0_0_40px_rgba(99,102,241,0.15)]' : 'bg-white/5 border-white/10'}`}>
          <div className="relative">
            <img src={data2.avatarUrl} alt={user2} className="w-20 h-20 rounded-full border-4 border-white/10 shadow-2xl" />
            {p2 > p1 && <Trophy className="absolute -top-3 -right-3 w-7 h-7 text-yellow-500 drop-shadow-lg" />}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black truncate max-w-[220px]">@{user2}</h3>
            <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1 font-bold">{data2.gamified.class}</p>
          </div>
          <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${p2 >= p1 ? 'bg-primary border-primary text-white' : 'border-white/10 text-white/40'}`}>
            {data2.gamified.tier}
          </div>
        </div>
      </div>

      {/* Stats Summary Grid (All Stats) */}
      <div className="flex-1 bg-white/5 rounded-[30px] p-6 border border-white/5 relative z-10 grid grid-cols-3 grid-rows-2 gap-y-6">
        <StatItem label="Commits" v1={data1.totalCommits} v2={data2.totalCommits} />
        <StatItem label="Power Level" v1={p1} v2={p2} />
        <StatItem label="PR Requests" v1={data1.totalPRs} v2={data2.totalPRs} />
        <StatItem label="Streak" v1={data1.longestStreak} v2={data2.longestStreak} />
        <StatItem label="Repositories" v1={data1.totalReposContributedTo} v2={data2.totalReposContributedTo} />
        <StatItem label="Issue Count" v1={data1.totalIssues} v2={data2.totalIssues} />
      </div>

      {/* Footer Branding */}
      <div className="mt-4 flex items-center justify-center gap-2 opacity-30 relative z-10">
        <Github className="w-3 h-3" />
        <span className="text-[9px] uppercase tracking-[0.4em] font-bold">gitwrapped.kalpakps.site</span>
      </div>
    </div>
  );
});

BattleCard.displayName = 'BattleCard';

export default BattleCard;
