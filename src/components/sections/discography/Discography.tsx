import { Suspense, useState, useMemo, useEffect, Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { DISCOGRAPHY } from '@/constants/jeriqData';
import Album3D from './Album3D';
import SinglesShelf from './SinglesShelf';
import AlbumDetails from './AlbumDetails';
import { cn } from '@/lib/utils';

// --- Error Boundary for WebGL/Canvas Failures ---
class DiscographyErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// --- 2D Fallback for Non-WebGL Devices ---
function DiscographyFallback({ onSelect }: { onSelect: (album: any) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {DISCOGRAPHY.albums.map((album) => (
        <motion.div 
          key={album.title}
          whileHover={{ scale: 1.05 }}
          onClick={() => onSelect(album)}
          className="glass-card p-4 rounded-xl cursor-pointer border-white/10"
        >
          <img src={album.cover} alt={album.title} className="w-full aspect-square object-cover rounded-lg mb-4" />
          <h3 className="text-white font-display text-sm tracking-widest uppercase">{album.title}</h3>
        </motion.div>
      ))}
    </div>
  );
}

export default function Discography() {
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // Fallback check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setIsWebGLSupported(support);
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  // Responsive positions for 3D albums
  const albumPositions = useMemo(() => [
    { pos: [-4, 1.5, 0] as [number, number, number], data: DISCOGRAPHY.albums[0] }, // Hood Boy
    { pos: [0, 1.5, 0] as [number, number, number], data: DISCOGRAPHY.albums[1] },  // East N West
    { pos: [4, 1.5, 0] as [number, number, number], data: DISCOGRAPHY.albums[2] },  // BDD
    { pos: [-4, -1.5, 0] as [number, number, number], data: DISCOGRAPHY.albums[3] }, // BDD Deluxe
    { pos: [0, -1.5, 0] as [number, number, number], data: DISCOGRAPHY.albums[4] },  // Evil Twin
    { pos: [4, -1.5, 0] as [number, number, number], data: DISCOGRAPHY.albums[5] },  // King
  ], []);

  return (
    <section id="discography" className="relative min-h-screen bg-brand-black py-32 overflow-hidden">
      {/* 3D Album Universe */}
      <div className="h-[80vh] w-full relative">
        <div className="absolute top-10 left-10 z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-display text-white text-glow"
          >
            Album Universe
          </motion.h2>
          <p className="text-white/40 tracking-[0.5em] uppercase text-[10px] mt-4">
            {isWebGLSupported ? 'Interactive 3D Discography • Scroll to rotate' : 'The Sovereignty of Sound • Click to explore'}
          </p>
        </div>

        <div className="h-full w-full">
          {isWebGLSupported ? (
            <DiscographyErrorBoundary fallback={<DiscographyFallback onSelect={setSelectedAlbum} />}>
              <Canvas gl={{ antialias: true, failIfMajorPerformanceCaveat: true }} dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                
                <Suspense fallback={null}>
                  {albumPositions.map((item, i) => (
                    <Album3D
                      key={item.data.title}
                      title={item.data.title}
                      cover={item.data.cover}
                      position={item.pos}
                      onClick={() => setSelectedAlbum(item.data)}
                    />
                  ))}
                </Suspense>

                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false}
                  maxPolarAngle={Math.PI / 1.5}
                  minPolarAngle={Math.PI / 3}
                />
              </Canvas>
            </DiscographyErrorBoundary>
          ) : (
            <DiscographyFallback onSelect={setSelectedAlbum} />
          )}
        </div>
      </div>

      {/* Singles Shelf */}
      <SinglesShelf />

      {/* Album Details Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <AlbumDetails 
            album={selectedAlbum} 
            onClose={() => setSelectedAlbum(null)} 
          />
        )}
      </AnimatePresence>

      {/* Background Decorative Text */}
      <div className="absolute bottom-0 right-0 opacity-[0.02] pointer-events-none select-none">
        <h2 className="text-[25vw] font-display leading-none whitespace-nowrap">IYOO CARTEL</h2>
      </div>
    </section>
  );
}
