import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';

export default function LoyaltyOath() {
  const { isLoyal, setLoyal, setUserName, setUserRank } = useApp();
  const [oath, setOath] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [stampActive, setStampActive] = useState(false);

  if (isLoyal && !stampActive) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = oath.trim().toLowerCase();
    
    if (normalized === 'iyoo cartel for life') {
      setStampActive(true);
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1a47b8', '#F5F5F5']
      });
      
      setTimeout(() => {
        setLoyal(true);
        setUserRank('East Soldier');
        setStampActive(false);
      }, 3000);
    } else {
      setShaking(true);
      setError(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] bg-brand-black flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          animate={shaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="glass-card p-12 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue" />
          
          <h2 className="text-4xl mb-6 text-glow">The Loyalty Oath</h2>
          <p className="text-sm text-white/60 mb-8 leading-relaxed italic">
            "I have signed an undertaken... are you loyal to the street?"
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={oath}
              onChange={(e) => setOath(e.target.value)}
              placeholder="type your oath..."
              className="w-full bg-brand-black/50 border border-white/10 rounded-xl px-6 py-4 text-center text-white focus:outline-none focus:border-brand-blue transition-colors font-mono"
            />
            
            <button
              type="submit"
              className="w-full bg-brand-blue hover:bg-brand-blue-glow text-white py-4 rounded-xl font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(26,71,184,0.3)]"
            >
              Sign Undertaken
            </button>
          </form>

          <AnimatePresence>
            {stampActive && (
              <motion.div
                initial={{ scale: 2, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: -10 }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <div className="border-8 border-brand-blue text-brand-blue px-8 py-4 rounded-3xl font-display text-4xl md:text-6xl uppercase tracking-tighter bg-brand-black/80 backdrop-blur-md shadow-[0_0_50px_rgba(26,71,184,0.8)]">
                  Cartel Member Confirmed
                </div>
              </motion.div>
            )}
            
            {error && !stampActive && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-red-500 font-bold text-sm"
              >
                Samba ga emekwa ife actor melu boss 😂
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Background Particles Decoration */}
      <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-brand-blue rounded-full animate-ping [animation-delay:1s]" />
      </div>
    </motion.div>
  );
}
