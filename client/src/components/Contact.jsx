import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import LeadForm from './LeadForm';

const info = [
  { icon: FaPhone, label: 'Call Us', value: '(555) 123-4567', href: 'tel:+15551234567' },
  { icon: FaEnvelope, label: 'Email Us', value: 'info@centuriescontracting.com', href: 'mailto:info@centuriescontracting.com' },
  { icon: FaMapMarkerAlt, label: 'Visit Us', value: '123 Construction Ave, New York, NY 10001', href: '#' },
  { icon: FaClock, label: 'Business Hours', value: 'Mon – Fri: 8am – 6pm', href: null },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Contact Us</span>
          <h2 className="section-title mt-2">Let's Start Your Project</h2>
          <p className="section-subtitle mx-auto">Get in touch for a free consultation and quote. We respond within 24 hours.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Info */}
          <div className="lg:col-span-2 space-y-5">
            {info.map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                  {item.href && item.href !== '#' ? (
                    <a href={item.href} className="text-gray-800 font-medium text-sm hover:text-primary-500 transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-gray-800 font-medium text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden shadow-sm h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              <span>📍 Map — embed your Google Maps iframe here</span>
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
