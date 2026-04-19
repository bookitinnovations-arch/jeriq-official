import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IdCard, 
  Terminal, 
  UserPlus, 
  Newspaper, 
  Trophy, 
  ShieldCheck, 
  Sword, 
  Radio,
  Download,
  Flame,
  Star,
  Zap,
  Gavel,
  Copy,
  RotateCcw,
  Share2,
  Mic2,
  Sparkles,
  Music,
  PenTool,
  History,
  Send
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp, 
  increment,
  where,
  getDocs
} from 'firebase/firestore';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { 
  generateRapName, 
  generateNewsReport, 
  generateRapBattle,
  analyzeFlow,
  generateProphecy,
  readBeatMood
} from '@/services/aiService';

// --- Sub-Components ---

function MembershipCard() {
  const { userRank } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('042 - ENUGU');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadCard = async () => {
    if (cardRef.current) {
      setIsMinting(true);
      // Artificial "Minting" delay for high-fidelity feel
      await new Promise(r => setTimeout(r, 2000));
      
      try {
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: 2, // High res for sovereignty
        });
        const link = document.createElement('a');
        link.download = `iyoo-passport-${userName || 'soldier'}.png`;
        link.href = dataUrl;
        link.click();
      } finally {
        setIsMinting(false);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12">
      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Citizen Designation</label>
          <input 
            type="text" 
            placeholder="ENTER NAME" 
            className="w-full bg-white/5 border border-white/10 p-5 font-mono text-white tracking-widest uppercase focus:border-brand-blue outline-none transition-all placeholder:text-white/10"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Territorial Origin</label>
          <input 
            type="text" 
            placeholder="LOCATION" 
            className="w-full bg-white/5 border border-white/10 p-5 font-mono text-white tracking-widest uppercase focus:border-brand-blue outline-none transition-all placeholder:text-white/10"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/5 border border-white/10 text-white py-5 font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
          >
            <Zap size={18} className="text-brand-blue group-hover:scale-125 transition-transform" />
            Upload Mugshot
          </button>
          <button 
            onClick={downloadCard}
            disabled={isMinting || !userName}
            className="bg-brand-blue text-white py-5 font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:bg-brand-blue-glow transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            {isMinting && (
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <ShieldCheck size={18} />
            {isMinting ? "INITIALIZING MINT..." : "MINT SOVEREIGN ID"}
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handlePhotoUpload} 
        />
      </div>

      {/* The Passport Rendering */}
      <div className="relative group perspective-1000">
        <div 
          ref={cardRef} 
          className="relative w-full aspect-[1.6/1] bg-[#0c0c0e] border-[3px] border-brand-blue/40 rounded-3xl overflow-hidden p-8 flex flex-col justify-between shadow-[0_0_80px_rgba(26,71,184,0.15)] group-hover:shadow-[0_0_100px_rgba(26,71,184,0.3)] transition-all duration-700"
        >
          {/* High-Fidelity Overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-20 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 via-transparent to-brand-blue/5 pointer-events-none" />
          
          {/* Animated Scanning Line */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-[2px] bg-brand-blue shadow-[0_0_15px_rgba(26,71,184,0.8)] z-30 opacity-40"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* Header */}
          <div className="flex justify-between items-start relative z-10 border-b border-white/10 pb-6 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center border border-brand-blue/40">
                <ShieldCheck className="text-brand-blue animate-pulse" size={24} />
              </div>
              <div>
                <h2 className="text-xs font-mono font-bold tracking-[0.6em] text-brand-blue flex items-center gap-2">
                  IYOO CARTEL <span className="w-1 h-1 bg-brand-blue rounded-full" /> SOVEREIGN PASS
                </h2>
                <p className="text-[10px] font-mono text-white/40 tracking-widest mt-1">EST. 042 // DEPT OF STREET AFFAIRS</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-brand-blue/10 border border-brand-blue/30 rounded-md">
                <span className="text-[10px] font-mono text-brand-blue-glow font-bold tracking-widest uppercase">{userRank || "SOLDIER"}</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex gap-8 relative z-10 h-full py-4">
            {/* Mugshot Section */}
            <div className="w-1/3 aspect-[3/4] bg-white/5 border-2 border-white/10 flex flex-col items-center justify-center relative overflow-hidden rounded-xl bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {userPhoto ? (
                <img src={userPhoto} alt="Mugshot" className="w-full h-full object-cover grayscale contrast-125 brightness-90 shadow-inner" referrerPolicy="no-referrer" />
              ) : (
                <IdCard size={64} className="text-white/10" />
              )}
              <div className="absolute inset-0 border-[10px] border-black/20 pointer-events-none" />
              <div className="absolute bottom-2 left-0 w-full text-center">
                <span className="text-[8px] font-mono text-white/40 tracking-tighter uppercase">ID_SCAN_VERIFIED</span>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex-1 flex flex-col justify-between py-2">
              <div className="grid grid-cols-2 gap-y-6">
                <div className="space-y-1">
                  <p className="text-[8px] font-mono text-brand-blue uppercase tracking-widest">Name</p>
                  <p className="text-2xl font-display text-white tracking-widest uppercase">{userName || "UNKNOWN"}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[8px] font-mono text-brand-blue uppercase tracking-widest">Region</p>
                  <p className="text-xl font-display text-white tracking-widest uppercase">{userLocation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-mono text-brand-blue uppercase tracking-widest">Clearance</p>
                  <p className="text-xl font-display text-white tracking-widest uppercase">LEVEL {userRank === 'Cartel OG' ? '9' : '4'}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[8px] font-mono text-brand-blue uppercase tracking-widest">Auth Code</p>
                  <p className="text-xl font-display text-white tracking-widest uppercase">SYSTM-{(Math.random() * 1000).toFixed(0)}</p>
                </div>
              </div>

              {/* Security Footer Grid */}
              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="space-y-1">
                  <p className="text-[7px] font-mono text-white/20 uppercase tracking-[0.4em]">Auth Hash</p>
                  <p className="text-[10px] font-mono text-brand-blue truncate w-32 tracking-tighter">
                    {Math.random().toString(36).substring(2, 15).toUpperCase()}
                    {Math.random().toString(36).substring(2, 15).toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[7px] font-mono text-white/20 uppercase tracking-[0.4em]">Date Minted</p>
                    <p className="text-[10px] font-mono text-white/60 tracking-widest">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="w-10 h-10 border border-white/20 rounded flex items-center justify-center opacity-40">
                    <Zap size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Security Badge */}
        <div className="absolute -bottom-4 -right-4 bg-brand-blue/20 backdrop-blur-xl border border-brand-blue/40 px-6 py-3 rounded-full z-40 flex items-center gap-3 shadow-[0_0_30px_rgba(26,71,184,0.3)] opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
           <span className="text-[10px] font-mono text-white font-bold tracking-widest uppercase">Encrypted Signal Active</span>
        </div>
      </div>
    </div>
  );
}

