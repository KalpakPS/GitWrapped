import React, { forwardRef } from 'react';
import { Zap, Shield, Sparkles, Code2 } from 'lucide-react';
import { Github } from './Icons';

const DeveloperCard = forwardRef(({ data }, ref) => {
  const { powerLevel, tier, element, class: userClass } = data.gamified;
  const isLegendary = tier === 'Legend' || tier === 'Mythic';

  return (
    <div 
      ref={ref}
      id="dev-card"
      className={`w-[400px] h-[600px] rounded-[50px] p-8 flex flex-col relative overflow-hidden text-white border-[6px] transition-all duration-700 ${
        isLegendary 
          ? 'card-holographic border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)]' 
          : 'border-white/20 shadow-2xl'
      }`}
      style={{ 
        background: `linear-gradient(135deg, #000, ${data.topRepos?.[0]?.languageColor || '#1a1a1a'}44, #000)`,
        borderColor: !isLegendary ? `${data.topRepos?.[0]?.languageColor}44` : undefined,
        backgroundColor: '#000'
      }}
    >
      {/* Texture / Noise */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
            <img src={data.avatarUrl} alt={data.username} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold tracking-tight">@{data.username}</span>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border border-white/10">
          Last 365 days
        </div>
      </div>

      {/* Main Illustration Area */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 py-4">
        <div className="relative group">
          <div className={`absolute -inset-4 rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-1000 ${
            isLegendary ? 'bg-yellow-500' : 'bg-primary'
          }`} />
          <div className="relative w-48 h-48 rounded-full border-4 border-white/20 p-2 flex items-center justify-center">
             <div className="w-full h-full rounded-full border-4 border-primary/40 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                {isLegendary ? <Sparkles className="w-24 h-24 text-yellow-500" /> : <Code2 className="w-24 h-24 text-primary" />}
             </div>
          </div>
        </div>
        
        <h3 className="mt-8 text-3xl font-black italic tracking-tighter uppercase whitespace-nowrap leading-none">{userClass}</h3>
        <p className="text-white/40 text-sm font-mono mt-2">Master of {element}</p>
      </div>

      {/* Stats Footer */}
      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/10 pt-6 pb-2 z-10">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase text-white/30 tracking-widest mb-1">Power</span>
          <span className="text-base font-bold font-mono">{powerLevel.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase text-white/30 tracking-widest mb-1">Tier</span>
          <span className="text-base font-bold leading-tight">{tier}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase text-white/30 tracking-widest mb-1">Commits</span>
          <span className="text-base font-bold font-mono">{data.totalCommits}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 opacity-30 z-10">
        <Github className="w-3 h-3" />
        <span className="text-[8px] uppercase tracking-[0.3em] font-bold">gitwrapped.kalpakps.site</span>
      </div>
    </div>
  );
});

DeveloperCard.displayName = 'DeveloperCard';

export default DeveloperCard;
