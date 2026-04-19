import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Instagram, 
  Twitter, 
  Youtube, 
  Music, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Briefcase,
  Star,
  Zap
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../../firebase-applet-config.json';
import { cn } from '@/lib/utils';

// Lazy init firebase for the component
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const SOCIALS = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/jeriqthehussla' },
  { name: 'Twitter/X', icon: Twitter, href: 'https://twitter.com/jeriqthehussla' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@jeriqthehussla?themeRefresh=1' },
  { name: 'Spotify', icon: Music, href: 'https://open.spotify.com/artist/7MJaBrtUNMCVWliXOa7mwk' },
  { name: 'Apple Music', icon: Star, href: 'https://music.apple.com/us/artist/jeriq/1414436998' },
  { name: 'Boomplay', icon: Music, href: 'https://www.boomplay.com/artists/2863878' },
  { name: 'Audiomack', icon: Music, href: 'https://audiomack.com/jeriq' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Fan Mail',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const lastSubmitTime = useRef<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Audit fix: 60s rate limit for contact form
    const now = Date.now();
    if (now - lastSubmitTime.current < 60000) {
      alert("IYOO!!! Signal is already in the air. Wait a minute before the next transmission.");
      return;
    }

    setStatus('loading');
    try {
      await addDoc(collection(firestore, 'messages'), {
        ...formData,
        timestamp: serverTimestamp()
      });
      lastSubmitTime.current = Date.now();
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'Fan Mail', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-brand-black border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        
        {/* Contact Logic */}
        <div>
          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1 border border-brand-blue/30 rounded-full bg-brand-blue/5 mb-6"
            >
              <span className="text-[10px] font-bold tracking-[0.5em] text-brand-blue-glow uppercase">Direct Channel</span>
            </motion.div>
            <h2 className="text-6xl font-display text-white tracking-widest mb-4">Contact</h2>
            <p className="text-white/40 tracking-[0.4em] uppercase text-[10px]">Establish a secure connection with the Iyoo Cartel HQ.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 p-4 font-mono text-white tracking-widest uppercase focus:border-brand-blue outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 p-4 font-mono text-white tracking-widest uppercase focus:border-brand-blue outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">Subject</label>
              <select 
                className="w-full bg-white/5 border border-white/10 p-4 font-mono text-white tracking-widest uppercase focus:border-brand-blue outline-none appearance-none"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              >
                <option value="Booking">Booking</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Press">Press</option>
                <option value="Fan Mail">Fan Mail</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">Message</label>
              <textarea 
                required
                rows={6}
                className="w-full bg-white/5 border border-white/10 p-4 font-mono text-white tracking-widest uppercase focus:border-brand-blue outline-none resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-brand-blue text-white py-6 font-bold tracking-[0.4em] uppercase flex items-center justify-center gap-4 hover:bg-brand-blue-glow transition-all disabled:opacity-50 group"
            >
              <AnimatePresence mode="wait">
                {status === 'loading' ? (
                  <motion.div key="loading" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Zap size={20} />
                  </motion.div>
                ) : status === 'success' ? (
                  <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 size={20} />
                    <span>SENT</span>
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="flex items-center gap-2">
                    <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    <span>Transmit Message</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>
        </div>

        {/* Social Pillars */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            {SOCIALS.map((social) => (
              <a 
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="glass-card p-10 rounded-2xl flex flex-col items-center justify-center gap-6 group hover:border-brand-blue/40 transition-all border-white/5"
              >
                <div className="relative">
                   <social.icon className="text-white group-hover:text-brand-blue transition-colors relative z-10" size={40} />
                   <div className="absolute inset-0 bg-brand-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase group-hover:text-white transition-colors">{social.name}</span>
              </a>
            ))}
            <div className="glass-card p-10 rounded-2xl flex flex-col items-center justify-center gap-6 border-brand-blue/10 bg-brand-blue/5">
               <Briefcase className="text-brand-blue" size={40} />
               <span className="text-[10px] font-bold tracking-[0.3em] text-brand-blue uppercase">Official Work</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
