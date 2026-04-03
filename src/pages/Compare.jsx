import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWrappedData } from '../lib/github';
import { motion } from 'framer-motion';
import { Swords, Trophy, Loader2, ArrowLeft } from 'lucide-react';
import { Github } from '../components/Icons';

const StatRow = ({ label, val1, val2 }) => {
  const v1 = typeof val1 === 'number' ? val1 : 0;
  const v2 = typeof val2 === 'number' ? val2 : 0;
  const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

  return (
    <div className="grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_120px_1fr] items-center py-3 md:py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 md:px-4 rounded-xl">
      <div className={`text-right text-sm md:text-base ${winner === 1 ? 'text-primary font-bold' : 'text-white/60'}`}>
        {typeof val1 === 'number' ? val1.toLocaleString() : val1}
      </div>
      <div className="text-center text-[7px] md:text-xs uppercase tracking-tighter md:tracking-widest text-white/30 font-black px-1">{label}</div>
      <div className={`text-left text-sm md:text-base ${winner === 2 ? 'text-primary font-bold' : 'text-white/60'}`}>
        {typeof val2 === 'number' ? val2.toLocaleString() : val2}
      </div>
    </div>
  );
};

export default function Compare() {
  const { user1, user2 } = useParams();
  const navigate = useNavigate();
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [d1, d2] = await Promise.all([
          getWrappedData(user1, 'battle'),
          getWrappedData(user2, 'battle')
        ]);
        setData1(d1);
        setData2(d2);

        // Track success
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'view_battle_success', {
            'user1': user1,
            'user2': user2
          });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch comparison data');

        // Track error
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'view_battle_error', {
            'user1': user1,
            'user2': user2,
            'error': err.message || 'unknown'
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user1, user2]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="wrapped-bg" />
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-white/40 font-mono text-sm animate-pulse">Initializing combat simulation...</p>
      </div>
    );
  }

  if (error || !data1 || !data2) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="wrapped-bg" />
        <div className="glass p-8 rounded-3xl border border-white/10 max-w-md w-full">
           <h2 className="text-xl font-bold mb-4">Battle Interrupted</h2>
           <p className="text-white/40 mb-8">{error || 'Could not fetch data for both users.'}</p>
           <button onClick={() => navigate('/')} className="w-full py-3 bg-white text-black font-bold rounded-xl cursor-pointer">Go Home</button>
        </div>
      </div>
    );
  }

  const p1 = data1.gamified.powerLevel;
  const p2 = data2.gamified.powerLevel;
  const ultimateWinner = p1 > p2 ? data1 : data2;

  return (
    <main className="min-h-screen p-4 md:p-12 lg:p-24 bg-black relative text-white">
      <div className="wrapped-bg" />
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 md:top-8 md:right-auto md:left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors z-50 cursor-pointer text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/10 border border-white/20 mb-8"
          >
            <Swords className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold uppercase tracking-widest">Code Battle</h1>
          </motion.div>
          <p className="text-white/40 max-w-lg mx-auto">Two developers. One year of code. The ultimate comparison.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* User 1 Card */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`glass p-8 rounded-3xl border transition-colors ${p1 >= p2 ? 'border-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10'}`}
          >
            <img src={data1.avatarUrl} alt={user1} className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white/5" />
            <h2 className="text-2xl font-bold text-center mb-2">@{data1.username}</h2>
            <div className={`text-center px-4 py-1 rounded-full inline-block mx-auto mb-2 w-full text-sm font-bold ${p1 >= p2 ? 'text-primary' : 'text-white/40'}`}>
              {data1.gamified.tier}
            </div>
            <div className="text-center text-[10px] uppercase tracking-widest text-white/20">{data1.gamified.class}</div>
          </motion.div>

          {/* User 2 Card */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`glass p-8 rounded-3xl border transition-colors ${p2 >= p1 ? 'border-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10'}`}
          >
            <img src={data2.avatarUrl} alt={user2} className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white/5" />
            <h2 className="text-2xl font-bold text-center mb-2">@{data2.username}</h2>
            <div className={`text-center px-4 py-1 rounded-full inline-block mx-auto mb-2 w-full text-sm font-bold ${p2 >= p1 ? 'text-primary' : 'text-white/40'}`}>
              {data2.gamified.tier}
            </div>
            <div className="text-center text-[10px] uppercase tracking-widest text-white/20">{data2.gamified.class}</div>
          </motion.div>
        </div>

        <div className="glass p-4 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 space-y-1">
            <StatRow label="Commits" val1={data1.totalCommits} val2={data2.totalCommits} />
            <StatRow label="PRs" val1={data1.totalPRs} val2={data2.totalPRs} />
            <StatRow label="Issues" val1={data1.totalIssues} val2={data2.totalIssues} />
            <StatRow label="Streak" val1={data1.longestStreak} val2={data2.longestStreak} />
            <StatRow label="Repos" val1={data1.totalReposContributedTo} val2={data2.totalReposContributedTo} />
            <StatRow label="Power" val1={data1.gamified.powerLevel} val2={data2.gamified.powerLevel} />
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-24 p-8 md:p-12 glass rounded-[30px] md:rounded-[40px] border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent text-center"
        >
          <Trophy className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-4 md:mb-6" />
          <h3 className="text-2xl md:text-4xl font-bold mb-4">The Verdict</h3>
          <p className="text-sm md:text-xl text-white/80 leading-relaxed mb-6 md:mb-8 text-center">
            Based on the sheer volume of commits and the absolute power levels computed...<br />
            <span className="text-primary font-black uppercase text-xl md:text-3xl italic break-words block mt-4">
               {p1 === p2 ? "It's a legendary draw!" : `${ultimateWinner.username} dominates the terminal.`}
            </span>
          </p>
          <p className="text-white/40 italic text-xs md:text-base text-center">
            {p1 > p2 
              ? `${user1} is probably typing right now while ${user2} is "documenting".`
              : `${user2} is clearly a machine disguised as a human.`}
          </p>
        </motion.div>
      </div>

      <footer className="mt-24 text-center py-12 border-t border-white/5 flex flex-col items-center gap-6">
         <button 
           onClick={() => navigate('/')}
           className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform cursor-pointer"
         >
           Create your own Wrapped
         </button>
      </footer>
    </main>
  );
}
