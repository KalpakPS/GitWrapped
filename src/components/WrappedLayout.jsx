import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WrappedLayout({ children, onExit }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = children.length;
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onExit();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, onExit]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden select-none">
      <div className="wrapped-bg" />
      
      {/* Top Progress Bar */}
      <div className="flex gap-1 p-3 md:p-6 z-20 w-full max-w-4xl mx-auto backdrop-blur-sm">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentSlide(i)}
            className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer outline-none focus:ring-1 focus:ring-primary/50"
          >
            <motion.div
              initial={false}
              animate={{ width: i <= currentSlide ? '100%' : '0%' }}
              className="h-full bg-primary"
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>

      {/* Close Button */}
      <button 
        onClick={onExit}
        className="absolute top-2 right-2 md:top-6 md:right-6 text-white/40 hover:text-white transition-colors z-50 p-4 cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Slide Container */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full p-2 md:p-0 flex flex-col items-center justify-center">
               {children[currentSlide]}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute left-0 inset-y-0 w-16 md:w-32 flex items-center justify-center transition-opacity ${currentSlide === 0 ? 'opacity-0' : 'opacity-0 md:hover:opacity-100'} z-10`}
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
        </button>

        <button 
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className={`absolute right-0 inset-y-0 w-16 md:w-32 flex items-center justify-center transition-opacity ${currentSlide === totalSlides - 1 ? 'opacity-0' : 'opacity-0 md:hover:opacity-100'} z-10`}
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>

      {/* Mobile Tap Navigation */}
      <div className="absolute inset-0 flex pointer-events-none md:hidden z-30">
        <div className="w-1/4 h-full pointer-events-auto" onClick={prevSlide} />
        <div className="flex-1" />
        <div className="w-1/4 h-full pointer-events-auto" onClick={nextSlide} />
      </div>
    </div>
  );
}
