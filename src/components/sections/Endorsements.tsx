import { motion } from 'motion/react';
import { Briefcase, CheckCircle2, Crown, Globe, Zap, Smartphone, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandCard {
  id: string;
  name: string;
  copy: string;
  details: string;
  icon: any;
  image: string;
  isPremium?: boolean;
  color?: string;
}

const BRANDS: BrandCard[] = [
  {
    id: 'pepsi',
    name: 'Pepsi',
    copy: 'First Igbo Artist. December 2025. Same league as Burna Boy, Wizkid, Davido.',
    details: 'Phyno never got this. Jeriq did. The ultimate validation of Eastern street power.',
    icon: Crown,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8j9HMYwD1_ec4bhPvTmAnIbu8Wcdu3s59iQ&s',
    isPremium: true,
    color: 'bg-[#1a47b8]'
  },
  {
    id: 'hero',
    name: 'Hero Lager',
    copy: "Eastern Nigeria's beer. Eastern Nigeria's rapper.",
    details: 'The cultural alliance where heritage meets the hussle. Perfect.',
    icon: Globe,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bdH9dn6UJjgnUTBlDX7zhT0Fd_TFbksaWg&s',
    color: 'bg-[#b8860b]'
  },
  {
    id: 'kedu',
    name: 'Kedu App',
    copy: 'Connecting Igbo people worldwide.',
    details: 'Jeriq is the face of the bridge between tradition and tech.',
    icon: Smartphone,
    image: 'https://d1jcea4y7xhp7l.cloudfront.net/wp-content/uploads/2024/08/IMG-20240824-WA0009-1.jpg',
    color: 'bg-brand-blue'
  },
  {
    id: 'ash',
    name: 'ASHLUXURY',
    copy: 'Street fashion. Iyoo Cartel style.',
    details: 'Defining the aesthetic of the modern Eastern king.',
    icon: Zap,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0ZaOZs41VnENvZojgcQX59drmdoaH4f9qHw&s',
    color: 'bg-white/10'
  },
  {
    id: 'passyx',
    name: 'PassyXchange',
    copy: 'The crypto pioneer move. 2021.',
    details: 'A visionary financial alignment early in the game.',
    icon: Briefcase,
    image: 'https://cdn.guardian.ng/wp-content/uploads/2021/11/D37BC6CF-612F-4368-AD18-D6FD8A4EA5BC.jpeg',
    color: 'bg-[#22c55e]/20'
  }
];

export default function Endorsements() {
  return (
    <section id="partners" className="py-32 px-6 bg-brand-grey relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Briefcase size={400} className="text-white" />
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-px bg-brand-blue" />
            <span className="text-[10px] font-bold tracking-[0.5em] text-brand-blue-glow uppercase">Corporate Civilization</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display text-white text-glow mb-8"
          >
            The Business of Jeriq
          </motion.h2>
          <p className="text-white/40 tracking-[0.4em] uppercase text-[10px] max-w-2xl leading-loose">
            High-value alignments. Strategic dominance. The commercial manifestation of the Iyoo Cartel.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.1,
                ease: [0.33, 1, 0.68, 1] 
              }}
              className={cn(
                "relative group",
                brand.isPremium ? "lg:col-span-4" : "lg:col-span-2"
              )}
            >
              <div className={cn(
                "h-full glass-card p-10 rounded-3xl border-white/5 overflow-hidden flex flex-col justify-between transition-all duration-700 hover:border-brand-blue/30",
                brand.isPremium && "border-brand-blue/40 shadow-[0_0_50px_rgba(26,71,184,0.1)]"
              )}>
                {/* Background Brand Color Glow */}
                <div className={cn(
                  "absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700",
                  brand.color
                )} />

                {/* Stamp Effect on Entry */}
                <motion.div
                  initial={{ scale: 2, opacity: 0, rotate: -20 }}
                  whileInView={{ scale: 1, opacity: 0.1, rotate: -15 }}
                  transition={{ delay: 0.5 + (i * 0.1), type: 'spring' }}
                  className="absolute top-10 right-10 pointer-events-none"
                >
                  <div className="border-[10px] border-white px-6 py-2 rounded-xl text-3xl font-display uppercase tracking-widest">
                    DEAL SIGNED
                  </div>
                </motion.div>

                <div>
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-brand-blue/40 transition-colors">
                        <brand.icon className={cn("text-white", brand.isPremium && "text-brand-blue")} size={24} />
                      </div>
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-white/5 p-1 border border-white/10 group-hover:border-brand-blue/20 transition-all">
                        <img 
                          src={brand.image} 
                          alt={brand.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    {brand.isPremium && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-brand-blue rounded-full">
                        <Crown size={10} className="text-white" />
                        <span className="text-[8px] font-bold tracking-widest text-white uppercase">Crown Jewel</span>
                      </div>
                    )}
                  </div>

                  <h3 className={cn(
                    "font-display text-white tracking-widest mb-4",
                    brand.isPremium ? "text-5xl md:text-7xl" : "text-3xl"
                  )}>
                    {brand.name}
                  </h3>
                  
                  <p className={cn(
                    "text-white leading-relaxed font-medium mb-6",
                    brand.isPremium ? "text-xl md:text-2xl max-w-xl" : "text-sm text-white/80"
                  )}>
                    "{brand.copy}"
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                    {brand.details}
                  </p>
                  <div className="flex items-center gap-2 text-brand-blue opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                    <span className="text-[10px] font-bold tracking-widest uppercase">Verified Partnership</span>
                    <CheckCircle2 size={12} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
