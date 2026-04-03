import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Sparkles, Flame, Zap, Check, ChevronRight, Loader2 } from 'lucide-react';

const LOADING_MESSAGES = {
  roast: [
    "Sharpening the tongue...",
    "Consulting the archives of shame...",
    "Finding the perfect burn...",
    "Analyzing your commit regrets...",
    "Groq is feeling particularly savage today..."
  ],
  hype: [
    "Charging the hype cannons...",
    "Amplifying your legend...",
    "Consulting the hall of fame...",
    "Gathering the energy of a thousand stars...",
    "Groq is getting ready to yell..."
  ]
};

export default function AIModal({ isOpen, onClose, mode, username, stats, onGenerate }) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      handleGenerate();
      
      const messages = LOADING_MESSAGES[mode];
      setLoadingMessage(messages[0]);
      const interval = setInterval(() => {
        setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, mode]);

  const handleGenerate = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    try {
      const result = await onGenerate(mode);
      setResponse(result);
    } catch (err) {
      if (retryCount < 1) {
        // Wait 1.5s and retry once
        setLoadingMessage("Retrying in a moment...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return handleGenerate(retryCount + 1);
      }
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: isRoast ? 'I just got Roasted! 🔥' : 'I just got Hyped! ✨',
      text: `"${response}"\n\nCheck out my #GitWrapped stats:`,
      url: `${window.location.origin}/results/${username}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Share to Twitter
      const text = encodeURIComponent(`${shareData.title}\n\n${shareData.text}`);
      const url = encodeURIComponent(shareData.url);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  const isRoast = mode === 'roast';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-3xl border ${
              isRoast ? 'border-orange-500/30' : 'border-primary/30'
            } bg-black/60 backdrop-blur-xl shadow-2xl p-5 md:p-8 flex flex-col max-h-[90vh]`}
          >
            {/* Background Glow */}
            <div className={`absolute -top-24 -left-24 w-64 h-64 blur-[100px] opacity-20 pointer-events-none rounded-full ${
              isRoast ? 'bg-orange-600' : 'bg-primary'
            }`} />
            <div className={`absolute -bottom-24 -right-24 w-64 h-64 blur-[100px] opacity-20 pointer-events-none rounded-full ${
              isRoast ? 'bg-red-600' : 'bg-blue-600'
            }`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-8 relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isRoast ? 'bg-orange-500/20' : 'bg-primary/20'}`}>
                  {isRoast ? (
                    <Flame className="w-6 h-6 text-orange-500" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {isRoast ? 'The AI Roast' : 'The AI Hype'}
                  </h3>
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">GitWrapped</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content with hidden scrollbar */}
            <div className="flex-1 flex flex-col justify-center relative z-10 overflow-y-auto overflow-x-hidden min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {loading ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <Loader2 className={`w-10 h-10 animate-spin ${isRoast ? 'text-orange-500' : 'text-primary'}`} />
                  <p className="text-white/60 font-medium text-center italic">
                    {loadingMessage}
                  </p>
                </div>
              ) : error ? (
                <div className="text-center p-6 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button 
                    onClick={handleGenerate}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="relative py-2">
                    <span className="absolute -left-1 -top-1 md:-left-2 md:-top-2 text-2xl md:text-4xl text-white/10 italic serif font-bold">"</span>
                    <p className="text-sm md:text-xl text-white/90 font-medium leading-relaxed px-2 md:px-4 text-center">
                      {response}
                    </p>
                    <span className="absolute -right-1 -bottom-1 md:-right-2 md:-bottom-2 text-2xl md:text-4xl text-white/10 italic serif font-bold">"</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4 shrink-0">
                    <button
                      onClick={handleShare}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-xl hover:bg-white/90 transition-all active:scale-95 cursor-pointer shadow-lg shadow-white/5 text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`flex-1 flex items-center justify-center gap-2 border font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-xl transition-all active:scale-95 cursor-pointer text-sm ${
                        copied 
                        ? 'bg-green-500/20 border-green-500/40 text-green-400' 
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer decoration */}
            <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between z-10 relative shrink-0">
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRoast ? 'bg-orange-500 animate-pulse' : 'bg-primary animate-pulse'}`} />
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">System Online</span>
               </div>
               <span className="text-[10px] text-white/20 font-mono">@{username.toUpperCase()}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
