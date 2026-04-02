import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import DeveloperCard from '../DeveloperCard';
import { Download, Share2 } from 'lucide-react';
import { Twitter } from '../Icons';
import { toPng } from 'html-to-image';

export default function Slide7Identity({ data }) {
  const cardRef = useRef(null);

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `gitwrapped-${data.username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading card:', err);
    }
  };

  const shareTwitter = () => {
    const text = `My GitHub Power Level is ${data.gamified.powerLevel.toLocaleString()} (${data.gamified.tier}). I'm a ${data.gamified.class} wielding ${data.gamified.element}. What's yours? 🔥 https://gitwrapped.kalpakps.site/results/${data.username} #GitWrapped`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/results/${data.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="slide-container !flex-col md:!flex-row items-center justify-center gap-4 md:gap-16 px-4 md:px-12 py-8 overflow-hidden">
      {/* Left Side: Card */}
      <motion.div
        initial={{ opacity: 0, x: -50, rotate: -2 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="z-10 scale-[0.4] sm:scale-[0.55] md:scale-[0.75] lg:scale-[0.85] origin-center shrink-0"
      >
        <div className="md:my-0 -my-35">
           <DeveloperCard data={data} ref={cardRef} />
        </div>
      </motion.div>

      {/* Right Side: Content */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md md:max-w-xl space-y-4 md:space-y-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span className="text-primary uppercase tracking-[0.3em] font-bold text-[10px] md:text-xs mb-1 md:mb-4 block">Identity Forged</span>
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-2 md:mb-4 shrink-0">You're a Regular Legend.</h2>
          <p className="text-white/40 text-xs md:text-lg">Your card is ready. Download it or share it with your network to show off your journey.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadCard}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl text-sm md:text-base transition-colors hover:bg-white/90 cursor-pointer"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5" />
            Download
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareTwitter}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1DA1F2] text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl text-sm md:text-base shrink-0 cursor-pointer"
          >
            <Twitter className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            Share
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden md:flex flex-col gap-2 md:gap-4 w-full pt-4 md:pt-8 border-t border-white/10"
        >
          <div className="flex items-center gap-4 text-white/40">
            <Share2 className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Link:</span>
          </div>
          <div className="flex gap-2">
            <input 
              readOnly 
              value={`${window.location.origin}/results/${data.username}`}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 py-1 md:px-4 md:py-2 text-[10px] md:text-sm text-white/60 outline-none"
            />
            <button 
              onClick={handleCopy}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm transition-all cursor-pointer ${
                copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
