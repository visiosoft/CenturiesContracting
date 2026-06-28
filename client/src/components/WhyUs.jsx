import { FaShieldAlt, FaClock, FaDollarSign, FaHeadset, FaMedal, FaRecycle } from 'react-icons/fa';

const reasons = [
  { icon: FaShieldAlt, title: 'Licensed & Insured', desc: 'Fully licensed, bonded, and insured for your complete peace of mind.' },
  { icon: FaClock, title: 'On-Time Delivery', desc: 'We respect your timeline. 97% of our projects are delivered on or before deadline.' },
  { icon: FaDollarSign, title: 'Transparent Pricing', desc: 'No hidden fees. You get a detailed, itemized quote before work begins.' },
  { icon: FaHeadset, title: 'Dedicated Support', desc: 'A project manager is assigned to you from day one and stays until handover.' },
  { icon: FaMedal, title: '10-Year Warranty', desc: 'We stand behind our work with a full 10-year workmanship warranty.' },
  { icon: FaRecycle, title: 'Eco-Friendly Methods', desc: 'We minimize waste and use sustainable materials wherever possible.' },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-primary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary-200 font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">The Centuries Difference</h2>
          <p className="text-primary-100 max-w-xl mx-auto mt-3 text-lg">
            We're not just contractors — we're partners in building your vision.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 hover:bg-white/20 transition-colors group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <r.icon className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{r.title}</h3>
              <p className="text-primary-100 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