function RapNameGen() {
  const [realName, setRealName] = useState('');
  const [city, setCity] = useState('');
  const [result, setResult] = useState<{ rapName: string; explanation: string; rank: string; motto: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!realName || !city) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await generateRapName(realName, city);
      setResult(resp);
    } catch (e) {
      console.error("Rap Name Fail", e);
      setError("The Cartel lines are busy. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.rapName);
    }
  };

  return (
    <div className="space-y-8">
      {!result ? (
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-2">Enter Your Real Name</label>
              <input 
                type="text" 
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="e.g. Ebuka Okeke"
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-2">Enter Your City/Origin</label>
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Enugu"
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>
          </div>
          
          <button 
            onClick={generate}
            disabled={loading || !realName || !city}
            className="w-full bg-brand-blue text-white py-4 font-bold tracking-[0.3em] uppercase hover:bg-brand-blue-glow transition-all disabled:opacity-50"
          >
            {loading ? "Jeriq is thinking..." : "GENERATE MY CARTEL NAME"}
          </button>
          
          {error && <p className="text-red-500 text-xs font-mono text-center uppercase tracking-widest">{error}</p>}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card p-12 rounded-3xl border-brand-blue/30 bg-brand-blue/5 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <h1 className="text-8xl rotate-12 -translate-y-12">IYOO CARTEL</h1>
            </div>

            <header className="mb-10 flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-[0.5em] text-brand-blue-glow uppercase">RAP NAME:</p>
                <h3 className="text-7xl font-display text-white tracking-widest leading-none">
                  {result.rapName}
                </h3>
              </div>
              <div className="px-4 py-2 bg-brand-blue text-white rounded-lg text-[10px] font-bold tracking-widest uppercase">
                {result.rank}
              </div>
            </header>

            <div className="space-y-8 relative z-10">
              <div className="p-6 bg-white/5 border-l-4 border-brand-blue rounded-r-lg">
                <p className="text-white/60 text-sm leading-relaxed font-sans">
                  {result.explanation}
                </p>
              </div>

              <div className="text-center py-6 border-y border-white/5">
                <p className="text-brand-blue-glow font-display text-2xl italic tracking-widest quote">
                  "{result.motto}"
                </p>
              </div>
            </div>

            <footer className="mt-10 grid grid-cols-2 gap-4">
              <button 
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white/80 py-4 font-bold text-xs tracking-widest uppercase transition-all"
              >
                <Copy size={16} />
                COPY MY NAME
              </button>
              <button 
                onClick={() => setResult(null)}
                className="flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 text-white/40 py-4 font-bold text-xs tracking-widest uppercase transition-all"
              >
                <RotateCcw size={16} />
                GENERATE AGAIN
              </button>
            </footer>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function WantedPoster() {
  const [name, setName] = useState('');
  const [fugitivePhoto, setFugitivePhoto] = useState<string | null>(null);
  const [croppedFugitivePhoto, setCroppedFugitivePhoto] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const ASPECT_RATIOS = [
    { label: '1:1', value: 1 },
    { label: '9:16', value: 9/16 },
    { label: '16:9', value: 16/9 },
    { label: '2:3', value: 2/3 },
  ];

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFugitivePhoto(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCrop = async () => {
    if (fugitivePhoto && croppedAreaPixels) {
      const cropped = await getCroppedImg(fugitivePhoto, croppedAreaPixels);
      setCroppedFugitivePhoto(cropped);
      setIsCropping(false);
    }
  };

  const downloadPoster = async () => {
    if (posterRef.current) {
      const dataUrl = await toPng(posterRef.current);
      const link = document.createElement('a');
      link.download = `wanted-${name || 'citizen'}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="ENTER FUGITIVE NAME" 
            className="bg-white/5 border border-white/10 p-4 font-mono text-white tracking-widest uppercase focus:border-brand-blue outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button 
            onClick={() => photoInputRef.current?.click()}
            className="bg-white/5 border border-white/10 text-white/60 py-4 font-mono tracking-widest uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
          >
            <IdCard size={18} className="group-hover:text-brand-blue transition-colors" />
            {croppedFugitivePhoto ? "CHANGE PHOTO" : "UPLOAD FUGITIVE PHOTO"}
          </button>
          {croppedFugitivePhoto && (
            <button 
              onClick={() => setIsCropping(true)}
              className="md:col-span-2 bg-white/5 border border-white/10 text-brand-blue py-3 font-mono text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
            >
              ADJUST MUGSHOT POSITION
            </button>
          )}
          <input 
            type="file" 
            ref={photoInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handlePhotoUpload} 
          />
        </div>

        <AnimatePresence>
          {isCropping && fugitivePhoto && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6"
            >
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-mono text-brand-blue uppercase tracking-widest">Adjust Mugshot</span>
                <div className="flex gap-2">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => setAspect(r.value)}
                      className={cn(
                        "px-3 py-1 text-[10px] font-mono border transition-all",
                        aspect === r.value 
                          ? "border-brand-blue text-brand-blue bg-brand-blue/10" 
                          : "border-white/10 text-white/40 hover:border-white/20"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden border border-white/5">
                <Cropper
                  image={fugitivePhoto}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Zoom</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-brand-blue"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsCropping(false)}
                    className="flex-1 py-3 text-xs font-mono text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCrop}
                    className="flex-1 bg-brand-blue text-white py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-blue-glow transition-all"
                  >
                    Confirm Frame
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={downloadPoster}
          className="bg-brand-blue text-white py-4 font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-2 hover:bg-brand-blue-glow transition-all"
        >
          <Download size={18} />
          GENERATE WANTED POSTER
        </button>
      </div>

      <div ref={posterRef} className="relative w-full aspect-[3/4] max-w-[400px] mx-auto bg-[#decba4] p-10 flex flex-col items-center justify-between border-[12px] border-[#8b4513] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
        
        <header className="text-center">
          <h2 className="text-[#3e1f0a] text-6xl font-display uppercase tracking-widest border-b-4 border-[#3e1f0a] pb-2">WANTED</h2>
          <p className="text-[#3e1f0a] font-mono text-xs mt-2 font-bold uppercase tracking-widest">Dead or Alive</p>
        </header>

        <div 
          className="w-full border-4 border-[#3e1f0a] flex items-center justify-center bg-[#c4a484]/30 relative overflow-hidden grayscale contrast-125 brightness-90 shadow-inner"
          style={{ aspectRatio: aspect }} 
        >
           {croppedFugitivePhoto ? (
             <motion.img 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               src={croppedFugitivePhoto} 
               alt="Fugitive" 
               className="w-full h-full object-contain sepia-[0.3]" 
               referrerPolicy="no-referrer" 
             />
           ) : (
             <div className="aspect-square flex items-center justify-center">
               <Zap size={120} className="text-[#3e1f0a] opacity-40 animate-pulse" />
             </div>
           )}
           <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none" />
           <div className="absolute bottom-4 left-0 w-full text-center">
              <span className="bg-[#3e1f0a] text-[#decba4] px-4 py-1 text-2xl font-display tracking-widest uppercase shadow-xl">
                {name || "UNKNOWN"}
              </span>
           </div>
        </div>

        <div className="w-full text-center space-y-4">
           <div>
              <p className="text-[10px] text-[#3e1f0a]/60 uppercase font-bold tracking-widest">Crime</p>
              <p className="text-lg font-display text-[#3e1f0a] uppercase tracking-widest leading-none">Undying loyalty to the East</p>
           </div>
           <div>
              <p className="text-[10px] text-[#3e1f0a]/60 uppercase font-bold tracking-widest">Reward</p>
              <p className="text-xl font-display text-[#3e1f0a] uppercase tracking-widest border-2 border-dashed border-[#3e1f0a] inline-block px-4 py-1">
                One night in Enugu with the Cartel
              </p>
           </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-[#3e1f0a]/80 rounded-full" />
        <div className="absolute top-4 right-4 w-4 h-4 bg-[#3e1f0a]/80 rounded-full" />
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#3e1f0a]/80 rounded-full" />
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#3e1f0a]/80 rounded-full" />

        {/* Official Crest Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
           <Zap size={300} className="text-[#3e1f0a]" />
        </div>
      </div>
    </div>
  );
}

function IyooNews() {
  const [fanName, setFanName] = useState('');
  const [achievement, setAchievement] = useState('');
  const [news, setNews] = useState<{ headline: string; subheadline: string; article: string; reporter: string; date: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const newsRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!fanName || !achievement) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await generateNewsReport(fanName, achievement);
      setNews(resp);
    } catch (e) {
      console.error("News Fail", e);
      setError("The printing press broke. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadNews = async () => {
    if (newsRef.current) {
      const canvas = await html2canvas(newsRef.current, {
        backgroundColor: '#fcf8f0',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `EnuguTimes_${fanName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const shareOnTwitter = () => {
    if (news) {
      const text = `${news.headline} - Check out my story in the ENUGU TIMES! Iyoo Cartel Sovereignty.`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      {!news ? (
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-2">Fan Name</label>
              <input 
                type="text" 
                value={fanName}
                onChange={(e) => setFanName(e.target.value)}
                placeholder="e.g. Chief Onyeka"
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-2">Achievement (e.g. 100 streams)</label>
              <input 
                type="text" 
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="e.g. Completed Iyoo Cartel Initiation"
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>
          </div>
          
          <button 
            onClick={generate}
            disabled={loading || !fanName || !achievement}
            className="w-full bg-brand-blue text-white py-4 font-bold tracking-[0.3em] uppercase hover:bg-brand-blue-glow transition-all disabled:opacity-50"
          >
            {loading ? "The Enugu Times is printing..." : "GENERATE NEWS FRONT PAGE"}
          </button>
          
          {error && <p className="text-red-500 text-xs font-mono text-center uppercase tracking-widest">{error}</p>}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* Newspaper Render Block */}
          <div 
            ref={newsRef}
            className="bg-[#fcf8f0] text-gray-900 p-12 border-4 border-gray-900 shadow-2xl relative"
            style={{ fontFamily: "'Crimson Text', serif" }}
          >
            {/* Masthead */}
            <header className="border-b-8 border-gray-900 pb-4 mb-4 text-center relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 font-sans">Official Publication of the Iyoo Cartel</p>
              <h1 className="text-8xl font-display uppercase tracking-wider mb-2 leading-none font-bold">ENUGU TIMES</h1>
              <div className="flex justify-between border-t-2 border-gray-400 pt-2 text-xs font-bold uppercase font-sans">
                <span>VOL. {Math.floor(Math.random() * 1000)} NO. {Math.floor(Math.random() * 50)}</span>
                <span>{news.date}</span>
                <span>PRICE: 100 IYOO</span>
              </div>
              
              {/* Ghosting Cartel Crest */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-150">
                <ShieldCheck size={200} />
              </div>
            </header>

            <div className="space-y-6">
              <h2 className="text-5xl font-bold uppercase leading-tight font-sans text-center px-4">
                {news.headline}
              </h2>
              <p className="text-xl italic border-y border-gray-400 py-3 text-center">
                {news.subheadline}
              </p>

              <div className="flex gap-4 border-b border-gray-300 pb-2 text-[10px] font-bold uppercase font-sans">
                <span>By {news.reporter}</span>
                <span className="ml-auto">IYOO NEWS NETWORK</span>
              </div>

              <div className="columns-2 gap-8 text-sm leading-relaxed text-justify first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                {news.article.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </div>

            <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
              <IdCard size={60} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={downloadNews}
              className="flex items-center justify-center gap-2 bg-brand-blue text-white py-4 font-bold text-xs tracking-widest uppercase hover:bg-brand-blue-glow transition-all rounded-xl"
            >
              <Download size={16} />
              DOWNLOAD AS IMAGE
            </button>
            <button 
              onClick={shareOnTwitter}
              className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white py-4 font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-all rounded-xl"
            >
              <Share2 size={16} />
              SHARE ON TWITTER
            </button>
            <button 
              onClick={() => setNews(null)}
              className="col-span-2 py-4 text-white/40 font-bold text-[10px] tracking-widest uppercase hover:text-white transition-all text-center"
            >
              PRINT ANOTHER ARTICLE
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function JeriqTrivia() {
  const [step, setStep] = useState<'start' | 'playing' | 'end'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [gameQuestions, setGameQuestions] = useState<typeof ALL_QUESTIONS>([]);

  const ALL_QUESTIONS = [
    { q: "What is Jeriq's home city in the East?", a: ["Enugu", "Lagos", "Abuja", "Port Harcourt"], c: 0 },
    { q: "Which brand made Jeriq their first Igbo artist in Dec 2025?", a: ["Hero", "Pepsi", "Kedu", "Ashluxury"], c: 1 },
    { q: "What is the name of Jeriq's 2024 album?", a: ["King", "Born To Be Great", "Hood Boy Dreams", "East N West"], c: 0 },
    { q: "Which artist collaborated with Jeriq on 'East N West'?", a: ["Phyno", "Zlatan", "Dremo", "Blaqbonez"], c: 2 },
    { q: "Jeriq is the first Nigerian rapper to sell out how many stadiums in one month?", a: ["One", "Two", "Three", "Four"], c: 1 },
    { q: "What is Jeriq's independent label named?", a: ["DMW", "Starboy", "Iyoo Cartel", "Mavin"], c: 2 },
    { q: "Which song features the lyrics about the '042' sovereignty?", a: ["Remember", "Oluoma", "Back to Basics", "Hustla"], c: 2 },
    { q: "Jeriq's performance at Nnamdi Azikiwe Stadium hit what attendance?", a: ["10k", "20k", "30k", "50k"], c: 2 },
    { q: "Which UK artist linked up for 'Ogbe in London'?", a: ["Stormzy", "Skepta", "Knucks", "Central Cee"], c: 2 },
    { q: "In what year did 'Hood Boy Dreams' release?", a: ["2018", "2020", "2022", "2023"], c: 1 },
    { q: "What is Jeriq's real name?", a: ["Jeremiah Ani", "Ani Jeremiah Chukwuebuka", "Chukwuma Ani", "Ani Jeremiah"], c: 1 },
    { q: "Which song has the lyrics 'I'm the king of the East, I don't need a crown'?", a: ["King", "Ije Nwoke", "Amen", "No Cap"], c: 0 },
    { q: "What does 'Iyoo' represent in the Cartel culture?", a: ["A greeting", "A sound of victory", "A city name", "A type of food"], c: 1 },
    { q: "Which of these is a brand Jeriq is an ambassador for?", a: ["Guinness", "Hero Lager", "Star", "Legend"], c: 1 },
    { q: "Who featured on the track 'Active' from Billion Dollar Dream?", a: ["Phyno", "PsychoYP", "Bella Shmurda", "Flavour"], c: 1 },
    { q: "Which 2026 single has the note 'Cinematic Trap Anthem'?", a: ["Born to Be Great", "DJ Go Tire", "7 Grams", "The Shift"], c: 0 },
    { q: "What is the primary language Jeriq raps in?", a: ["English", "Igbo", "Yoruba", "Hausa"], c: 1 },
    { q: "Which artist is featured on 'Oluoma'?", a: ["Zoro", "Flavour", "Phyno", "Olamide"], c: 1 },
    { q: "What was Jeriq's first EP title?", a: ["Hood Boy Dreams", "East N West", "Evil Twin", "King"], c: 0 },
    { q: "How many tracks are on the 'Evil Twin' EP?", a: ["3", "4", "5", "6"], c: 2 },
    { q: "Who is the 'Evil Twin' Jeriq refers to in his 2024 EP?", a: ["Phyno", "PsychoYP", "Blaqbonez", "Dremo"], c: 1 },
    { q: "What is the postal code for Enugu often used in Jeriq's lyrics?", a: ["01", "042", "080", "234"], c: 1 },
    { q: "Which brand partnership is associated with 'Street Sovereignty'?", a: ["Kedu App", "Ashluxury", "Pepsi", "Passyxchange"], c: 2 },
    { q: "In the 'East N West' EP, which song is second on the tracklist?", a: ["East to West", "Imakwa-ego", "Ego", "Doubt"], c: 1 },
    { q: "What is the motto of the Iyoo Cartel?", a: ["Money over everything", "Loyalty over royalty", "Iyoo Sovereignty", "East is Best"], c: 2 },
    { q: "Which song did Jeriq release as a remix with Bella Shmurda?", a: ["Remember", "Amen", "Back to Basics", "Hustle"], c: 0 },
    { q: "Jeriq's 'Billion Dollar Dream' album was released in which year?", a: ["2021", "2022", "2023", "2024"], c: 1 },
    { q: "What is the name of the track where Jeriq raps about 'Mama's prayers'?", a: ["Amen", "Remember", "Oh Lord", "Success"], c: 0 },
    { q: "Which luxury fashion house does Jeriq represent?", a: ["Davido", "Burna Boy", "Ashluxury", "Gucci"], c: 2 },
    { q: "What is the name of the Jeriq x Minz collaboration?", a: ["DJ Go Tire", "Vibration", "Osusu", "Mulla"], c: 0 },
    { q: "Which stadium did Jeriq sell out in Enugu?", a: ["Legacy Stadium", "Nnamdi Azikiwe Stadium", "Enugu Stadium", "Okigwe Stadium"], c: 1 },
    { q: "What does Jeriq call his fanbase?", a: ["Iyoo Army", "Cartel Soldiers", "Jeriq Nation", "Easterners"], c: 1 },
    { q: "Which song is the intro to the 'King' album?", a: ["Ije Nwoke", "Take All", "Mulla", "King"], c: 0 },
    { q: "Which city does Jeriq call the 'capital of the East'?", a: ["Onitsha", "Enugu", "Owerri", "Aba"], c: 1 },
    { q: "In 'Back to Basics', Jeriq talks about his roots in where?", a: ["The Suburbs", "The Trenches", "The Projects", "The Streets"], c: 2 },
    { q: "Who provided the vocal samples for 'Oluoma'?", a: ["Flavour", "Phyno", "Zoro", "Umu Obiligbo"], c: 0 },
    { q: "Jeriq's 'Iyoo' sound is inspired by what?", a: ["Traditional chants", "Street slogans", "Personal mantras", "Bird calls"], c: 1 },
    { q: "Which song talks about 'Financial Independence'?", a: ["Akara", "Dreams", "Financial Independence", "Hussle"], c: 2 },
    { q: "What is the name of the app Jeriq partners with for ticketing?", a: ["Dice", "Kedu App", "Eventbrite", "Passy"], c: 1 },
    { q: "Which single was released in 2026 with a 'TikTok Viral' tag?", a: ["Escape Plan", "Born to Be Great", "DJ Go Tire", "7 Grams"], c: 0 },
    { q: "Where was the 'Hood Boy Dreams' video shot?", a: ["Lagos", "Enugu", "London", "Abuja"], c: 1 },
    { q: "Which song features the line 'Iyoo Cartel we don't play'?", a: ["No Cap", "Stucc In The Projects", "Oh Lord", "Remember"], c: 0 },
    { q: "What is the name of Jeriq's collaboration with PsychoYP on the Evil Twin EP?", a: ["Evil Twin", "First Born", "Disjointed", "Standard Remix"], c: 3 },
    { q: "Which brand uses Jeriq as their official face of 'Eastern Vibes'?", a: ["Hero Lager", "Suntory", "Pepsi", "Nestle"], c: 0 },
    { q: "In the 'King' album, which track features Flavour?", a: ["Take All", "Oluoma", "Daily Bread Remix", "Vibration"], c: 1 },
    { q: "What year did Jeriq launch his Iyoo Cartel merchandise?", a: ["2020", "2021", "2022", "2023"], c: 2 },
    { q: "Which song is about Jeriq's 'Daily Bread'?", a: ["Dreams", "Success", "Daily Bread", "Hussle"], c: 2 },
    { q: "Jeriq was mentioned as the 'Voice of the East' by which legend?", a: ["Phyno", "Olamide", "Flavour", "Don Jazzy"], c: 0 },
    { q: "Which track addresses the 'Police' and street life?", a: ["Amen", "Remember", "Oh Lord", "No Cap"], c: 3 },
    { q: "What is Jeriq's favorite accessory?", a: ["Sunglasses", "Iyoo Chain", "Grillz", "Rings"], c: 1 },
    { q: "Which artist from the West did Jeriq work with for 'East N West'?", a: ["Davido", "Wizkid", "Dremo", "Mayorkun"], c: 2 },
    { q: "What is the name of Jeriq's track with Phyno?", a: ["Remember Remix", "Amen Remix", "Doings", "Oluoma"], c: 2 },
    { q: "In 'Ije Nwoke', what is the main theme?", a: ["Love", "Persistence", "Wealth", "Betrayal"], c: 1 },
    { q: "Which brand hosted the 'Cartel Night' with Jeriq?", a: ["Pepsi", "Hero", "Ashluxury", "Kedu"], c: 0 },
    { q: "What is the name of the 7th track on 'Billion Dollar Dream'?", a: ["Financial Independence", "Akara", "Dreams", "Cartel"], c: 0 },
    { q: "Which Jeriq song became an anthem for street hustlers?", a: ["Amen", "Remember", "Dreams", "Success"], c: 1 },
    { q: "How many followers does the Iyoo Cartel account roughly have?", a: ["100k", "500k", "1M+", "10k"], c: 2 },
    { q: "Which song mentions '042' explicitly in the hook?", a: ["Back to Basics", "Hustle", "Remember", "Amen"], c: 0 },
    { q: "What is Jeriq's astrological sign?", a: ["Leo", "Aries", "Capricorn", "Unknown"], c: 3 },
    { q: "Which platform does Jeriq use most for fan direct messaging?", a: ["Twitter", "Instagram", "WhatsApp", "Fan Wall"], c: 1 },
    { q: "What is the name of the track where Jeriq raps about 'Victory'?", a: ["Victory", "Trapping", "Daily Bread", "Dreams"], c: 0 },
    { q: "Who produced 'Remember'?", a: ["Insane Chips", "Masterkraft", "Don Jazzy", "P.Priime"], c: 0 },
    { q: "Which color is most associated with the Iyoo Cartel brand?", a: ["Red", "Gold", "White/Blue", "Black/Gold"], c: 2 },
    { q: "What was Jeriq's high school nickname?", a: ["Jeriq", "Jerry", "Iyoo Boy", "Unknown"], c: 3 },
    { q: "Which track is about the 'Dreams' Jeriq had while in the projects?", a: ["Dreams", "Hussle", "Akara", "Dreams"], c: 0 },
    { q: "Who is Jeriq's favorite international rapper?", a: ["Lil Baby", "Young Thug", "Future", "J. Cole"], c: 3 },
    { q: "What is the name of the track '11' on the King album?", a: ["Que Sera Sera", "Money Long", "Cooking Pot", "Highlife"], c: 0 },
    { q: "Jeriq's father encouraged his music career early on?", a: ["True", "False", "Partially", "Unknown"], c: 1 },
    { q: "Which track mentions 'Ashluxury' in the lyrics?", a: ["Active", "Mulla", "Big Boy", "King"], c: 1 },
    { q: "Who directed the 'King' music video?", a: ["Director K", "TG Omori", "Clarence Peters", "Pinkline"], c: 2 },
    { q: "What is the name of Jeriq's first project after signing with King?", a: ["King Album", "Born to Be Great", "7 Grams", "The Shift"], c: 0 },
    { q: "Which Eastern state is Jeriq originally from?", a: ["Enugu", "Anambra", "Abia", "Ebonyi"], c: 1 },
    { q: "What does Jeriq say to signify 'Cartel unity'?", a: ["One East", "Iyoo Forever", "Cartel Stand Up", "Eastern Sovereignty"], c: 1 },
    { q: "Which song has a distinct 'Highlife' rhythm?", a: ["Oluoma", "Highlife", "Achalugo", "Vibration"], c: 1 },
    { q: "How many tracks are on 'Hood Boy Dreams'?", a: ["6", "7", "8", "9"], c: 0 },
    { q: "Which of these is NOT a track on the King album?", a: ["Ije Nwoke", "Active", "Mulla", "Big Boy"], c: 1 },
    { q: "What is the name of track 5 on East N West?", a: ["Doubt", "Secure the Bag", "Ego", "Imakwa"], c: 0 },
    { q: "Who mixed 'Hood Boy Dreams'?", a: ["Xtraordinaire", "Swaps", "Spyritmyx", "Mix Monsta"], c: 1 },
    { q: "What was Jeriq's breakout year in the mainstream?", a: ["2019", "2020", "2021", "2022"], c: 1 },
    { q: "Which track is about 'Money Long'?", a: ["Money Long", "Mulla", "Take All", "Osusu"], c: 0 },
    { q: "Jeriq has a collaboration with Bella Shmurda?", a: ["Yes", "No", "Coming Soon", "Unconfirmed"], c: 0 },
    { q: "What is the theme of '7 Grams'?", a: ["Wealth", "Weight of Ambition", "Grammy Dreams", "Street Deals"], c: 1 },
    { q: "Which track is #13 on Billion Dollar Dream Deluxe?", a: ["Back to Basics", "Daily Bread", "Standard", "Trapping"], c: 0 },
    { q: "Who is the CEO of Iyoo Cartel?", a: ["Jeriq", "Phyno", "Anonymous", "King CEO"], c: 0 },
    { q: "What is the name of the single 'Doings' featuring Phyno?", a: ["Doings", "Ego", "Active", "Akara"], c: 0 },
    { q: "Which track has a TikTok viral dance component?", a: ["Escape Plan", "Remember", "Amen", "Hustle"], c: 0 },
    { q: "Jeriq was the first Igbo artist to be a Pepsi ambassador?", a: ["True", "False", "Shared Title", "Unconfirmed"], c: 0 },
    { q: "What is the name of the track about 'Hallelujah'?", a: ["Hallelujah", "Amen", "Oh Lord", "Success"], c: 0 },
    { q: "Which city did Jeriq recently visit for 'London in Ogbe'?", a: ["London", "Paris", "Dubai", "New York"], c: 0 },
    { q: "Who produced 'Born to Be Great'?", a: ["Insane Chips", "Masterkraft", "Don Jazzy", "Rexxie"], c: 0 },
    { q: "What is the name of track 8 on the King album?", a: ["Vibration", "Achalugo", "Osusu", "Money Long"], c: 0 },
    { q: "Which track features ‘Skepta’ inspiration?", a: ["Ogbe in London", "Back to Basics", "Hustle", "Remember"], c: 0 },
    { q: "What is Jeriq's most streamed song on Spotify?", a: ["Remember", "Oluoma", "Amen", "Active"], c: 1 },
    { q: "Which brand does Jeriq call 'The Official Cartel Drink'?", a: ["Pepsi", "Hero", "Star", "Guinness"], c: 0 },
    { q: "What is track 14 on the King album?", a: ["Highlife", "Daily Bread Remix", "Money Long", "Achalugo"], c: 0 },
    { q: "Jeriq's music is often called what?", a: ["Afrobeats", "Igbo Trap", "Highlife Rap", "Eastern Hip Hop"], c: 1 },
    { q: "Which artist from the East is Jeriq's close mentor?", a: ["Phyno", "Flavor", "Zoro", "Illbliss"], c: 0 },
    { q: "What is the name of track 6 on Hood Boy Dreams?", a: ["Stucc In The Projects", "Hood Boy Dreams", "Oh Lord", "No Cap"], c: 0 },
    { q: "Who designed the 'King' album cover?", a: ["Pinkline", "Design Cartel", "Unknown", "Jeriq himself"], c: 0 },
    { q: "How many tracks are on Billion Dollar Dream Deluxe?", a: ["12", "14", "17", "20"], c: 2 },
    { q: "Which track is #17 on the Deluxe album?", a: ["Victory", "Trapping", "Victory", "Daily Bread"], c: 2 },
    { q: "What is Jeriq's signature catchphrase?", a: ["Iyoo!", "Cartel!", "East!", "042!"], c: 0 },
    { q: "Which brand partnership was signed in 2024 for luxury fashion?", a: ["Ashluxury", "Gucci", "Versace", "Louis Vuitton"], c: 0 },
  ];

  const shuffleAndStart = () => {
    // Pick 10 random questions from ALL_QUESTIONS
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    setGameQuestions(shuffled.slice(0, 10));
    setStep('playing');
    setScore(0);
    setCurrentQuestion(0);
  };

  const handleAnswer = async (idx: number) => {
    let newScore = score;
    if (idx === gameQuestions[currentQuestion].c) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    if (currentQuestion < gameQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('end');
      // Auto-save to leaderboard
      setIsSaving(true);
      try {
        const { auth, db } = await import('@/lib/firebase');
        if (auth.currentUser) {
          const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
          await addDoc(collection(db, 'leaderboard'), {
            userId: auth.currentUser.uid,
            username: auth.currentUser.displayName || 'Anon Soldier',
            score: newScore,
            timestamp: serverTimestamp()
          });
        }
      } catch (err) {
        console.error("Leaderboard save failed", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="text-center py-10">
      {step === 'start' && (
        <div className="space-y-8">
           <Zap className="mx-auto text-brand-blue animate-pulse" size={64} />
           <h3 className="text-3xl font-display text-white italic">Are you a true Cartel soldier?</h3>
           <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">10 questions • Random protocol engaged</p>
           <button 
             onClick={shuffleAndStart}
             className="bg-brand-blue text-white px-12 py-4 font-bold tracking-[0.3em] uppercase hover:bg-brand-blue-glow transition-all"
           >
             ENGAGE PROTOCOL
           </button>
        </div>
      )}

      {step === 'playing' && gameQuestions.length > 0 && (
        <div className="space-y-8">
           <p className="text-brand-blue font-mono text-sm tracking-widest uppercase">Question {currentQuestion + 1} / {gameQuestions.length}</p>
           <h3 className="text-2xl font-display text-white tracking-widest uppercase leading-snug">{gameQuestions[currentQuestion].q}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameQuestions[currentQuestion].a.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="p-6 bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-brand-blue/20 hover:border-brand-blue transition-all"
                >
                  {opt}
                </button>
              ))}
           </div>
        </div>
      )}

      {step === 'end' && (
        <div className="space-y-8">
           <div className="p-10 bg-brand-blue/10 rounded-full inline-block">
              <span className="text-6xl font-display text-brand-blue-glow">{score} / {gameQuestions.length}</span>
           </div>
           <h3 className="text-3xl font-display text-white uppercase italic">
             {score === gameQuestions.length ? "LEVEL: CARTEL OG" : score > gameQuestions.length / 2 ? "LEVEL: STREET GENERAL" : "LEVEL: EAST SOLDIER"}
           </h3>
           <button 
             onClick={shuffleAndStart}
             className="text-white/40 font-mono tracking-widest uppercase hover:text-white transition-colors border-b border-white/10 pb-1"
           >
             RE-ENTER BATTLE (NEW QUESTIONS)
           </button>
        </div>
      )}
    </div>
  );
}

function StreetCourt() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [reason, setReason] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'street_court'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!name || !city || !reason) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'street_court'), {
        name,
        city,
        reason,
        induct_votes: 0,
        exile_votes: 0,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setName(''); setCity(''); setReason('');
    } catch (e) {
      console.error("Submission failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string, type: 'induct' | 'exile') => {
    const hasVoted = localStorage.getItem(`voted_${id}`);
    if (hasVoted) return;

    try {
      const entryRef = doc(db, 'street_court', id);
      const entryIdx = entries.findIndex(e => e.id === id);
      const entry = entries[entryIdx];
      
      const updates: any = {
        [type === 'induct' ? 'induct_votes' : 'exile_votes']: increment(1)
      };

      // Rules: 50 induct -> inducted, 20 exile -> exiled
      if (type === 'induct' && entry.induct_votes + 1 >= 50) {
        updates.status = 'inducted';
      } else if (type === 'exile' && entry.exile_votes + 1 >= 20) {
        updates.status = 'exiled';
      }

      await updateDoc(entryRef, updates);
      localStorage.setItem(`voted_${id}`, 'true');
    } catch (e) {
      console.error("Vote failed", e);
    }
  };

  const sections = {
    inducted: entries.filter(e => e.status === 'inducted'),
    pending: entries.filter(e => e.status === 'pending'),
    exiled: entries.filter(e => e.status === 'exiled'),
  };

  const Card = ({ entry }: { entry: any }) => (
    <motion.div 
      layout
      className={cn(
        "p-6 rounded-2xl border-2 transition-all space-y-4 relative overflow-hidden",
        entry.status === 'inducted' ? "border-green-500/30 bg-green-500/5" : 
        entry.status === 'exiled' ? "border-red-500/30 bg-red-500/5" :
        "border-white/10 bg-white/5"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xl font-display text-white tracking-widest flex items-center gap-2">
            {entry.name} {entry.status === 'inducted' && "👑"} {entry.status === 'exiled' && "💀"}
          </h4>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{entry.city}</p>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
            {new Date(entry.createdAt?.seconds * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <p className="text-xs text-white/60 italic leading-relaxed">"{entry.reason}"</p>

      {entry.status === 'pending' && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div className="space-y-2">
            <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest text-center">{entry.induct_votes} VOTES</p>
            <button 
              onClick={() => handleVote(entry.id, 'induct')}
              disabled={!!localStorage.getItem(`voted_${entry.id}`)}
              className="w-full py-2 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all rounded-lg disabled:opacity-50"
            >
              VOTE INDUCT 🟢
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest text-center">{entry.exile_votes} VOTES</p>
            <button 
              onClick={() => handleVote(entry.id, 'exile')}
              disabled={!!localStorage.getItem(`voted_${entry.id}`)}
              className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-lg disabled:opacity-50"
            >
              VOTE EXILE 🔴
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-16">
      {/* Submit Form */}
      <div className="max-w-xl mx-auto glass-card p-10 rounded-3xl border-brand-blue/30 bg-brand-blue/5 space-y-6">
        <h3 className="text-2xl font-display text-white tracking-widest uppercase text-center">Submit for Judgement</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="YOUR NAME" className="bg-white/5 border border-white/10 p-3 text-white text-sm outline-none focus:border-brand-blue"
            />
            <input 
              type="text" value={city} onChange={(e) => setCity(e.target.value)}
              placeholder="YOUR CITY" className="bg-white/5 border border-white/10 p-3 text-white text-sm outline-none focus:border-brand-blue"
            />
          </div>
          <textarea 
            value={reason} onChange={(e) => setReason(e.target.value)} maxLength={100}
            placeholder="WHY DO YOU DESERVE THE CARTEL? (MAX 100 CHARS)"
            className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm outline-none focus:border-brand-blue h-24 resize-none"
          />
          <button 
            onClick={handleSubmit} disabled={loading || !name || !city || !reason}
            className="w-full bg-brand-blue text-white py-4 font-bold tracking-[0.3em] uppercase hover:bg-brand-blue-glow transition-all disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "SUBMIT FOR JUDGEMENT"}
          </button>
        </div>
      </div>

      <div className="space-y-20">
        {/* Hall of Cartel */}
        {sections.inducted.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-green-500/20" />
              <h4 className="text-2xl font-display text-green-500 tracking-widest uppercase">Hall of the Cartel ({sections.inducted.length})</h4>
              <div className="h-[1px] flex-1 bg-green-500/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.inducted.slice(0, 6).map(entry => <Card key={entry.id} entry={entry} />)}
            </div>
          </div>
        )}

        {/* Awaiting Judgement */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/10" />
            <h4 className="text-2xl font-display text-white tracking-widest uppercase italic">Awaiting Judgement</h4>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.pending.map(entry => <Card key={entry.id} entry={entry} />)}
            {sections.pending.length === 0 && <p className="col-span-full text-center text-white/20 font-mono text-[10px] uppercase tracking-widest">No candidates currently under street review.</p>}
          </div>
        </div>

        {/* Exiled */}
        {sections.exiled.length > 0 && (
          <div className="space-y-8 opacity-60">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-red-500/20" />
              <h4 className="text-2xl font-display text-red-500 tracking-widest uppercase">Exiled from the East ({sections.exiled.length})</h4>
              <div className="h-[1px] flex-1 bg-red-500/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.exiled.map(entry => <Card key={entry.id} entry={entry} />)}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto py-10 border-t border-white/10 flex justify-between items-center px-10">
        <div className="text-center">
          <p className="text-4xl font-display text-green-500 leading-none">{sections.inducted.length}</p>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-2">Total Inducted</p>
        </div>
        <div className="w-[1px] h-12 bg-white/10" />
        <div className="text-center">
          <p className="text-4xl font-display text-red-500 leading-none">{sections.exiled.length}</p>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-2">Total Exiled</p>
        </div>
      </div>
    </div>
  );
}

function RapBattleTool() {
  const [topic, setTopic] = useState('');
  const [battle, setBattle] = useState<{ topic: string; eastVerse: string; westVerse: string; eastName: string; westName: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votes, setVotes] = useState({ east: 0, west: 0 });

  useEffect(() => {
    // Get total votes for current battle topic if exists
    if (!battle) return;
    const q = query(collection(db, 'rap_battle_votes'), where('topic', '==', battle.topic));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let e = 0; let w = 0;
      snapshot.docs.forEach(doc => {
        if (doc.data().side === 'east') e++;
        else w++;
      });
      setVotes({ east: e, west: w });
    });
    return () => unsubscribe();
  }, [battle]);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await generateRapBattle(topic);
      setBattle(resp);
    } catch (e) {
      console.error("Battle Fail", e);
      setError("The mic cut out. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (side: 'east' | 'west') => {
    if (!battle) return;
    try {
      await addDoc(collection(db, 'rap_battle_votes'), {
        side,
        topic: battle.topic,
        createdAt: serverTimestamp()
      });
    } catch (e) { console.error("Vote failed", e); }
  };

  const Verse = ({ text, side }: { text: string, side: 'east' | 'west' }) => {
    const bars = text.split('\n').filter(b => b.trim());
    return (
      <div className="space-y-4">
        {bars.map((bar, i) => (
          <motion.p 
            key={i}
            initial={{ opacity: 0, x: side === 'east' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5 }}
            className="text-lg md:text-xl font-display text-white uppercase tracking-widest leading-none italic"
          >
            {bar}
          </motion.p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {!battle ? (
        <div className="max-w-md mx-auto space-y-6">
          <input 
            type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="ENTER BATTLE TOPIC (e.g. loyalty, money)"
            className="w-full bg-white/5 border border-white/10 p-6 text-white focus:outline-none focus:border-brand-blue transition-all"
          />
          <button 
            onClick={generate} disabled={loading || !topic}
            className="w-full bg-brand-blue text-white py-6 font-bold tracking-[0.3em] uppercase hover:bg-brand-blue-glow transition-all disabled:opacity-50"
          >
            {loading ? "The battle is heating up..." : "TRIGGER STREET BATTLE"}
          </button>
          {error && <p className="text-red-500 text-xs font-mono text-center uppercase">{error}</p>}
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
           {/* Winner Banner */}
           {(votes.east > 0 || votes.west > 0) && (
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-center py-4 bg-brand-blue/20 border-y border-brand-blue/40"
             >
                <h2 className="text-4xl font-display text-white tracking-[0.3em]">
                  {votes.east >= votes.west ? "THE EAST REIGNS 👑" : "WEST SIDE TAKES IT"}
                </h2>
                <p className="text-[10px] font-mono text-white/40 uppercase mt-2">Live Vote Count: {votes.east} vs {votes.west}</p>
             </motion.div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/10">
              {/* East Side */}
              <div className="bg-brand-blue/20 p-12 relative">
                 <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-blue rounded-full animate-ping" />
                    <span className="text-[10px] font-bold text-brand-blue-glow tracking-widest uppercase">EAST SIDE</span>
                 </div>
                 <div className="mb-10 pt-4">
                    <h3 className="text-4xl font-display text-white italic">{battle.eastName}</h3>
                 </div>
                 <Verse text={battle.eastVerse} side="east" />
                 <button 
                   onClick={() => submitVote('east')}
                   className="mt-12 w-full py-4 bg-brand-blue text-white font-bold tracking-[0.3em] uppercase hover:bg-brand-blue-glow transition-all"
                 >
                   VOTE EAST 🔵
                 </button>
              </div>

              {/* West Side */}
              <div className="bg-red-900/20 p-12 text-right relative border-l border-white/5">
                 <div className="absolute top-6 right-6 flex items-center gap-2 flex-row-reverse">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">WEST SIDE</span>
                 </div>
                 <div className="mb-10 pt-4">
                    <h3 className="text-4xl font-display text-white italic">{battle.westName}</h3>
                 </div>
                 <Verse text={battle.westVerse} side="west" />
                 <button 
                    onClick={() => submitVote('west')}
                    className="mt-12 w-full py-4 bg-red-600 text-white font-bold tracking-[0.3em] uppercase hover:bg-red-700 transition-all"
                 >
                   VOTE WEST 🔴
                 </button>
              </div>
           </div>

           <button 
             onClick={() => setBattle(null)}
             className="w-full text-center text-[10px] font-mono text-white/20 hover:text-white transition-all uppercase tracking-widest"
           >
             RETURN TO LOCKER ROOM
           </button>
        </div>
      )}
    </div>
  );
}

function FlowAnalyzer() {
  const [lyrics, setLyrics] = useState('');
  const [result, setResult] = useState<{ score: number; feedback: string; lineAnalysis: { line: string; critique: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!lyrics.trim()) return;
    setLoading(true);
    try {
      const resp = await analyzeFlow(lyrics);
      setResult(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {!result ? (
        <div className="space-y-6">
          <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase text-center">Paste your bars below. Don't be shy, Jeriq won't miss anything.</p>
          <textarea 
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className="w-full h-64 bg-white/5 border border-white/10 p-6 text-white font-mono text-sm focus:border-brand-blue outline-none resize-none"
            placeholder="[Verse 1] I'm coming from the trenches where the sun don't shine..."
          />
          <button 
            onClick={analyze}
            disabled={loading || !lyrics.trim()}
            className="w-full bg-brand-blue text-white py-4 font-bold tracking-[0.3em] uppercase hover:bg-brand-blue-glow transition-all disabled:opacity-50"
          >
            {loading ? "JERIQ IS LISTENING..." : "ANALYZE MY FLOW"}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
           <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <h4 className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-1">FLOW SCORE</h4>
                <div className="text-6xl font-display text-brand-blue">{result.score}/10</div>
              </div>
              <button onClick={() => setResult(null)} className="text-white/20 hover:text-white transition-all">
                <RotateCcw size={20} />
              </button>
           </div>
           
           <div className="bg-brand-blue/5 border-l-4 border-brand-blue p-6 italic text-white/80 leading-relaxed font-serif text-lg">
             "{result.feedback}"
           </div>

           <div className="space-y-4">
              <h5 className="text-white/40 text-[10px] font-bold tracking-widest uppercase">LINE-BY-LINE FEEDBACK</h5>
              <div className="space-y-3">
                {result.lineAnalysis.map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg group hover:border-brand-blue/30 transition-all">
                    <p className="text-white font-mono text-xs mb-2 opacity-60">"{item.line}"</p>
                    <p className="text-sm font-bold text-brand-blue-glow uppercase tracking-tight">{item.critique}</p>
                  </div>
                ))}
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}

function ProphecyMachine() {
  const [name, setName] = useState('');
  const [prophecy, setProphecy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getProphecy = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const resp = await generateProphecy(name);
      setProphecy(resp.prophecy);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 text-center text-white">
      {!prophecy ? (
        <div className="space-y-6">
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="YOUR NAME"
            className="w-full bg-white/5 border border-white/10 p-6 font-mono text-center tracking-widest uppercase focus:border-brand-blue outline-none"
          />
          <button 
            onClick={getProphecy}
            disabled={loading || !name.trim()}
            className="w-full bg-white text-black py-4 font-bold tracking-[0.3em] uppercase hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? "CONSULTING THE SPIRITS..." : "REVEAL MY DESTINY"}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
           <div className="text-8xl text-brand-blue mb-4 flex justify-center"><Sparkles size={80} /></div>
           <p className="text-2xl font-display italic leading-tight text-glow">
             "{prophecy}"
           </p>
           <button onClick={() => setProphecy(null)} className="text-white/20 hover:text-white font-mono text-[10px] uppercase tracking-widest">
             SEEK ANOTHER VISION
           </button>
        </motion.div>
      )}
    </div>
  );
}

function MoodReader() {
  const moods = [
    "Hungry / Hustling", "Heartbroken", "Victory / Flexing", "Reflective / Spiritual", "Pure Energy / Party", "Stressed / Looking for Peace"
  ];
  const [selectedMood, setSelectedMood] = useState('');
  const [recommendation, setRecommendation] = useState<{ song: string; reason: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const getSong = async (mood: string) => {
    setSelectedMood(mood);
    setLoading(true);
    try {
      const resp = await readBeatMood(mood);
      setRecommendation(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moods.map(mood => (
          <button 
            key={mood}
            onClick={() => getSong(mood)}
            disabled={loading}
            className={cn(
              "p-4 border font-bold text-[10px] tracking-widest uppercase transition-all",
              selectedMood === mood ? "bg-brand-blue border-brand-blue text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
            )}
          >
            {mood}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12 animate-pulse text-brand-blue font-mono text-xs tracking-widest uppercase">
          READING YOUR AURA...
        </div>
      )}

      {recommendation && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 p-8 border-l-4 border-brand-blue">
          <h4 className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-4 text-white">THE VIBE FOR YOU:</h4>
          <div className="text-4xl font-display text-white mb-4 italic tracking-tighter uppercase">{recommendation.song}</div>
          <p className="text-white/60 font-serif leading-relaxed italic">"{recommendation.reason}"</p>
        </motion.div>
      )}
    </div>
  );
}

function WriteWithJeriq() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: { role: 'user' | 'assistant'; content: string } = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    
    try {
       // Using the same chat logic but context-aware for song writing
       const response = await fetch('/api/ai/generate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ 
           action: 'chat', 
           payload: { 
             messages: [
               { role: 'user', parts: [{ text: "We are writing a song together. You are Jeriq. Let's trade bars. Don't write too much at once, just follow my lead and give back raw Iyoo energy." }] },
               ...newMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }))
             ] 
           } 
         })
       });
       const data = await response.json();
       const assistantMsg: { role: 'user' | 'assistant'; content: string } = { role: 'assistant', content: data.text };
       setMessages([...newMessages, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] text-white">
      <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
            <PenTool size={48} />
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase max-w-xs">Drop a line, a hook, or just a vibe. Let's craft a masterpiece.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "max-w-[80%] p-4 rounded-xl font-mono text-sm leading-relaxed",
            msg.role === 'user' ? "ml-auto bg-brand-blue/20 border border-brand-blue/30" : "bg-white/5 border border-white/10"
          )}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-[10px] text-brand-blue animate-pulse uppercase tracking-widest font-bold">Jeriq is cooking...</div>}
      </div>
      
      <div className="flex gap-4">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="TYPE YOUR BARS..."
          className="flex-1 bg-white/5 border border-white/10 p-4 text-white focus:border-brand-blue outline-none font-mono text-xs tracking-widest"
        />
        <button 
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="p-4 bg-brand-blue text-white hover:bg-brand-blue-glow transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

// --- Main Lab Section ---

const TOOLS = [
  { id: 'card', name: 'Membership ID', icon: IdCard, component: MembershipCard },
  { id: 'wanted', name: 'WANTED POSTER', icon: ShieldCheck, component: WantedPoster },
  { id: 'rap-name', name: 'Rap Name Generator', icon: Terminal, component: RapNameGen },
  { id: 'news', name: 'IYOO NEWS', icon: Newspaper, component: IyooNews },
  { id: 'flow', name: 'FLOW ANALYZER', icon: Mic2, component: FlowAnalyzer },
  { id: 'write', name: 'WRITE WITH JERIQ', icon: PenTool, component: WriteWithJeriq },
  { id: 'prophecy', name: 'PROPHECY MACHINE', icon: Sparkles, component: ProphecyMachine },
  { id: 'mood', name: 'BEAT MOOD READER', icon: Music, component: MoodReader },
  { id: 'trivia', name: 'CARTELL TRIVIA', icon: Trophy, component: JeriqTrivia },
  { id: 'court', name: 'STREET COURT', icon: Flame, component: StreetCourt },
  { id: 'battle', name: 'RAP BATTLE', icon: Sword, component: RapBattleTool },
];

export default function Lab() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);

  return (
    <section id="lab" className="py-32 px-6 bg-brand-black relative">
       <div className="max-w-7xl mx-auto">
          <header className="mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1 border border-brand-blue/30 rounded-full bg-brand-blue/5 mb-6"
            >
              <span className="text-[10px] font-bold tracking-[0.5em] text-brand-blue-glow uppercase">The R&D Wing</span>
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-display text-white text-glow mb-8">Iyoo Lab</h2>
            <p className="text-white/40 tracking-[0.4em] uppercase text-[10px] max-w-2xl leading-loose">
              Experimental fan tools. High-fidelity weaponry for the Iyoo Cartel digital soldier.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Tool Navigation */}
            <div className="space-y-4">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool)}
                  className={cn(
                    "w-full flex items-center gap-4 p-6 rounded-xl border transition-all duration-300",
                    activeTool.id === tool.id 
                      ? "bg-brand-blue border-brand-blue text-white shadow-[0_0_30px_rgba(26,71,184,0.4)]"
                      : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10"
                  )}
                >
                  <tool.icon size={24} />
                  <span className="text-xs font-bold tracking-widest uppercase">{tool.name}</span>
                </button>
              ))}
            </div>

            {/* Active Tool View */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTool.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-brand-grey/50 p-12 rounded-3xl border border-white/5 min-h-[500px]"
                >
                  <div className="flex items-center gap-4 mb-12">
                     <div className="p-3 bg-brand-blue/10 rounded-lg">
                       <activeTool.icon className="text-brand-blue" size={32} />
                     </div>
                     <h3 className="text-3xl font-display text-white tracking-widest uppercase">{activeTool.name}</h3>
                  </div>
                  
                  <activeTool.component />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
       </div>

       {/* Decorative Side Rail */}
       <div className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-5 pointer-events-none hidden xl:block">
          <h2 className="text-[200px] font-display text-white leading-none rotate-90 origin-center whitespace-nowrap">EXPERIMENTAL</h2>
       </div>
    </section>
  );
}
