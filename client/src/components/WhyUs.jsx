import { FaShieldAlt, FaClock, FaFileInvoiceDollar, FaHeadset, FaMedal, FaStar } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const reasons = [
  { icon: FaShieldAlt,          title: 'Licensed & Insured',    desc: 'Fully licensed, bonded, and insured in UAE for your complete peace of mind.' },
  { icon: FaClock,              title: 'On-Time Delivery',      desc: 'We respect your timeline. 97% of our projects are delivered on or before deadline.' },
  { icon: FaFileInvoiceDollar,  title: 'Transparent Pricing',   desc: 'No hidden fees. You get a detailed, itemized quote before any work begins.' },
  { icon: FaHeadset,            title: 'Dedicated Support',     desc: 'A project manager is assigned to you from day one and stays until handover.' },
  { icon: FaMedal,              title: 'Quality Guaranteed',    desc: 'We stand behind our work with a comprehensive workmanship warranty.' },
  { icon: FaStar,               title: '50+ Happy Clients',     desc: 'A growing list of satisfied clients who trust us for every new project.' },
];

export default function WhyUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-dark-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <span className="gold-line" />
              <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">Why Choose Us</span>
            </div>
            <h2 className="section-title mb-6">The Centuries Difference</h2>
            <p className="text-warm-500 text-sm leading-relaxed font-sans max-w-md">
              We're not just contractors — we're partners in building your vision. Every project, no matter the scale, receives our full attention and commitment to excellence.
            </p>
            <div className="mt-10 h-px bg-dark-700 w-full" />
            <div className="grid grid-cols-3 gap-px bg-dark-700 mt-px">
              {[['12+', 'Years'], ['17+', 'Projects'], ['98%', 'Satisfaction']].map(([n, l]) => (
                <div key={l} className="bg-dark-800 py-6 text-center">
                  <div className="font-serif font-light text-2xl text-gold-400 mb-1">{n}</div>
                  <div className="text-warm-600 text-xs tracking-widest uppercase font-sans">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right grid */}
          <div ref={ref} className="grid grid-cols-2 gap-px bg-dark-700">
            {reasons.map((r, i) => (
              <div
                key={i}
                className={`bg-dark-800 p-6 group hover:bg-dark-900 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <r.icon className="text-gold-400 text-lg mb-4" />
                <h3 className="font-serif font-light text-warm-300 text-sm mb-2 tracking-wide">{r.title}</h3>
                <p className="text-warm-600 text-xs leading-relaxed font-sans">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
