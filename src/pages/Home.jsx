import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Zap } from 'lucide-react';
import { Github } from '../components/Icons';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isBattleModalOpen, setIsBattleModalOpen] = useState(false);
  const [battleUser1, setBattleUser1] = useState('');
  const [battleUser2, setBattleUser2] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/results/${username.trim()}`);
    }
  };

  const handleBattle = (e) => {
    e.preventDefault();
    if (battleUser1.trim() && battleUser2.trim()) {
      navigate(`/compare/${battleUser1.trim()}/${battleUser2.trim()}`);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 pt-16 md:pt-12 pb-12 overflow-x-hidden text-white">
      <div className="wrapped-bg" />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 border border-white/20 mb-6 md:mb-8 backdrop-blur-md"
        >
          <Github className="w-3.5 h-3.5 md:w-4 h-4" />
          <span className="text-xs md:text-sm font-medium">GitWrapped React is here</span>
        </motion.div>

        <h1 className="text-3xl sm:text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-4 tracking-tight leading-tight md:leading-none">
          Your <span className="text-primary italic">365 Days</span> in Code.
        </h1>
        <p className="text-primary uppercase tracking-[0.4em] font-black text-[10px] md:text-xs mb-8 opacity-80">Rolling Yearly Statistics</p>
        
        <p className="text-base md:text-xl text-white/60 mb-8 md:mb-12 max-w-2xl mx-auto px-2 text-center">
           Analyze your last 365 days of activity, celebrate your growth, and unwrap your true developer potential.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-black rounded-xl border border-white/10 p-1 md:p-2">
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white px-2.5 md:px-4 py-2 md:py-3 text-sm md:text-lg outline-none min-w-0"
            />
            <button
              type="submit"
              className="bg-white text-black px-3 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center gap-2 text-xs sm:text-base whitespace-nowrap cursor-pointer"
            >
              Go <Zap className="w-3 md:w-4 h-3 md:h-4 fill-current" />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Code Battle Entry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 flex items-center justify-center gap-4 z-10"
      >
        <button
          onClick={() => setIsBattleModalOpen(true)}
          className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/10 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">New Feature</p>
            <p className="text-sm font-bold text-white">Battle a Friend</p>
          </div>
        </button>
      </motion.div>

      {/* Battle Modal */}
      <AnimatePresence>
        {isBattleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBattleModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass p-8 rounded-3xl border border-white/10 bg-black/90"
            >
              <button 
                onClick={() => setIsBattleModalOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Initiate Battle</h2>
                <p className="text-white/40 text-sm">Compare your yearly stats with a rival developer.</p>
              </div>

              <form onSubmit={handleBattle} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-2">Player 1</label>
                    <input
                      autoFocus
                      required
                      type="text"
                      placeholder="Username 1"
                      value={battleUser1}
                      onChange={(e) => setBattleUser1(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/20 ml-2">Player 2</label>
                    <input
                      required
                      type="text"
                      placeholder="Username 2"
                      value={battleUser2}
                      onChange={(e) => setBattleUser2(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Let the Battle Begin
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden SEO Content for Crawlers */}
      <section className="sr-only">
        <h2>What is GitWrapped?</h2>
        <p>
          GitWrapped (also known as GitHub Wrapped) is a rolling yearly review of your coding activity. 
          Similar to Spotify Wrapped, it analyzes your GitHub contributions, commits, pull requests, 
          and repository stars over the last 365 days to generate a unique developer identity and power level.
        </p>
        <p>
          Discover your developer class, unlock achievements, and see your language distribution. 
          Compare your stats with friends in a Code Battle.
        </p>
      </section>

      <footer className="mt-auto py-8 text-white/10 text-[10px] z-10 font-medium tracking-widest uppercase">
        Inspired by Spotify Wrapped • GitWrapped
      </footer>
    </main>
  );
}
