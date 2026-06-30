import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import centuriesLogo from '../assets/Centuries-transparent.png';

const services = ['Villa Fit-Out', 'Apartment Fit-Out', 'Office Fit-Out', 'Commercial Fit-Out', 'Interior Design & Build', 'Renovation & Remodeling'];

export default function Footer() {
  const handleNav = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-dark-900 text-warm-500 border-t border-dark-700">
      {/* Top gold bar */}
      <div className="h-px bg-gold-400 opacity-40" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src={centuriesLogo} alt="Centuries logo" className="h-9 w-auto object-contain opacity-80" />
            <div>
              <div className="font-serif text-warm-300 tracking-[0.2em] text-base leading-none">CENTURIES</div>
              <div className="text-gold-400 text-[7px] tracking-[0.4em] uppercase font-sans">Construction</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed mb-6 tracking-wide">
            Building with integrity and excellence. Premium fit-out and contracting services across Dubai since 2012.
          </p>
          <div className="flex gap-3">
            {[FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 border border-dark-600 hover:border-gold-400 flex items-center justify-center transition-colors text-warm-500 hover:text-gold-400">
                <Icon className="text-xs" />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-warm-300 text-xs tracking-[0.3em] uppercase font-sans mb-5">Our Services</h4>
          <span className="gold-line mb-5" />
          <ul className="space-y-3 mt-4">
            {services.map(s => (
              <li key={s}>
                <button onClick={() => handleNav('#services')} className="text-xs tracking-wide hover:text-gold-400 transition-colors text-left font-sans">{s}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-warm-300 text-xs tracking-[0.3em] uppercase font-sans mb-5">Quick Links</h4>
          <span className="gold-line mb-5" />
          <ul className="space-y-3 mt-4">
            {[['About Us', '#about'], ['Our Projects', '#projects'], ['Testimonials', '#testimonials'], ['Contact Us', '#contact'], ['Get Free Quote', '#contact']].map(([label, href]) => (
              <li key={label}>
                <button onClick={() => handleNav(href)} className="text-xs tracking-wide hover:text-gold-400 transition-colors text-left font-sans">{label}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-warm-300 text-xs tracking-[0.3em] uppercase font-sans mb-5">Contact Us</h4>
          <span className="gold-line mb-5" />
          <ul className="space-y-4 mt-4">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-gold-400 mt-0.5 flex-shrink-0 text-xs" />
              <span className="text-xs tracking-wide">Al Quoz, Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-gold-400 flex-shrink-0 text-xs" />
              <a href="tel:+971567601154" className="text-xs tracking-wide hover:text-gold-400 transition-colors">0567601154</a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-gold-400 flex-shrink-0 text-xs" />
              <a href="mailto:info@centuriescontracting.com" className="text-xs tracking-wide hover:text-gold-400 transition-colors">info@centuriescontracting.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs tracking-widest text-warm-600 font-sans">© {new Date().getFullYear()} Centuries Contracting. All rights reserved.</p>
          <div className="h-px w-12 bg-gold-400 opacity-30 hidden sm:block" />
          <p className="text-xs tracking-widest text-warm-600 font-sans">Design · Build · Dubai</p>
        </div>
      </div>
    </footer>
  );
}
