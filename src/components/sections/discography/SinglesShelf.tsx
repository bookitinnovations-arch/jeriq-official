import { motion } from 'motion/react';
import { DISCOGRAPHY } from '@/constants/jeriqData';

export default function SinglesShelf() {
  return (
    <div className="w-full mt-32 px-6">
      <div className="flex items-center justify-between mb-12">
        <h3 className="text-3xl font-display text-white tracking-widest text-glow">2025 – 2026 Singles</h3>
        <span className="text-[10px] tracking-[0.5em] text-white/30 uppercase">Swipe to browse →</span>
      </div>

      <div className="flex overflow-x-auto gap-8 pb-12 hide-scrollbar snap-x">
        {DISCOGRAPHY.singles2025_2026.map((single, idx) => (
          <motion.div
            key={single.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex-shrink-0 w-64 snap-center group"
          >
            <div className="aspect-square rounded-sm overflow-hidden relative mb-6 glass-card border border-white/5 transition-all duration-500 group-hover:border-brand-blue/30">
              <img 
                src={single.cover} 
                alt={single.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {single.year === '2026' && (
                <div className="absolute top-4 left-4 bg-brand-blue text-[8px] font-bold tracking-[0.2em] px-3 py-1 rounded-full uppercase z-10 animate-pulse">
                  Latest 2026
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-display text-lg tracking-tight group-hover:text-brand-blue transition-colors">
                {single.title.toUpperCase()}
              </h4>
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
                {single.collab ? `ft. ${single.collab}` : 'Official Single'} • {single.year}
              </p>
              {single.note && (
                <p className="text-[9px] italic text-brand-blue/60">{single.note}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
