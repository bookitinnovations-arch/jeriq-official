import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

type Era = '2015' | '2020' | '2021' | '2022' | '2023' | '2024' | '2026';

interface EraData {
  year: Era;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  milestones: string[];
  theme: {
    bg: string;
    accent: string;
    text: string;
    filter?: string;
    font?: string;
  };
}

const eras: EraData[] = [
  {
    year: '2015',
    title: 'The Beginning',
    subtitle: 'OGBE Genesis',
    description: 'A raw talent emerges from the hard-knocks of Nkpor, Anambra. No funds, no label, just 100% hunger and the burning spirit of the East.',
    quote: "I never knew I'd be here, I just knew I couldn't stay there.",
    milestones: ['First rap battle in Enugu street blocks', 'Dropped "I No Go Lie" street anthem', 'Established the OGBE mentality'],
    theme: {
      bg: 'bg-brand-grey',
      accent: 'border-white/20',
      text: 'text-white/70',
      filter: 'grayscale(100%) contrast(1.2) sepia(0.2)',
    }
  },
  {
    year: '2020',
    title: 'Hood Boy Dreams',
    subtitle: 'The Street Awakening',
    description: 'The breakout year. The Hood Boy Dreams EP changes the landscape of Igbo Trap. Signed to KOD Music Group, the "Hussla" becomes a household name.',
    quote: "Street no go gree for you if you no stand your ground.",
    milestones: ['Hood Boy Dreams EP (Tracks: Amen, Remember)', 'Signed to KOD Music Group', 'Viral street dominance in Enugu'],
    theme: {
      bg: 'bg-[#0f0f0f]',
      accent: 'border-white',
      text: 'text-white',
      filter: 'contrast(1.5)',
    }
  },
  {
    year: '2021',
    title: 'East N West',
    subtitle: 'Indigenous Fusion',
    description: 'The Iyoo Cartel era begins. Collaboration with Dremo on "East N West" EP bridges the gap between Lagos and Enugu.',
    quote: "Iyooh! The East is now on the map globally.",
    milestones: ['East N West EP with Dremo (Track: Doubt)', 'Remember Remix ft. Phyno (Culture Shift)', 'Graduated ESUT (BSc Computer Science)'],
    theme: {
      bg: 'bg-[#0a1a3a]',
      accent: 'border-brand-blue',
      text: 'text-brand-white',
    }
  },
  {
    year: '2022',
    title: 'Billion Dollar Dream',
    subtitle: 'The Wealth Manifestation',
    description: 'May 26, 2022: The debut album Billion Dollar Dream drops. 12 tracks featuring Flavour, Alpha P, and Kofi Jamar. The hussle transforms into a legacy.',
    quote: "Success is the only option, failure doesn't exist in my vocabulary.",
    milestones: ['Billion Dollar Dream Album (Tracks: Active, Oluoma)', 'Billboard Afrobeat Charts entry', 'Hometown hero status finalized'],
    theme: {
      bg: 'bg-[#050510]',
      accent: 'border-yellow-600',
      text: 'text-white',
    }
  },
  {
    year: '2023',
    title: 'Rolling Stone',
    subtitle: 'International Recognition',
    description: 'The world takes notice. Rolling Stone lists Jeriq among the best. 15,000 fans pack Okpara Square for the Billion Dollar Dream concert.',
    quote: "They said I was local, now I'm global with the same bars.",
    milestones: ['15,000 capacity Okpara Square (SOLD OUT)', 'Rolling Stone: Best Afropop Songs of 2023', 'Headies: Best Rap Album Nomination'],
    theme: {
      bg: 'bg-brand-black',
      accent: 'border-brand-blue-glow',
      text: 'text-brand-white',
    }
  },
  {
    year: '2024',
    title: 'King Era',
    subtitle: 'The Throne Secured',
    description: 'August 16, 2024: The King album secures the crown. Featuring Bella Shmurda, Odumodublvck, and Knucks. Selling out 30,000 capacity stadiums.',
    quote: "Onye obuna na-eme ife ya. I'm the King of the East.",
    milestones: ['King Album Release (Track: Ije Nwoke)', '30,000 capacity Stadium (SOLD OUT)', 'Evil Twin EP with PsychoYP'],
    theme: {
      bg: 'bg-[#020210]',
      accent: 'border-white',
      text: 'text-glow text-white',
    }
  },
  {
    year: '2026',
    title: 'Born to Be Great',
    subtitle: 'The Pepsi Ambassadorship',
    description: 'The transcendence. First Igbo artist to bag a Pepsi deal. January 26, 2026: "Born to Be Great" drops—a cinematic anthem for a global civilization.',
    quote: "First Igbo artist with the Pepsi deal. Legend in making.",
    milestones: ['Pepsi Brand Ambassador (First Igbo Artist)', 'Born to Be Great Single Release', 'Global Iyoo Cartel Platform Launch'],
    theme: {
      bg: 'bg-[#000000]',
      accent: 'border-brand-blue-glow',
      text: 'text-glow text-white',
    }
  }
];

export default function Biography() {
  const [activeEra, setActiveEra] = useState<Era>('2024');
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const era = eras.find(e => e.year === activeEra) || eras[5];

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, x: 50 }, 
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [activeEra]);

  return (
    <section 
      ref={sectionRef}
      id="bio"
      className={cn(
        "relative min-h-screen py-32 px-6 transition-all duration-1000",
        era.theme.bg
      )}
      style={{ filter: era.theme.filter }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl mb-4"
          >
            Era Time Machine
          </motion.h2>
          <div className="h-1 w-24 bg-brand-blue mx-auto" />
        </div>

        {/* Time Machine Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-20 relative z-20">
          {eras.map((e) => (
            <button
              key={e.year}
              onClick={() => setActiveEra(e.year)}
              className={cn(
                "px-8 py-3 rounded-full font-display text-xl transition-all duration-300 border",
                activeEra === e.year 
                  ? "bg-brand-blue border-brand-blue text-white scale-110 shadow-lg" 
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30"
              )}
            >
              {e.year}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Side: Typography */}
          <div className="space-y-12">
            <div className="space-y-4">
              <span className={cn("text-xs font-bold tracking-[0.5em] uppercase", era.theme.text)}>
                {era.subtitle}
              </span>
              <h3 className={cn("text-5xl md:text-7xl", era.theme.text)}>
                {era.title}
              </h3>
            </div>

            <p className="text-lg text-white/60 leading-relaxed font-sans">
              {era.description}
            </p>

            <div className="relative p-8 glass-card rounded-2xl border-l-4 border-brand-blue">
              <p className="text-2xl font-display italic text-white/90">
                "{era.quote}"
              </p>
            </div>
          </div>

          {/* Right Side: Milestones */}
          <div className="grid gap-6">
            {era.milestones.map((milestone, idx) => (
              <motion.div
                key={milestone}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={cn(
                  "p-6 glass-card rounded-xl border flex items-center gap-6 group hover:translate-x-2 transition-all duration-300",
                  era.theme.accent
                )}
              >
                <div className="text-3xl font-display text-brand-blue/50 group-hover:text-brand-blue transition-colors">
                  0{idx + 1}
                </div>
                <div className="h-full w-px bg-white/10" />
                <span className="text-white font-medium tracking-wide">
                  {milestone}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Decorative Year */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none overflow-hidden">
        <span className="text-[40vw] font-display text-white/[0.02] leading-none">
          {activeEra}
        </span>
      </div>
    </section>
  );
}
