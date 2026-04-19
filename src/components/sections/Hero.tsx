import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ChevronDown, Play } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useSoundLayer } from '@/hooks/useSoundLayer';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Hero() {
  const { userRank } = useApp();
  const { isClapped, isAudioEnabled } = useSoundLayer(useApp().isAudioEnabled);
  const [isShaking, setIsShaking] = useState(false);
  const [memberCount, setMemberCount] = useState(14832); // Baseline fallback
  const containerRef = useRef<HTMLDivElement>(null);

  // Live Fan Counter Sync
  useEffect(() => {
    const q = query(collection(db, 'fan_messages'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMemberCount(14832 + snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  // Clap detection effects
  useEffect(() => {
    if (isClapped && isAudioEnabled) {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#1a47b8', '#ffffff']
      });
    }
  }, [isClapped, isAudioEnabled]);
  
  const { scrollY } = useScroll();
  
  // Parallax transforms for "3D Depth illusion"
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);   // Moves slowest
  const yMid = useTransform(scrollY, [0, 1000], [0, -100]); // Moves opposite
  const yText = useTransform(scrollY, [0, 1000], [0, -300]); // Moves fastest

  // Screen Shake every 8 seconds (Bass Drop Simulation)
  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }, 8000);
    return () => clearInterval(shakeInterval);
  }, []);

  const letters = "JERIQ".split("");

  return (
    <section 
      ref={containerRef}
      className={cn(
        "relative h-[110vh] w-full flex flex-col items-center justify-center overflow-hidden bg-brand-black transition-transform duration-100",
        isShaking && "animate-[shake_0.5s_ease-in-out_infinite]"
      )}
    >
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>

      {/* Parallax Background Layer */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/seed/jeriq-galaxy/1920/1080?grayscale&blur=2"
          alt="Jeriq Galaxy"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-25 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black" />
        <div className="absolute inset-0 bg-brand-blue/5 mix-blend-color" />
      </motion.div>

      {/* Depth Layer Content */}
      <motion.div 
        style={{ y: yMid }}
        className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none opacity-40"
      >
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#1a47b855_0%,_transparent_70%)]" />
      </motion.div>

      {/* Main Content (Top Speed Layer) */}
      <motion.div style={{ y: yText }} className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 flex items-center justify-center gap-3 backdrop-blur-sm bg-white/5 py-1 px-4 rounded-full border border-white/10"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
          <span className="text-[10px] font-bold tracking-[0.4em] text-white/60 uppercase">
            {memberCount.toLocaleString()} Cartel members worldwide
          </span>
        </motion.div>

        <div className="overflow-hidden flex justify-center mb-6">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 200, opacity: 0, rotateX: -90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{
                duration: 1.5,
                delay: 0.1 * i,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="text-[22vw] md:text-[16vw] font-display leading-[0.7] tracking-tighter text-white inline-block text-glow"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-px w-32 bg-brand-blue shadow-[0_0_20px_rgba(26,71,184,1)] mb-4" />
          
          <div className="space-y-4">
            <h2 className="text-lg md:text-3xl font-medium tracking-[0.4em] text-white/90 uppercase">
              The Hussla from the East. <span className="text-brand-blue italic">Born to Be Great.</span>
            </h2>
            <p className="text-[10px] md:text-xs font-bold tracking-[0.5em] text-white/60 uppercase">
              First Igbo Artist · Pepsi Brand Ambassador · Iyoo Cartel CEO
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <div className="px-5 py-2 border border-brand-blue/40 rounded-full bg-brand-blue/10 backdrop-blur-xl">
              <span className="text-[10px] font-bold tracking-[0.3em] text-brand-blue-glow uppercase animate-pulse">Rank: {userRank}</span>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            <button 
              onClick={() => document.getElementById('tour-trigger')?.click()}
              className="group relative px-12 py-5 overflow-hidden rounded-sm bg-brand-blue transition-all hover:shadow-[0_0_30px_rgba(26,71,184,0.6)]"
            >
              <span className="relative z-10 text-xs font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <Play size={14} fill="white" />
                Watch Experience
              </span>
              <motion.div 
                className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" 
              />
            </button>
            <a 
              href="https://www.tiktok.com/share" 
              target="_blank"
              rel="noreferrer"
              className="group relative px-12 py-5 overflow-hidden border border-white/20 rounded-sm hover:border-brand-blue transition-all bg-white/5 backdrop-blur-md"
            >
              <span className="relative z-10 text-xs font-bold uppercase tracking-[0.4em]">Share to TikTok</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative vertical rails */}
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />
      <div className="absolute right-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />
    </section>
  );
}

// Helper for Tailwind Merge
