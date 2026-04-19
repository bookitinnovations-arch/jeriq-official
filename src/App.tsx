/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';

const Biography = lazy(() => import('./components/sections/Biography'));
const Brand = lazy(() => import('./components/sections/Brand'));
const Discography = lazy(() => import('./components/sections/discography/Discography'));
const IyooAI = lazy(() => import('./components/sections/IyooAI'));
const FanWall = lazy(() => import('./components/sections/FanWall'));
const Gallery = lazy(() => import('./components/sections/Gallery'));
const Awards = lazy(() => import('./components/sections/Awards'));
const Endorsements = lazy(() => import('./components/sections/Endorsements'));
const Concerts = lazy(() => import('./components/sections/Concerts'));
const KnowledgeGraph = lazy(() => import('./components/sections/KnowledgeGraph'));
const Lab = lazy(() => import('./components/sections/Lab'));
const Contact = lazy(() => import('./components/sections/Contact'));
const IyooRadio = lazy(() => import('./components/layout/IyooRadio'));
const Loader = lazy(() => import('./components/layout/Loader'));
const LoyaltyOath = lazy(() => import('./components/auth/LoyaltyOath'));
import SecretOverlay from './components/special/SecretOverlay';
import SiteTour from './components/special/SiteTour';
import { useEasterEggs } from './hooks/useEasterEggs';
import { useSoundLayer } from './hooks/useSoundLayer';
import { AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

function AppContent() {
  const { hasSeenLoader, isLoyal, isAudioEnabled, setIsAudioEnabled } = useApp();
  const { activeEgg, closeEgg } = useEasterEggs();
  const { initMic, playClick } = useSoundLayer(isAudioEnabled);

  const toggleAudio = () => {
    if (!isAudioEnabled) initMic();
    setIsAudioEnabled(!isAudioEnabled);
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      if (isAudioEnabled) playClick();
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isAudioEnabled, playClick]);

  return (
    <main className="relative min-h-screen scanline">
      <AnimatePresence>
        {!hasSeenLoader && <Loader />}
      </AnimatePresence>

      <AnimatePresence>
        {hasSeenLoader && !isLoyal && <LoyaltyOath />}
      </AnimatePresence>

      <Navbar />
      
      {/* Sound Toggle */}
      <button 
        onClick={toggleAudio}
        className="fixed bottom-10 right-10 z-[100] glass-card p-4 rounded-full text-white/100 transition-all shadow-[0_0_30px_rgba(26,71,184,0.4)] hover:scale-110 active:scale-95"
      >
        {!isAudioEnabled ? <VolumeX size={24} className="opacity-40" /> : <Volume2 size={24} className="text-brand-blue animate-pulse" />}
      </button>

      {/* Secret Overlays */}
      {activeEgg && <SecretOverlay type={activeEgg} onClose={closeEgg} />}
      
      {/* Platform Tour */}
      <SiteTour />

      {/* Sections Wrapper */}
      <div className="flex flex-col">
        <Suspense fallback={<div className="h-screen bg-brand-black" />}>
          <Hero />
          
          <Biography />
          <Brand />
          <Discography />
          <IyooAI />
          <FanWall />
          <Gallery />
          <Awards />

          <Endorsements />

          <Concerts />
          <KnowledgeGraph />
          <Lab />
          <Contact />
          <IyooRadio />
        </Suspense>
      </div>

      {/* Footer Signature */}
      <footer className="py-12 px-6 text-center bg-brand-black border-t border-white/10">
        <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Engineered for the Culture by <span className="text-white hover:text-brand-blue cursor-pointer transition-colors font-bold whitespace-nowrap">Newtons digital plug</span>
        </p>
        <div className="mt-4 opacity-10 text-[8px] tracking-[1em] text-white">
          .. -.-- --- --- / -.-. .- .-. - . .-..
        </div>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
