import { motion } from 'motion/react';
import { Trophy, Star, TrendingUp, Music, Award, Disc, LucideIcon } from 'lucide-react';

interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  icon: LucideIcon;
  description?: string;
}

const AWARDS: AwardItem[] = [
  { 
    id: 'pepsi-25', 
    title: 'Brand Ambassador (First Igbo Artist)', 
    organization: 'Pepsi Global', 
    year: 'December 2025',
    icon: Award,
    description: 'A historic milestone: The first indigenous Igbo artist to join the global Pepsi family.'
  },
  { 
    id: 'headies-24', 
    title: 'Best Rap Single (Ije Nwoke)', 
    organization: 'Headies 2024', 
    year: '2024',
    icon: Trophy,
    description: 'Cementing the legacy of the Eastern rap sound globally.'
  },
  { 
    id: 'billboard', 
    title: 'Billboard Afrobeat Charts #47', 
    organization: 'Billboard', 
    year: 'May 2023',
    icon: TrendingUp,
    description: 'First breakthrough on the US Billboard charts.'
  },
  { 
    id: 'headies-23', 
    title: 'Best Rap Album + Best Rap Single', 
    organization: 'Headies 2023', 
    year: '2023',
    icon: Award,
    description: 'A historic night for the Eastern hussla.'
  },
  { 
    id: 'rolling-stone', 
    title: '40 Best Afropop Songs of 2023', 
    organization: 'Rolling Stone', 
    year: '2023',
    icon: Star,
    description: 'Critical acclaim from the worlds most iconic music journal.'
  },
  { 
    id: 'enugu', 
    title: 'Ministry of Culture PGM Plaque', 
    organization: 'Enugu State', 
    year: '2023',
    icon: Disc,
    description: 'Official recognition from the heart of the East.'
  },
  { 
    id: 'boomplay', 
    title: '92.5M+ Total Streams', 
    organization: 'Boomplay', 
    year: '2024',
    icon: Music,
    description: 'The numbers speak the truth of the OGBE strength.'
  }
];

export default function Awards() {
  return (
    <section id="awards" className="py-32 px-6 bg-brand-black relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 border-2 border-yellow-500/20 rounded-full mb-8 bg-yellow-500/5"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-yellow-500 uppercase">Hall of Greatness</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display text-white text-glow mb-8"
          >
            Awards & Records
          </motion.h2>
          <p className="text-white/40 tracking-[0.4em] uppercase text-[10px] max-w-2xl mx-auto leading-loose">
            Validation is for the streets, but records are for history. Every win is a win for the entire East.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AWARDS.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative"
            >
              {/* Heartbeat pulse animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.5 
                }}
                className="glass-card p-10 rounded-2xl border-white/5 relative overflow-hidden hover:border-yellow-500/30 transition-colors h-full flex flex-col"
              >
                {/* Gold Shimmer Effect on entry */}
                <motion.div 
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '200%' }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 + (i * 0.1) }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent skew-x-[-20deg] pointer-events-none"
                />

                {(() => {
                  const Icon = award.icon;
                  return (
                    <div className="mb-8 p-4 w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-all">
                      <Icon className="text-white group-hover:text-yellow-500 transition-colors" size={32} />
                    </div>
                  );
                })()}

                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-display text-white tracking-widest">{award.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-yellow-500 tracking-[0.3em] uppercase">{award.organization}</span>
                    <span className="text-white/20 font-mono text-[10px]">{award.year}</span>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed font-sans">{award.description}</p>
                </div>

                {/* Decorative bottom corner */}
                <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="absolute bottom-[-20%] right-[-20%] w-[150%] h-[150%] bg-yellow-500/10 rounded-full blur-xl" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Visual Detail: Vertical numbers */}
      <div className="absolute right-12 top-0 bottom-0 py-32 flex flex-col justify-between items-center opacity-10 pointer-events-none hidden xl:flex">
         {"0123456789".split("").map((n) => (
           <span key={n} className="text-xs font-mono text-white tracking-widest rotate-90">{n}</span>
         ))}
      </div>
    </section>
  );
}
