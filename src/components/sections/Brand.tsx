import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ENDORSEMENTS } from '@/constants/jeriqData';

export default function Brand() {
  return (
    <section id="partners" className="py-32 px-6 bg-brand-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display mb-4 text-glow"
          >
            The Brand Universe
          </motion.h2>
          <p className="text-white/40 tracking-[0.3em] uppercase text-xs">Strategic Partnerships & Global Endorsements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ENDORSEMENTS.map((item, idx) => (
            <motion.div
              key={item.brand}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={cn(
                "relative group overflow-hidden glass-card rounded-2xl border transition-all duration-500",
                item.brand === 'Pepsi' 
                  ? "md:col-span-2 lg:col-span-2 border-brand-blue/50 bg-brand-blue/10" 
                  : "border-white/5 hover:border-white/20"
              )}
            >
              {/* Background Glow */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700",
                item.brand === 'Pepsi' ? "bg-brand-blue" : "bg-white"
              )} />

              <div className="p-10 relative z-10 flex flex-col h-full justify-between gap-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold tracking-[0.5em] text-white/30 uppercase">
                        Est. {item.year}
                      </span>
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-white/5 p-2 border border-white/10 group-hover:border-brand-blue/30 transition-all duration-500">
                        <img 
                          src={(item as any).image} 
                          alt={item.brand} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain filter brightness-125"
                        />
                      </div>
                    </div>
                    {item.brand === 'Pepsi' && (
                      <span className="bg-brand-blue text-[8px] font-bold tracking-[0.2em] px-3 py-1 rounded-full text-white uppercase animate-pulse">
                        Crown Jewel Deal
                      </span>
                    )}
                  </div>
                  <h3 className={cn(
                    "text-4xl md:text-6xl font-display leading-tight",
                    item.brand === 'Pepsi' ? "text-white text-glow" : "text-white/80"
                  )}>
                    {item.brand}
                  </h3>
                </div>

                <div className="space-y-4">
                  <p className="text-white/50 font-sans text-sm leading-relaxed max-w-md">
                    {item.note}
                  </p>
                  
                  {item.brand === 'Pepsi' && (
                    <div className="pt-4 border-t border-white/10 mt-4">
                      <p className="text-xs italic text-brand-blue-glow">
                        "First Igbo artist to reach the Pepsi league. Recognizing talent where it's built."
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative Stamp Effect on hover */}
              <motion.div 
                className="absolute -right-10 -bottom-10 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 rotate-12"
              >
                <span className="text-[12rem] font-display text-white pointer-events-none uppercase">
                  IYOO
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
