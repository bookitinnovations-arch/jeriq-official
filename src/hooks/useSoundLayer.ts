import { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

const CLICK_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'; // Professional UI click

export function useSoundLayer(isAudioEnabled: boolean = false) {
  const [isClapped, setIsClapped] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const clickSound = useRef<Howl | null>(null);

  useEffect(() => {
    clickSound.current = new Howl({ src: [CLICK_SOUND_URL], volume: 0.1 });
    return () => clickSound.current?.unload();
  }, []);

  const playClick = () => {
    if (isAudioEnabled) {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
      clickSound.current?.play();
    }
  };

  const initMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      analyserRef.current = analyser;
      audioContextRef.current = context;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkMic = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Peak detection for clap/snap
        if (average > 60) {
          setIsClapped(true);
          setTimeout(() => setIsClapped(false), 500);
        }
        
        requestAnimationFrame(checkMic);
      };

      checkMic();
    } catch (err) {
      console.warn("Microphone access denied or failed", err);
    }
  };

  return { 
    isAudioEnabled, 
    playClick, 
    initMic,
    isClapped 
  };
}
