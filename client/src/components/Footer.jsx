import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

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
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 C20 6, 9 11, 9 22 C9 30, 20 34, 20 34 C20 34, 31 30, 31 22 C31 11, 20 6, 20 6Z" />
                <path d="M20 34 L20 6" />
              </svg>
            </div>
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
              <span>123 Construction Ave, Suite 100<br />New York, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-primary-400 flex-shrink-0" />
              <a href="tel:+15551234567" className="hover:text-primary-400 transition-colors">(555) 123-4567</a>
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
