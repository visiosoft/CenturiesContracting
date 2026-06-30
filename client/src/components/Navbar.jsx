import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone } from 'react-icons/fa';
import centuriesLogo from '../assets/Centuries-transparent.png';

const anchorLinks = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchor = (href) => {
    setOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const solid = scrolled || !isHome;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? 'bg-dark-900/95 backdrop-blur-sm border-b border-dark-700' : 'bg-transparent border-b border-gold-400/10'}`}>
      {/* Top gold accent line */}
      {!solid && <div className="absolute top-0 left-0 right-0 h-px bg-gold-400 opacity-60" />}

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <button onClick={() => handleAnchor('#home')} className="flex items-center gap-3 group">
          <img src={centuriesLogo} alt="Centuries logo" className="h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="hidden sm:block">
            <div className="font-serif text-warm-300 text-lg tracking-[0.2em] leading-none">CENTURIES</div>
            <div className="text-gold-400 text-[8px] tracking-[0.4em] uppercase font-sans">Construction</div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <button onClick={() => handleAnchor('#home')} className="text-xs font-sans tracking-widest uppercase text-warm-400 hover:text-gold-400 transition-colors duration-200">Home</button>
          {anchorLinks.map(l => (
            <button key={l.href} onClick={() => handleAnchor(l.href)} className="text-xs font-sans tracking-widest uppercase text-warm-400 hover:text-gold-400 transition-colors duration-200">
              {l.label}
            </button>
          ))}
          <button onClick={() => { navigate('/gallery'); window.scrollTo(0,0); }} className="text-xs font-sans tracking-widest uppercase text-warm-400 hover:text-gold-400 transition-colors duration-200">Gallery</button>
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-5">
          <a href="tel:+971567601154" className="flex items-center gap-2 text-xs font-sans tracking-widest text-warm-400 hover:text-gold-400 transition-colors">
            <FaPhone className="text-gold-400 text-xs" /> 0567601154
          </a>
          <Link to="/quote" className="btn-primary text-xs py-2.5 px-5">
            Free Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-xl text-warm-300" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-screen' : 'max-h-0'}`}>
        <nav className="bg-dark-900 border-t border-dark-700 px-6 py-5 flex flex-col gap-4">
          <button onClick={() => { setOpen(false); handleAnchor('#home'); }} className="text-left text-xs tracking-widest uppercase text-warm-400 hover:text-gold-400 font-sans py-1 border-b border-dark-700 pb-3">Home</button>
          {anchorLinks.map(l => (
            <button key={l.href} onClick={() => handleAnchor(l.href)} className="text-left text-xs tracking-widest uppercase text-warm-400 hover:text-gold-400 font-sans py-1 border-b border-dark-700 pb-3">
              {l.label}
            </button>
          ))}
          <button onClick={() => { setOpen(false); navigate('/gallery'); window.scrollTo(0,0); }} className="text-left text-xs tracking-widest uppercase text-warm-400 hover:text-gold-400 font-sans py-1 border-b border-dark-700 pb-3">Gallery</button>
          <Link to="/quote" onClick={() => setOpen(false)} className="btn-primary justify-center mt-2">
            Get Free Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
