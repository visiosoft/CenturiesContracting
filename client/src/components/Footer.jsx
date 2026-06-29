import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import centuriesLogo from '../assets/Centuries-transparent.png';

const services = ['General Contracting', 'Commercial Construction', 'Residential Remodeling', 'Project Management', 'Design & Build', 'Renovation'];

export default function Footer() {
  const handleNav = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={centuriesLogo} alt="Centuries logo" className="h-10 w-auto object-contain flex-shrink-0" />
            <span className="text-white font-bold text-xl">Centuries</span>
          </div>
          <p className="text-sm leading-relaxed mb-5">
            Building with integrity and excellence. Centuries Contracting delivers quality construction services that stand the test of time.
          </p>
          <div className="flex gap-3">
            {[FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-gray-700 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold mb-4">Our Services</h4>
          <ul className="space-y-2">
            {services.map(s => (
              <li key={s}>
                <button onClick={() => handleNav('#services')} className="text-sm hover:text-primary-400 transition-colors text-left">{s}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[['About Us', '#about'], ['Our Projects', '#projects'], ['Testimonials', '#testimonials'], ['Contact Us', '#contact'], ['Get Free Quote', '#contact']].map(([label, href]) => (
              <li key={label}>
                <button onClick={() => handleNav(href)} className="text-sm hover:text-primary-400 transition-colors text-left">{label}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-primary-400 mt-0.5 flex-shrink-0" />
              <span>Al Quoz, Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-primary-400 flex-shrink-0" />
              <a href="tel:+971567601154" className="hover:text-primary-400 transition-colors">0567601154</a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-primary-400 flex-shrink-0" />
              <a href="mailto:info@centuriescontracting.com" className="hover:text-primary-400 transition-colors">info@centuriescontracting.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Centuries Contracting. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
