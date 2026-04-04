import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWrappedData, getAIGeneration } from '../lib/github';
import { motion } from 'framer-motion';
import { Swords, Trophy, Loader2, ArrowLeft, Radio, Download, Share2 } from 'lucide-react';
import { Github } from '../components/Icons';
import AnimatedNumber from '../components/AnimatedNumber';
import BattleCard from '../components/BattleCard';
import { toPng } from 'html-to-image';

const StatRow = ({ label, val1, val2 }) => {
  const v1 = typeof val1 === 'number' ? val1 : 0;
  const v2 = typeof val2 === 'number' ? val2 : 0;
  const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

  return (
    <div className="grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_120px_1fr] items-center py-3 md:py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 md:px-4 rounded-xl">
      <div className={`text-right text-sm md:text-base ${winner === 1 ? 'text-primary font-bold' : 'text-white/60'}`}>
        {typeof val1 === 'number' ? <AnimatedNumber value={val1} duration={3} /> : val1}
      </div>
      <div className="text-center text-[7px] md:text-xs uppercase tracking-tighter md:tracking-widest text-white/30 font-black px-1">{label}</div>
      <div className={`text-left text-sm md:text-base ${winner === 2 ? 'text-primary font-bold' : 'text-white/60'}`}>
        {typeof val2 === 'number' ? <AnimatedNumber value={val2} duration={3} /> : val2}
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
  const [commentary, setCommentary] = useState('');
  const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = React.useRef(null);

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

  useEffect(() => {
    if (data1 && data2 && !commentary && !isGeneratingCommentary) {
      const fetchCommentary = async () => {
        setIsGeneratingCommentary(true);
        try {
          const stats1 = {
            username: user1,
            tier: data1.gamified.tier,
            archetype: data1.gamified.class,
            commits: data1.totalCommits,
            pullRequests: data1.totalPRs,
            streak: data1.longestStreak,
            power: data1.gamified.powerLevel
          };
          const stats2 = {
            username: user2,
            tier: data2.gamified.tier,
            archetype: data2.gamified.class,
            commits: data2.totalCommits,
            pullRequests: data2.totalPRs,
            streak: data2.longestStreak,
            power: data2.gamified.powerLevel
          };
          const msg = await getAIGeneration(user1, {}, 'battle', stats1, stats2);
          setCommentary(msg);
        } catch (err) {
          console.error('Commentary error:', err);
        } finally {
          setIsGeneratingCommentary(false);
        }
      };
      fetchCommentary();
    }
  }, [data1, data2, user1, user2]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    
    // Track download event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'download_battle_result', {
        'user1': user1,
        'user2': user2
      });
    }

    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `codebattle-${user1}-vs-${user2}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Code Battle Result',
      text: `🔥 Code Battle! @${user1} vs @${user2}. Check out who won! #GitWrapped`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

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
        <header className="text-center mb-16 mt-16 md:mt-0">
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

        {(isGeneratingCommentary || commentary) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 p-6 md:p-8 glass rounded-3xl border border-white/5 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Radio className={`w-4 h-4 ${isGeneratingCommentary ? 'text-primary animate-pulse' : 'text-primary/40'}`} />
                {isGeneratingCommentary && <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full animate-pulse" />}
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40">AI Commentary</span>
            </div>

            {isGeneratingCommentary ? (
              <div className="flex items-center gap-3 py-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <p className="text-sm md:text-base text-white/30 font-mono animate-pulse">Analyzing combat patterns...</p>
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm md:text-lg text-white/90 font-medium leading-relaxed italic"
              >
                "{commentary}"
              </motion.p>
            )}

            <div className="absolute top-0 right-0 p-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
            </div>
          </motion.div>
        )}

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

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 md:mt-24 pt-12 md:pt-24 border-t border-white/5 flex flex-col items-center px-4"
        >
          <div className="text-center mb-12">
            <h3 className="text-xl md:text-3xl font-bold mb-4">Share Your Victory</h3>
            <p className="text-white/40 text-sm md:text-base">Download the official match report and show the world who's the 10x developer.</p>
          </div>

          {/* Card preview - responsive scaling */}
          <div className="relative mb-8 md:mb-12 w-full flex justify-center h-[210px] md:h-[500px] lg:h-[620px] overflow-hidden">
            <div className="absolute top-0 origin-top scale-[0.33] md:scale-[0.8] lg:scale-100 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
               <BattleCard 
                 ref={cardRef}
                 user1={user1}
                 user2={user2}
                 data1={data1}
                 data2={data2}
               />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
             <button 
               onClick={handleDownload}
               disabled={isDownloading}
               className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl sm:rounded-2xl hover:scale-105 transition-all cursor-pointer shadow-lg shadow-white/5 disabled:opacity-50 text-sm sm:text-base"
             >
               {isDownloading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Download className="w-4 h-4 sm:w-5 sm:h-5" />}
               {isDownloading ? 'Generating...' : 'Download Card'}
             </button>
             
             <button 
               onClick={handleShare}
               className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl sm:rounded-2xl hover:scale-105 transition-all cursor-pointer shadow-lg border border-white/10 text-sm sm:text-base"
             >
               <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
               Share Link
             </button>
          </div>
        </motion.div>
      </div>

      <footer className="mt-12 md:mt-24 text-center py-12 flex flex-col items-center gap-6">
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
