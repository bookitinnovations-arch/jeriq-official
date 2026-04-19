import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Music, ExternalLink } from 'lucide-react';

interface AlbumDetailsProps {
  album: any;
  onClose: () => void;
}

export default function AlbumDetails({ album, onClose }: AlbumDetailsProps) {
  if (!album) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-end md:p-6"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-black/90 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full md:w-[600px] h-full bg-brand-black border-l border-white/10 p-12 overflow-y-auto custom-scrollbar"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
        >
          <X size={32} />
        </button>

        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <div className="w-48 h-48 rounded-sm overflow-hidden shadow-2xl glass-card">
              <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <span className="text-brand-blue font-bold tracking-[0.5em] text-[10px] uppercase">
                {album.type} • {album.year}
              </span>
              <h2 className="text-5xl md:text-7xl font-display text-white text-glow">
                {album.title.toUpperCase()}
              </h2>
            </div>
          </div>

          {/* Tracklist */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-display tracking-widest text-white/60">TRACKLIST</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <div className="grid gap-4">
              {album.tracks.map((track: string, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={track}
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <span className="text-xs font-mono text-white/20 group-hover:text-brand-blue transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-white/80 group-hover:text-white transition-all group-hover:tracking-wider">
                    {track}
                  </span>
                  <Play size={14} className="opacity-0 group-hover:opacity-100 text-brand-blue" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Streaming Links */}
          <div className="grid grid-cols-2 gap-4">
            <a href="#" className="flex items-center justify-center gap-3 py-4 bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-xl text-[#1DB954] hover:bg-[#1DB954]/20 transition-all font-bold tracking-widest text-[10px] uppercase">
              Spotify <ExternalLink size={12} />
            </a>
            <a href="#" className="flex items-center justify-center gap-3 py-4 bg-[#FC3C44]/10 border border-[#FC3C44]/20 rounded-xl text-[#FC3C44] hover:bg-[#FC3C44]/20 transition-all font-bold tracking-widest text-[10px] uppercase">
              Apple Music <ExternalLink size={12} />
            </a>
            <a href="#" className="flex items-center justify-center gap-3 py-4 bg-[#e52d27]/10 border border-[#e52d27]/20 rounded-xl text-[#e52d27] hover:bg-[#e52d27]/20 transition-all font-bold tracking-widest text-[10px] uppercase">
              Boomplay <ExternalLink size={12} />
            </a>
            <a href="#" className="flex items-center justify-center gap-3 py-4 bg-[#ff8c00]/10 border border-[#ff8c00]/20 rounded-xl text-[#ff8c00] hover:bg-[#ff8c00]/20 transition-all font-bold tracking-widest text-[10px] uppercase">
              Audiomack <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
