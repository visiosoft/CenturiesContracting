import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import LeadForm from './LeadForm';

const info = [
  { icon: FaPhone,         label: 'Call Us',         value: '0567601154',                   href: 'tel:+971567601154' },
  { icon: FaEnvelope,      label: 'Email Us',         value: 'info@centuriescontracting.com', href: 'mailto:info@centuriescontracting.com' },
  { icon: FaMapMarkerAlt,  label: 'Visit Us',         value: 'Al Quoz, Dubai, UAE',           href: 'https://maps.google.com/?q=Al+Quoz+Dubai' },
  { icon: FaClock,         label: 'Business Hours',   value: 'Mon – Sat: 8am – 7pm',          href: null },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="gold-line" />
            <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">Contact Us</span>
          </div>
          <h2 className="section-title">Let's Start Your Project</h2>
          <p className="text-warm-500 text-sm mt-3 font-sans">Get in touch for a free consultation. We respond within 24 hours.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Info */}
          <div className="lg:col-span-2 space-y-px bg-dark-700">
            {info.map((item, i) => (
              <div key={i} className="bg-dark-900 flex items-start gap-4 p-5 hover:bg-dark-800 transition-colors duration-200">
                <div className="w-9 h-9 border border-gold-400 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-gold-400 text-xs" />
                </div>
                <div>
                  <p className="text-warm-600 text-xs tracking-widest uppercase font-sans mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-warm-300 text-sm font-sans hover:text-gold-400 transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-warm-300 text-sm font-sans">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-dark-900 overflow-hidden h-48">
              <iframe
                title="Centuries Contracting Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.534!2d55.2326!3d25.1734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b5400000001%3A0x0!2sAl%20Quoz%2C%20Dubai!5e0!3m2!1sen!2sae!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(0.8)' }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <LeadForm compact={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
