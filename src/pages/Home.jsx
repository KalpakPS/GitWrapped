import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Zap, Star, LogOut, ChevronRight } from 'lucide-react';
import { Github } from '../components/Icons';
import packageJson from '../../package.json';
import PatchNotesModal from '../components/PatchNotesModal';

export default function Home() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null); // { loggedIn: boolean, user: string }
  const [isBattleModalOpen, setIsBattleModalOpen] = useState(false);
  const [showAuthSuccess, setShowAuthSuccess] = useState(false);
  const [battleUser1, setBattleUser1] = useState('');
  const [battleUser2, setBattleUser2] = useState('');
  const [totalRecaps, setTotalRecaps] = useState(0);
  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        if (data.loggedIn) setUser(data);
      } catch (err) {
        console.error('Error fetching session:', err);
      }
    };
    
    const fetchTotalCount = async () => {
      try {
        const response = await fetch('/api/total-count');
        const data = await response.json();
        if (data.total) setTotalRecaps(data.total);
      } catch (err) {
        console.error('Error fetching total count:', err);
      }
    };

    fetchSession();
    fetchTotalCount();

    // Check for auth success in URL
    const url = new URL(window.location.href);
    if (url.searchParams.get('auth_success')) {
      setShowAuthSuccess(true);
      setTimeout(() => setShowAuthSuccess(false), 5000);
      
      // Remove the param without refreshing
      url.searchParams.delete('auth_success');
      window.history.replaceState({}, '', url.pathname);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      // Track event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_recap', {
          'username': username.trim()
        });
      }
      navigate(`/results/${username.trim()}`);
    }
  };

  const handleBattle = (e) => {
    e.preventDefault();
    if (battleUser1.trim() && battleUser2.trim()) {
      // Track event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'start_battle', {
          'user1': battleUser1.trim(),
          'user2': battleUser2.trim()
        });
      }
      navigate(`/compare/${battleUser1.trim()}/${battleUser2.trim()}`);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 pt-16 md:pt-12 pb-12 overflow-x-hidden text-white">
      <div className="wrapped-bg" />
      
      {/* Success Notification */}
      <AnimatePresence>
        {showAuthSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-full px-4"
          >
            <div className="glass px-6 py-4 rounded-2xl border border-primary/30 flex items-center gap-4 bg-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/20">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Github className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white leading-tight">Sync Successful!</p>
                <p className="text-[11px] text-white/50">Your private activity is now visible.</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Version Tag */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        onClick={() => setIsPatchNotesOpen(true)}
        className="fixed top-6 right-6 z-50 text-white/20 text-[10px] font-mono tracking-widest uppercase hover:text-primary transition-all duration-300 group/version flex items-center gap-1.5 cursor-pointer select-none bg-white/5 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 active:scale-95"
      >
        <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
        v{packageJson.version}
      </motion.button>
      
      {/* Patch Notes Modal */}
      <PatchNotesModal 
        isOpen={isPatchNotesOpen} 
        onClose={() => setIsPatchNotesOpen(false)} 
      />

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
          className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 border border-white/20 mb-6 md:mb-8 backdrop-blur-md group/badge"
        >
          <Github className="w-3.5 h-3.5 md:w-4 h-4" />
          <span className="text-xs md:text-sm font-medium">GitWrapped</span>
          <a 
            href="https://github.com/KalpakPS/GitWrapped" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 ml-1 pl-2 border-l border-white/20 hover:text-yellow-400 transition-all duration-300 group-hover/badge:border-white/40"
            title="Star on GitHub"
          >
            <Star className="w-3 h-3 md:w-3.5 md:h-3.5 hover:fill-yellow-400" />
          </a>
        </motion.div>

        <h1 className="text-3xl sm:text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-4 tracking-tight leading-tight md:leading-none">
          Your <span className="text-primary italic">365 Days</span> in Code.
        </h1>
        <p className="text-primary uppercase tracking-[0.4em] font-black text-[10px] md:text-xs mb-8 opacity-80">Rolling Yearly Statistics</p>
        
        <p className="text-base md:text-xl text-white/60 mb-8 md:mb-12 max-w-2xl mx-auto px-2 text-center">
           Analyze your last 365 days of activity, celebrate your growth, and unwrap your true developer potential.
        </p>


        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto group mb-8">
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

        {totalRecaps >= 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/40 text-[10px] md:text-sm font-medium mt-6"
          >
            Join <span className="text-white font-bold">{totalRecaps.toLocaleString()}+</span> developers who've unboxed their year.
          </motion.p>
        )}
      </motion.div>

      {/* Quick Actions (Battle & Auth) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-4 z-10"
      >
        {!user ? (
          <button
            onClick={handleLogin}
            className="group flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/10 cursor-pointer"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Github className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 font-bold">Privacy</p>
              <p className="text-xs md:text-sm font-bold text-white">Authorize Private</p>
            </div>
          </button>
        ) : (
          <div className="group flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-5 md:py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Github className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            </div>
            <div className="text-left mr-1 md:mr-2">
              <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-primary font-bold">Authorized</p>
              <p className="text-xs md:text-sm font-bold text-white">@{user.user}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsBattleModalOpen(true)}
          className="group flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/10 cursor-pointer"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 font-bold">New Feature</p>
            <p className="text-xs md:text-sm font-bold text-white">Battle a Friend</p>
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

      {/* Featured SEO Content */}
      <section className="mt-24 mb-16 max-w-5xl w-full px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-primary font-bold mb-3 uppercase tracking-wider text-xs">Unlock Identity</h2>
            <h3 className="text-xl font-bold mb-3">What is GitWrapped?</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              GitWrapped (also known as <span className="text-white">GitHub Wrapped</span>) is a rolling 365-day review of your coding journey. We analyze your contributions, stars, and languages to find your developer identity.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-primary font-bold mb-3 uppercase tracking-wider text-xs">Interactive Stats</h2>
            <h3 className="text-xl font-bold mb-3">Visualize Growth</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Discover your developer class, unlock achievements, and see your language distribution over the last 365 days. Your growth is analyzed to generate a personalized power level.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-primary font-bold mb-3 uppercase tracking-wider text-xs">Play & Compare</h2>
            <h3 className="text-xl font-bold mb-3">Code Battles</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Compare your yearly stats with friends in a head-to-head Code Battle. See who had the most commits, stars, and PRs in the last 365 days on <span className="text-white">GitHub</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Hidden SEO Content for Crawlers */}
      <section className="sr-only">
        <h2>GitHub Wrapped 2026 & 2025</h2>
        <p>
          GitWrapped is the ultimate GitHub stats visualizer. Whether it's GitHub Wrapped 2026 or 2025, you can get a live look at your coding trends.
        </p>
      </section>

      <footer className="mt-auto py-8 text-white/10 text-[10px] z-10 font-medium tracking-widest uppercase">
        Inspired by Spotify Wrapped • GitWrapped
      </footer>
    </main>
  );
}
