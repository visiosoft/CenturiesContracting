import { useState } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    name: 'Michael Carter',
    role: 'CEO, Carter Industries',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: "Centuries Contracting transformed our aging headquarters into a state-of-the-art facility. They finished two weeks ahead of schedule and under budget. I couldn't be more impressed.",
  },
  {
    name: 'Sarah Johnson',
    role: 'Homeowner, Greenwich CT',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: "Our kitchen and master suite renovation exceeded every expectation. The team was professional, clean, and communicative throughout. This is a company that truly cares.",
  },
  {
    name: 'David Park',
    role: 'Property Developer',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    rating: 5,
    text: "I've worked with many contractors over the years. Centuries is hands-down the best — quality craftsmanship, transparent pricing, and they never cut corners. My go-to for every project.",
  },
  {
    name: 'Amanda Torres',
    role: 'Hotel General Manager',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    rating: 5,
    text: "The historic restoration of our boutique hotel was flawless. Centuries honored the original architecture while adding modern amenities our guests love. Truly exceptional work.",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const prev = () => setIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx(i => (i + 1) % testimonials.length);
  const t = testimonials[idx];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="section-title mt-2">What Our Clients Say</h2>
        </div>

        {/* Desktop: grid */}
        <div ref={ref} className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`card border border-gray-100 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <FaQuoteLeft className="text-primary-200 text-2xl mb-3" />
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-yellow-400 text-xs" />)}
              </div>
              <div className="flex items-center gap-3 mt-auto">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div className="card border border-gray-100 text-center">
            <FaQuoteLeft className="text-primary-200 text-2xl mb-4 mx-auto" />
            <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
            <div className="flex justify-center gap-0.5 mb-4">
              {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-yellow-400 text-sm" />)}
            </div>
            <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover mx-auto mb-2" />
            <p className="font-semibold text-gray-900">{t.name}</p>
            <p className="text-gray-400 text-sm">{t.role}</p>
          </div>
          <div className="flex justify-center gap-4 mt-5">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors">
              <FaChevronLeft className="text-sm" />
            </button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-primary-500 w-5' : 'bg-gray-300'}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors">
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
