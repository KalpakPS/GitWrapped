import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWrappedData } from '../lib/github';
import WrappedLayout from '../components/WrappedLayout';
import Slide1Numbers from '../components/slides/Slide1Numbers';
import Slide2Power from '../components/slides/Slide2Power';
import Slide3DNA from '../components/slides/Slide3DNA';
import Slide4Heatmap from '../components/slides/Slide4Heatmap';
import Slide5Hits from '../components/slides/Slide5Hits';
import Slide6Achievements from '../components/slides/Slide6Achievements';
import Slide7Identity from '../components/slides/Slide7Identity';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';

const LOADING_MESSAGES = [
  "Reverse-engineering your late-night commits...",
  "Counting your semicolons...",
  "Judging your variable names...",
  "Calculating your git blame regrets...",
  "Forging your developer identity...",
  "Analyzing your pull request etiquette...",
  "Measuring the length of your longest commit message...",
  "Checking for TODOs in your production code..."
];

export default function Results() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWrappedData(username);
        setData(result);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
      }
    };

    fetchData();

    // Loading screen animations
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(95, prev + Math.random() * 5));
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [username, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="wrapped-bg" />
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="glass p-12 rounded-3xl border border-red-500/20 max-w-md w-full"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-white/60 mb-8">{error}</p>
          <div className="flex gap-4">
             <button 
               onClick={() => window.location.reload()}
               className="flex-1 bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
             >
               <RefreshCcw className="w-4 h-4" /> Retry
             </button>
             <button 
               onClick={() => navigate('/')}
               className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl cursor-pointer"
             >
               Go Home
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="wrapped-bg" />
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse" />
            </div>
            
            <div className="space-y-4 w-full">
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
               </div>
               <p className="text-white/40 text-sm font-medium tracking-wide animate-pulse">
                {LOADING_MESSAGES[loadingMessageIndex]}
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <WrappedLayout onExit={() => navigate('/')}>
      <Slide1Numbers data={data} key="slide1" />
      <Slide2Power data={data} key="slide2" />
      <Slide3DNA data={data} key="slide3" />
      <Slide4Heatmap data={data} key="slide4" />
      <Slide5Hits data={data} key="slide5" />
      <Slide6Achievements data={data} key="slide6" />
      <Slide7Identity data={data} key="slide7" />
    </WrappedLayout>
  );
}
