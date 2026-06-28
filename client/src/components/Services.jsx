import { FaBuilding, FaHome, FaHardHat, FaDraftingCompass, FaProjectDiagram, FaTools } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    icon: FaBuilding,
    title: 'Commercial Construction',
    desc: 'Office buildings, retail spaces, and commercial facilities built to the highest standards with modern techniques.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: FaHome,
    title: 'Residential Remodeling',
    desc: 'Transform your home with our expert remodeling services — kitchens, bathrooms, additions, and full renovations.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: FaHardHat,
    title: 'General Contracting',
    desc: 'End-to-end project management from permits and planning through final inspections and handover.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: FaDraftingCompass,
    title: 'Design & Build',
    desc: 'Integrated design and construction for a seamless experience — one team, one contract, zero headaches.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: FaProjectDiagram,
    title: 'Project Management',
    desc: 'Expert oversight for large-scale builds. We coordinate all trades, timelines, and budgets with precision.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: FaTools,
    title: 'Renovation & Restoration',
    desc: 'Breathing new life into existing structures — historic preservation, commercial retrofits, and full gut renovations.',
    color: 'bg-primary-50 text-primary-600',
  },
];

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">What We Do</span>
          <h2 className="section-title mt-2">Comprehensive Contracting Services</h2>
          <p className="section-subtitle mx-auto">
            From groundbreaking to ribbon-cutting, we handle every phase of your construction project with expertise and care.
          </p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className={`card group cursor-default transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <s.icon className="text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
