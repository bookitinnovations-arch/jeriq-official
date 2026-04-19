import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Play, Pause, SkipForward, Volume2, Users, Music } from 'lucide-react';
import { Howl } from 'howler';
import { cn } from '@/lib/utils';

import { useApp } from '@/context/AppContext';

const TRACKS = [
  { title: "Billion Dollar Dream", artist: "Jeriq", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Born To Be Great", artist: "Jeriq", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Ije Nwoke", artist: "Jeriq", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function IyooRadio() {
  const { isAudioEnabled } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!isAudioEnabled && isPlaying) {
      soundRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isAudioEnabled]);

  useEffect(() => {
    return () => {
      if (soundRef.current) soundRef.current.unload();
    };
  }, []);

  const togglePlay = () => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: [TRACKS[currentTrack].url],
        html5: true,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onend: () => handleNext(),
      });
    }

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const handleNext = () => {
    if (soundRef.current) soundRef.current.unload();
    const next = (currentTrack + 1) % TRACKS.length;
    setCurrentTrack(next);
    soundRef.current = new Howl({
      src: [TRACKS[next].url],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => handleNext(),
    });
    soundRef.current.play();
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex items-end">
       <button 
         onClick={() => setIsExpanded(!isExpanded)}
         className={cn(
           "w-16 h-16 rounded-full bg-brand-blue flex items-center justify-center shadow-[0_0_30px_rgba(26,71,184,0.6)] relative z-20 group transition-all",
           isExpanded && "rounded-r-none"
         )}
       >
          <div className="absolute inset-0 bg-brand-blue rounded-full animate-ping opacity-20" />
          <Radio className={cn("text-white transition-transform", isExpanded && "rotate-90")} size={24} />
       </button>

       <AnimatePresence>
         {isExpanded && (
           <motion.div
             initial={{ opacity: 0, x: -20, width: 0 }}
             animate={{ opacity: 1, x: 0, width: '320px' }}
             exit={{ opacity: 0, x: -20, width: 0 }}
             className="bg-brand-black border-2 border-brand-blue/30 rounded-r-2xl overflow-hidden shadow-2xl h-16 flex items-center px-6 gap-4 relative z-10"
           >
              <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-bold text-brand-blue-glow tracking-widest uppercase truncate animate-pulse">Now Playing</p>
                 <p className="text-xs text-white font-display uppercase tracking-widest truncate">{TRACKS[currentTrack].title}</p>
              </div>

              <div className="flex items-center gap-2">
                 <button onClick={togglePlay} className="p-2 text-white hover:text-brand-blue transition-colors">
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                 </button>
                 <button onClick={handleNext} className="p-2 text-white hover:text-brand-blue transition-colors">
                    <SkipForward size={18} fill="currentColor" />
                 </button>
              </div>

              <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                 <Users size={12} className="text-brand-blue" />
                 <span className="text-[10px] font-mono text-white/40">{Math.floor(Math.random() * 400 + 100)}</span>
              </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
