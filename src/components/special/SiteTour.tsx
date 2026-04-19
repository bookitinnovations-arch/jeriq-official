import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Camera } from 'lucide-react';

export default function SiteTour() {
  const [isActive, setIsActive] = useState(false);
  const tourRef = useRef<HTMLDivElement>(null);

  const startTour = () => {
    setIsActive(true);
    // Give time for overlay to mount
    setTimeout(() => {
      const tl = gsap.timeline({ onComplete: () => setIsActive(false) });
      
      // Sequence touring the site
      tl.to(window, { scrollTo: "#bio", duration: 4, ease: "power2.inOut" })
        .to(window, { scrollTo: "#discography", duration: 4, ease: "power2.inOut" })
        .to(window, { scrollTo: "#ai", duration: 4, ease: "power2.inOut" })
        .to(window, { scrollTo: "#lab", duration: 4, ease: "power2.inOut" })
        .to(window, { scrollTo: "#contact", duration: 4, ease: "power2.inOut" })
        .to(window, { scrollTo: 0, duration: 2, ease: "power2.inOut" });
    }, 100);
  };

  return (
    <>
      <button 
        id="tour-trigger"
        onClick={startTour}
        className="fixed bottom-32 right-8 z-[100] w-16 h-16 rounded-full bg-white/10 hover:bg-brand-blue border border-white/20 flex items-center justify-center transition-all group"
      >
        <Camera className="text-white group-hover:scale-110 transition-transform" size={24} />
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] pointer-events-none border-[40px] border-brand-blue/20"
          >
             <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-brand-black/80 px-8 py-3 rounded-full border border-brand-blue backdrop-blur-md">
                <span className="text-white font-display tracking-[0.4em] uppercase text-sm animate-pulse">Official Platform Tour in Progress</span>
             </div>
             <button 
               onClick={() => {
                 gsap.killTweensOf(window);
                 setIsActive(false);
               }}
               className="absolute top-20 right-20 pointer-events-auto w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white"
             >
                <X size={20} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
