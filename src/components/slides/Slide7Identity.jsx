import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import DeveloperCard from '../DeveloperCard';
import { Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function Slide7Identity({ data }) {
  const cardRef = useRef(null);

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    
    // Track download event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'download_card', {
        'username': data.username
      });
    }

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

  const handleShare = async () => {
    // Track share event using standard GA4 "share" event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'share', {
        'method': 'universal',
        'content_type': 'recap',
        'item_id': data.username
      });
    }

    const shareData = {
      title: 'GitWrapped',
      text: `✨ GitWrapped! I'm a ${data.gamified.class} wielding ${data.gamified.element.split(' ')[1]} with a Power Level of ${data.gamified.powerLevel.toLocaleString()}! Can you beat my ${data.gamified.tier} stats? 🚀💻`,
      url: `${window.location.origin}/results/${data.username}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      handleCopy();
    }
  };

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    // Track copy event using standard GA4 "share" event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'share', {
        'method': 'copy_link',
        'content_type': 'recap',
        'item_id': data.username
      });
    }
    
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
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl text-sm md:text-base shrink-0 cursor-pointer hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
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
