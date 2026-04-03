import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, History, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { patchNotes } from '../data/patchNotes';

export default function PatchNotesModal({ isOpen, onClose }) {
  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] md:max-h-[75vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <History className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Timeline</h2>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-none mt-1">Updates & Hotfixes</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Timeline List */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="relative space-y-12">
              {/* Vertical Line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent" />

              {patchNotes.map((note, idx) => (
                <div key={note.version} className="relative pl-12 group">
                  {/* Point */}
                  <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-2 bg-black flex items-center justify-center transition-all duration-500 z-10 ${
                    idx === 0 
                    ? 'border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] scale-110' 
                    : 'border-white/10 group-hover:border-white/30'
                  }`}>
                    {idx === 0 ? (
                      <Sparkles className="w-4 h-4 text-primary" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white" />
                    )}
                  </div>

                  {/* Header Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded-md ${
                        idx === 0 ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-white/10'
                      }`}>
                        v{note.version}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] font-black uppercase tracking-tighter bg-white text-black px-1.5 rounded shadow-sm">Updated</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-white/30">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{note.date}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className={`p-5 rounded-2xl border transition-all duration-500 ${
                    idx === 0 
                    ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' 
                    : 'bg-white/[0.02] border-white/5 group-hover:bg-white/[0.04]'
                  }`}>
                    <h3 className="text-lg font-bold text-white mb-4 group-hover:text-primary transition-colors">
                      {note.title}
                    </h3>
                    
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {note.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5 text-xs text-white/60 leading-relaxed group/item">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary/40 group-hover/item:text-primary shrink-0 transition-colors mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {note.notes && (
                      <div className="mt-6 pt-4 border-t border-white/5">
                        <p className="text-[11px] text-white/30 italic italic-serif leading-relaxed">
                          {note.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Footer */}
          <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 shrink-0">
             <span>GitWrapped Changelog</span>
             <ChevronRight className="w-3 h-3 opacity-50" />
             <span className="text-white/40">Latest: {patchNotes[0].version}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
