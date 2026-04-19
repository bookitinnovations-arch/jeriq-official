import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { useEffect, useState } from 'react';

export default function Loader() {
  const { setHasSeenLoader } = useApp();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // OGBE Fades in
      await new Promise(r => setTimeout(r, 1000));
      setStep(1);
      
      // IYOO Crashes in
      await new Promise(r => setTimeout(r, 1500));
      setStep(2);

      // Final Assembly & Particle Burst
      await new Promise(r => setTimeout(r, 2000));
      setStep(3);

      // Finish
      await new Promise(r => setTimeout(r, 1000));
      setHasSeenLoader(true);
    };
    sequence();
  }, [setHasSeenLoader]);

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-brand-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative text-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.h1
              key="ogbe"
              className="text-8xl md:text-[12rem] font-display text-white"
            >
              {"OGBE".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          )}

          {step === 2 && (
            <motion.div
              key="iyoo"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotate: [0, -5, 5, -5, 5, 0],
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 10,
                rotate: { duration: 0.5, repeat: 1 }
              }}
              className="relative px-8"
            >
              <h1 className="text-8xl md:text-[15rem] font-display text-brand-blue drop-shadow-[0_0_30px_rgba(26,71,184,0.6)]">
                IYOO!!!
              </h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="h-2 bg-brand-blue mt-4"
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="assembly"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 border-4 border-brand-blue rounded-full flex items-center justify-center mb-8"
              >
                <div className="w-20 h-20 bg-brand-blue rounded-full animate-pulse" />
              </motion.div>
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1 }}
                  className="w-full h-full bg-brand-blue"
                />
              </div>
              <p className="mt-4 text-[10px] tracking-[0.5em] text-white/50 uppercase">Assembling Civilization</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Gradients */}
      <div className="absolute inset-0 z-[-1] opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue rounded-full blur-[120px]" />
      </div>
    </motion.div>
  );
}
