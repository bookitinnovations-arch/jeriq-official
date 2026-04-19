import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import Masonry from 'react-masonry-css';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  { id: '1', url: 'https://afrocritik.com/wp-content/uploads/2022/06/JERIQ-.jpg', title: 'Afrocritik Exclusive', category: 'Portraits' },
  { id: '2', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXsJ-sd4jf0c62gHzemmAS54DpeyYomLdHXw&s', title: 'Street King - Blue Vibe', category: 'Lifestyle' },
  { id: '3', url: 'https://cdn.thenationonlineng.net/wp-content/uploads/2024/08/17025128/Jeriq.jpg', title: 'The Nation Coverage', category: 'Press' },
  { id: '4', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKSbzPmTAVr7Q_PMjUK1w9Xwn1opf3-BzEJQ&s', title: 'Iyoo Cartel Council', category: 'Studio' },
  { id: '5', url: 'https://i.ytimg.com/vi/f6nXV4zL5vc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCaDUHstorGlMVmENEk15oMvTvFTA', title: 'Cinematic Excellence', category: 'Videos' },
  { id: '6', url: 'https://cdn-images.dzcdn.net/images/cover/6a0951607a163b2688aac04a8d74a028/0x1900-000000-80-0-0.jpg', title: 'King Of The East', category: 'Albums' },
  { id: '7', url: 'https://albumtalks.com/wp-content/uploads/2024/08/saveinsta433115539393074169.jpg', title: 'Album Talks Feature', category: 'Achievements' },
  { id: '8', url: 'https://miro.medium.com/0*SxPSbY2XnrA-sgBy.jpg', title: 'Medium Spotlight', category: 'Press' },
  { id: '9', url: 'https://www.bellanaija.com/wp-content/uploads/2021/04/IMG_4723.jpg', title: 'BellaNaija Style', category: 'Portraits' },
  { id: '10', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq17j6zO7INsMFIyilQkiyO5AKl7hDDiYekg&s', title: 'Street Sovereignty', category: 'Lifestyle' },
  { id: '11', url: 'https://www.morebranches.com/wp-content/uploads/2023/02/mn-2-scaled.jpg', title: 'More Branches Feature', category: 'Tours' },
  { id: '12', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrEcf9_sL8E2hym8ByWWQrcwWpEJaZdGglDw&s', title: 'Iyoo Cartel HQ', category: 'Studio' },
  { id: '13', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7DE1Tv-7k9a7jR4m72ziucfMwB1xwo6HRQ&s', title: 'God Is Coming Energy', category: 'Concerts' },
];

function ParallaxImage({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-6 relative overflow-hidden rounded-xl group cursor-none"
      onClick={onClick}
    >
      <motion.div style={{ y }} className="relative h-full w-full">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="space-y-2"
        >
          <p className="text-[10px] tracking-[0.4em] text-white/60 uppercase font-bold">{image.category}</p>
          <h3 className="text-xl font-display text-white tracking-widest">{image.title}</h3>
          <div className="pt-4">
            <Maximize2 size={24} className="text-white mx-auto animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Parallax Depth Line */}
      <div className="absolute top-4 left-4 w-px h-12 bg-white/20 origin-top group-hover:scale-y-0 transition-transform duration-500" />
    </motion.div>
  );
}

export default function Gallery() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedImage = GALLERY_IMAGES.find(img => img.id === selectedId);

  const breakpointCols = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  const nextImage = () => {
    if (!selectedId) return;
    const currentIndex = GALLERY_IMAGES.findIndex(img => img.id === selectedId);
    const nextIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
    setSelectedId(GALLERY_IMAGES[nextIndex].id);
  };

  const prevImage = () => {
    if (!selectedId) return;
    const currentIndex = GALLERY_IMAGES.findIndex(img => img.id === selectedId);
    const prevIndex = (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    setSelectedId(GALLERY_IMAGES[prevIndex].id);
  };

  return (
    <section id="gallery" className="py-32 px-6 bg-brand-grey border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 border border-brand-blue/30 rounded-full bg-brand-blue/5 mb-6"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-brand-blue-glow uppercase">Cinematic Museum</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display text-white text-glow mb-6"
          >
            Gallery
          </motion.h2>
          <p className="text-white/40 tracking-[0.4em] uppercase text-[10px] max-w-md mx-auto leading-relaxed">
            Witness the evolution of a King. From the streets of Enugu to the world stage.
          </p>
        </header>

        <Masonry
          breakpointCols={breakpointCols}
          className="flex gap-6 w-auto"
          columnClassName="bg-clip-padding"
        >
          {GALLERY_IMAGES.map((image) => (
            <ParallaxImage 
              key={image.id} 
              image={image} 
              onClick={() => setSelectedId(image.id)} 
            />
          ))}
        </Masonry>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedId && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-brand-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-12"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-all p-4 z-[210] hover:rotate-90"
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-12 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="pointer-events-auto p-4 text-white/20 hover:text-brand-blue transition-all bg-white/5 rounded-full hover:scale-110"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="pointer-events-auto p-4 text-white/20 hover:text-brand-blue transition-all bg-white/5 rounded-full hover:scale-110"
              >
                <ChevronRight size={40} />
              </button>
            </div>

            {/* Main Image Container */}
            <div className="relative max-w-5xl w-full h-[70vh] flex items-center justify-center">
              <motion.img
                key={selectedImage.id}
                initial={{ scale: 0.9, opacity: 0, rotateY: 20 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 1.1, opacity: 0, rotateY: -20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain shadow-[0_0_80px_rgba(26,71,184,0.3)] rounded-lg"
              />
            </div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              <p className="text-brand-blue font-bold tracking-[0.6em] uppercase text-[10px] mb-2">{selectedImage.category}</p>
              <h3 className="text-3xl md:text-5xl font-display text-white tracking-widest">{selectedImage.title}</h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Graphic */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-black to-transparent pointer-events-none" />
    </section>
  );
}
