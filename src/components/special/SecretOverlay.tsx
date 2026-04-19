import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Crown, MapPin, Music } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SecretOverlayProps {
  type: 'IYOO' | 'LONDON';
  onClose: () => void;
}

export default function SecretOverlay({ type, onClose }: SecretOverlayProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (type === 'IYOO') {
      setContent("OGBE!!! I see you've found the digital high table. Loyalty is the only currency here. The crown of the East isn't just worn; it's earned every single day. Keep believing in the Billion Dollar Dream. Iyoo!!!");
    } else {
      setContent("From the streets of Enugu to the blocks of London. Breaking boundaries, crossing oceans. Mentioning Knucks — the vibe remains original. The East is global now. Respect the sovereignty.");
    }
  }, [type]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-brand-black/95 backdrop-blur-3xl p-6"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
        >
          <X size={40} />
        </button>

        <motion.div
           initial={{ scale: 0.9, y: 20 }}
           animate={{ scale: 1, y: 0 }}
           className="max-w-3xl w-full glass-card p-12 rounded-3xl border-brand-blue relative overflow-hidden"
        >
           {/* UK Overlay theme */}
           {type === 'LONDON' && (
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <MapPin size={200} className="text-white" />
             </div>
           )}

           <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="p-4 bg-brand-blue/20 rounded-full">
                 {type === 'IYOO' ? <Crown className="text-brand-blue" size={48} /> : <Music className="text-brand-blue" size={48} />}
              </div>

              <h2 className="text-5xl font-display text-white tracking-widest uppercase italic">
                {type === 'IYOO' ? "CARTEL TRANSMISSION" : "OGBE IN LONDON"}
              </h2>

              <p className="text-xl font-display text-white/60 leading-relaxed italic uppercase tracking-widest">
                {content}
              </p>

              <div className="flex items-center gap-4">
                 <Zap className="text-brand-blue animate-pulse" />
                 <span className="text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase">End of Message</span>
                 <Zap className="text-brand-blue animate-pulse" />
              </div>
           </div>

           {/* Animated Background Pulse */}
           <div className="absolute inset-0 bg-brand-blue/5 animate-pulse pointer-events-none" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
