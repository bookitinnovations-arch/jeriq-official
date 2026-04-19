import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export function useEasterEggs() {
  const [typedBuffer, setTypedBuffer] = useState('');
  const [activeEgg, setActiveEgg] = useState<'IYOO' | 'LONDON' | null>(null);

  const KONAMI_CODE = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle buffer for IYOO and LONDON
      const newBuffer = (typedBuffer + e.key).slice(-20);
      setTypedBuffer(newBuffer);

      if (newBuffer.toLowerCase().endsWith('iyoo')) {
        setActiveEgg('IYOO');
        setTypedBuffer('');
      } else if (newBuffer.toLowerCase().endsWith('london')) {
        setActiveEgg('LONDON');
        setTypedBuffer('');
      }

      // Handle Konami
      const konamiBuffer = (typedBuffer + e.key).slice(-KONAMI_CODE.length);
      if (konamiBuffer === KONAMI_CODE) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1a47b8', '#ffffff', '#000000']
        });
        setTypedBuffer('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedBuffer]);

  return { activeEgg, closeEgg: () => setActiveEgg(null) };
}
