import { FaBuilding, FaHome, FaHardHat, FaDraftingCompass, FaTools, FaPaintRoller } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const services = [
  { icon: FaHome,           title: 'Villa Fit-Out',           desc: 'Luxury villa interiors from concept to completion — bespoke finishes, premium materials, flawless execution.' },
  { icon: FaBuilding,       title: 'Apartment Fit-Out',       desc: 'Transform any apartment into a refined living space with our expert fit-out and interior solutions.' },
  { icon: FaDraftingCompass,title: 'Interior Design & Build', desc: 'Integrated design and construction under one roof — one team, one vision, zero compromise.' },
  { icon: FaHardHat,        title: 'Commercial Fit-Out',      desc: 'Office, retail, and hospitality spaces built to impress clients and inspire teams.' },
  { icon: FaTools,          title: 'Renovation & Remodeling', desc: 'Breathing new life into existing spaces — full gut renovations and targeted upgrades alike.' },
  { icon: FaPaintRoller,    title: 'Joinery & Finishing',     desc: 'Custom woodwork, flooring, tiling, painting — the craftsmanship details that define luxury.' },
];

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="services" className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="gold-line" />
            <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">What We Do</span>
          </div>
          <h2 className="section-title max-w-xl">Comprehensive Fit-Out Services</h2>
          <p className="text-warm-500 text-sm mt-4 max-w-lg font-sans leading-relaxed">
            From groundbreaking to final handover, we manage every phase of your project with precision and care.
          </p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-dark-700">
          {services.map((s, i) => (
            <div
              key={i}
              className={`bg-dark-900 p-8 group hover:bg-dark-800 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 border border-gold-400 flex items-center justify-center mb-6 group-hover:bg-gold-400 transition-colors duration-300">
                <s.icon className="text-gold-400 group-hover:text-dark-900 text-sm transition-colors duration-300" />
              </div>
              <h3 className="font-serif font-light text-lg text-warm-300 mb-3 tracking-wide">{s.title}</h3>
              <p className="text-warm-600 text-xs leading-relaxed font-sans">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
