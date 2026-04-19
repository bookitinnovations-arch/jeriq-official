import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, Youtube, Twitter, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'BIO', href: '#bio' },
  { name: 'MUSIC', href: '#discography' },
  { name: 'IYOO AI', href: '#ai' },
  { name: 'ENERGY', href: '#community' },
  { name: 'BRANDS', href: '#partners' },
  { name: 'MUSEUM', href: '#gallery' },
  { name: 'AWARDS', href: '#awards' },
  { name: 'STADIUM', href: '#events' },
  { name: 'UNIVERSE', href: '#knowledge' },
  { name: 'LAB', href: '#lab' },
  { name: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 md:px-12',
        isScrolled 
          ? 'py-4 bg-brand-black/90 backdrop-blur-md border-b border-white/10 shadow-lg' 
          : 'py-8 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-display tracking-tighter text-white group"
        >
          JER<span className="text-brand-blue group-hover:text-white transition-colors">IQ</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="text-xs font-semibold tracking-widest text-white/70 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-blue transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        {/* Desktop Socials */}
        <div className="hidden md:flex items-center gap-4 border-l border-white/20 pl-8 ml-4">
          <motion.a 
            href="https://instagram.com/jeriqthehussla" 
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.1, color: '#002366' }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Instagram size={18} />
          </motion.a>
          <motion.a 
            href="https://open.spotify.com/artist/7MJaBrtUNMCVWliXOa7mwk" 
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.1, color: '#002366' }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Music size={18} />
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-black border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-6 p-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display tracking-wide text-white"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-6 mt-4 pt-6 border-t border-white/10">
                <a href="https://instagram.com/jeriqthehussla" target="_blank" rel="noreferrer">
                  <Instagram size={24} className="text-white/60" />
                </a>
                <a href="https://youtube.com/@jeriqthehussla?themeRefresh=1" target="_blank" rel="noreferrer">
                  <Youtube size={24} className="text-white/60" />
                </a>
                <a href="https://open.spotify.com/artist/7MJaBrtUNMCVWliXOa7mwk" target="_blank" rel="noreferrer">
                  <Music size={24} className="text-white/60" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
