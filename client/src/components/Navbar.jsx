import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone } from 'react-icons/fa';

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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${solid ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 C20 6, 9 11, 9 22 C9 30, 20 34, 20 34 C20 34, 31 30, 31 22 C31 11, 20 6, 20 6Z" />
              <path d="M20 34 L20 6" />
            </svg>
          </div>
          <span className={`text-xl font-bold transition-colors ${solid ? 'text-primary-600' : 'text-white'}`}>
            Centuries
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary-500 ${solid ? 'text-gray-700' : 'text-white/90'}`}>Home</Link>
          {anchorLinks.map(l => (
            <button key={l.href} onClick={() => handleAnchor(l.href)} className={`text-sm font-medium transition-colors hover:text-primary-500 ${solid ? 'text-gray-700' : 'text-white/90'}`}>
              {l.label}
            </button>
          ))}
          <Link to="/gallery" className={`text-sm font-medium transition-colors hover:text-primary-500 ${solid ? 'text-gray-700' : 'text-white/90'}`}>Gallery</Link>
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+15551234567" className={`flex items-center gap-2 text-sm font-medium ${solid ? 'text-primary-600' : 'text-white'}`}>
            <FaPhone className="text-xs" /> (555) 123-4567
          </a>
          <Link to="/quote" className="btn-primary text-sm py-2 px-4">
            Get Free Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className={`lg:hidden text-2xl ${solid ? 'text-gray-800' : 'text-white'}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-screen' : 'max-h-0'}`}>
        <nav className="bg-white shadow-lg px-6 py-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setOpen(false)} className="text-gray-700 font-medium hover:text-primary-600 py-1 border-b border-gray-100">Home</Link>
          {anchorLinks.map(l => (
            <button key={l.href} onClick={() => handleAnchor(l.href)} className="text-left text-gray-700 font-medium hover:text-primary-600 py-1 border-b border-gray-100">
              {l.label}
            </button>
          ))}
          <Link to="/gallery" onClick={() => setOpen(false)} className="text-gray-700 font-medium hover:text-primary-600 py-1 border-b border-gray-100">Gallery</Link>
          <Link to="/quote" onClick={() => setOpen(false)} className="btn-primary justify-center mt-2">
            Get Free Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
