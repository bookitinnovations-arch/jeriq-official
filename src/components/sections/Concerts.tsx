import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Users, Ticket, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Concert {
  id: string;
  title: string;
  location: string;
  attendance: number;
  date: string;
  image: string;
}

const CONCERTS: Concert[] = [
  { 
    id: 'concert-1', 
    title: 'The Billion Dollar Concert', 
    location: 'Okpara Square, Enugu', 
    attendance: 15000, 
    date: 'Dec 10, 2023',
    image: 'https://picsum.photos/seed/jeriq-square/600/800?grayscale'
  },
  { 
    id: 'stadium-1', 
    title: 'Onitsha Invasion', 
    location: 'Chuba Ikpeazu Stadium, Onitsha', 
    attendance: 20000, 
    date: 'Nov 24, 2024',
    image: 'https://picsum.photos/seed/jeriq-onitsha/600/800'
  },
  { 
    id: 'stadium-2', 
    title: 'The Final Lockdown', 
    location: 'Nnamdi Azikiwe Stadium, Enugu', 
    attendance: 30000, 
    date: 'Dec 2024',
    image: 'https://picsum.photos/seed/jeriq-enugu-stadium/600/800'
  }
];

const CITIES = [
  { id: 'enugu', name: 'Enugu', x: '55%', y: '65%' },
  { id: 'onitsha', name: 'Onitsha', x: '45%', y: '68%' },
  { id: 'aba', name: 'Aba', x: '52%', y: '78%' },
  { id: 'owerri', name: 'Owerri', x: '48%', y: '73%' },
  { id: 'awka', name: 'Awka', x: '50%', y: '68%' },
];

export default function Concerts() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45); // Setting a future concert 45 days away

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="events" className="py-32 px-6 bg-brand-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Legendary Headline */}
        <header className="mb-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display text-white mb-6 uppercase tracking-tight leading-tight"
          >
            First Nigerian rapper to sell out <br/>
            <span className="text-brand-blue text-glow">two stadiums in one month</span>
          </motion.h1>
          <div className="h-1 w-32 bg-brand-blue mx-auto shadow-[0_0_20px_#1a47b8]" />
        </header>

        {/* Global Countdown */}
        <div className="mb-32 glass-card p-12 rounded-3xl border-brand-blue/20 bg-brand-blue/5 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Ticket size={200} className="text-brand-blue" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h3 className="text-xs font-bold tracking-[0.5em] text-brand-blue mb-4 uppercase italic">Next Global Appearance</h3>
              <h2 className="text-4xl md:text-6xl font-display text-white tracking-widest">IYOO CARTELL CONCERT</h2>
              <div className="flex items-center gap-4 mt-6 text-white/40 uppercase text-[10px] tracking-widest font-bold">
                <MapPin size={14} className="text-brand-blue" />
                <span>Eko Convention Center, Lagos</span>
              </div>
            </div>

            <div className="flex gap-4 md:gap-8">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hrs', val: timeLeft.hours },
                { label: 'Min', val: timeLeft.minutes },
                { label: 'Sec', val: timeLeft.seconds },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-4xl md:text-6xl font-display text-white text-glow mb-2">{item.val.toString().padStart(2, '0')}</div>
                  <div className="text-[10px] font-bold tracking-widest text-white/20 uppercase">{item.label}</div>
                </div>
              ))}
            </div>
            
            <button className="group px-12 py-5 bg-brand-blue text-white font-bold tracking-widest uppercase transition-all hover:bg-brand-blue-glow shadow-xl flex items-center gap-4">
              Get Tickets
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stadium Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {CONCERTS.map((concert, i) => (
            <motion.div
              key={concert.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="group relative h-[600px] rounded-2xl overflow-hidden cursor-none"
            >
              <img 
                src={concert.image} 
                alt={concert.title} 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-white/60 tracking-widest uppercase font-bold">
                    {concert.date}
                  </span>
                </div>
                <h3 className="text-3xl font-display text-white tracking-widest mb-2">{concert.title}</h3>
                <div className="flex items-center gap-2 text-white/40 text-[10px] tracking-widest uppercase font-bold mb-8">
                  <MapPin size={12} className="text-brand-blue" />
                  {concert.location}
                </div>
                
                <div className="flex items-end justify-between border-t border-white/10 pt-8">
                  <div>
                    <div className="flex items-center gap-4 text-white text-4xl font-display text-glow">
                      {inView && (
                        <CountUp 
                          end={concert.attendance} 
                          duration={2.5} 
                          separator=","
                        />
                      )}
                      <span className="text-brand-blue">+</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase mt-2">Sold Out Attendance</div>
                  </div>
                  <Users size={32} className="text-white/20 animate-pulse" />
                </div>
              </div>

              {/* Poster Border Detail */}
              <div className="absolute inset-6 border border-white/10 pointer-events-none group-hover:border-brand-blue/40 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Jeriqhood Map */}
        <div className="relative py-32 flex flex-col items-center">
          <div className="text-center mb-16 px-6">
            <h2 className="text-4xl md:text-6xl font-display text-white tracking-widest mb-4">The Jeriqhood Map</h2>
            <p className="text-white/40 tracking-[0.5em] uppercase text-[10px] font-bold">A legacy established across the Eastern Sovereignty</p>
          </div>

          <div className="relative w-full max-w-4xl aspect-[4/3] bg-brand-blue/5 rounded-3xl border border-white/5 overflow-hidden group">
            <svg viewBox="0 0 1000 800" className="w-full h-full opacity-20 transition-all group-hover:opacity-40 grayscale group-hover:grayscale-0">
               {/* Minimal Nigeria Outline Representation */}
               <path d="M150 150 Q250 100 400 120 Q600 80 850 150 L880 350 Q850 500 800 650 Q600 750 300 700 Q150 650 120 400 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-blue" />
            </svg>
            
            {CITIES.map((city) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="absolute flex flex-col items-center group/city"
                style={{ top: city.y, left: city.x }}
              >
                <div className="relative">
                  <div className="w-3 h-3 bg-brand-blue rounded-full shadow-[0_0_15px_#1a47b8] animate-ping absolute inset-0" />
                  <div className="w-3 h-3 bg-brand-blue rounded-full relative z-10" />
                </div>
                <div className="mt-4 px-3 py-1 bg-brand-black/80 backdrop-blur-md border border-white/10 rounded-lg opacity-0 group-hover/city:opacity-100 transition-all translate-y-2 group-hover/city:translate-y-0 text-[10px] text-white font-bold tracking-widest uppercase truncate min-w-max">
                  {city.name} — OGBE HQ
                </div>
              </motion.div>
            ))}

            {/* Circuit Lines connecting cities */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
               <motion.path 
                 initial={{ pathLength: 0 }}
                 whileInView={{ pathLength: 1 }}
                 transition={{ duration: 2 }}
                 d="M550 520 L450 544 L520 624 L480 584 L500 544" 
                 fill="none" 
                 stroke="white" 
                 strokeWidth="1" 
                 strokeDasharray="4 4"
               />
            </svg>
            
            <div className="absolute inset-6 border border-brand-blue/10 pointer-events-none" />
            <div className="absolute top-10 left-10 text-[8px] font-mono text-white/20 tracking-[1em] uppercase vertical-text">EASTERN SECTOR 042</div>
          </div>
        </div>
      </div>
    </section>
  );
}
