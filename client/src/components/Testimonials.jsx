import { useState } from 'react';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    name: 'Mohammed Al Rashid',
    role: 'Villa Owner, Arabian Ranches',
    rating: 5,
    text: "Centuries delivered our villa fit-out beyond every expectation. The attention to detail, quality of materials, and professionalism of the team were outstanding. Truly a luxury experience.",
  },
  {
    name: 'Sarah Al Mansouri',
    role: 'Property Developer, Dubai',
    rating: 5,
    text: "I've worked with many contractors in Dubai. Centuries is hands-down the best — quality craftsmanship, transparent pricing, and they never cut corners. My go-to for every project.",
  },
  {
    name: 'Ahmed Hassan',
    role: 'Business Owner, JBR',
    rating: 5,
    text: "Our office fit-out was completed on time and exactly on budget. The team communicated every step clearly. We've already commissioned them for our second location.",
  },
  {
    name: 'Fatima Al Zahra',
    role: 'Homeowner, Dubai Hills',
    rating: 5,
    text: "The interior design and build team transformed our apartment into something from a magazine. Exceptional taste, premium materials, and a seamless process start to finish.",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const prev = () => setIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx(i => (i + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="gold-line" />
          <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">Testimonials</span>
        </div>
        <h2 className="section-title mb-16">What Our Clients Say</h2>

        {/* Desktop grid */}
        <div ref={ref} className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-dark-700">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-dark-900 p-7 hover:bg-dark-800 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <FaQuoteLeft className="text-gold-400 opacity-40 text-xl mb-5" />
              <p className="text-warm-500 text-xs leading-relaxed mb-6 font-sans">"{t.text}"</p>
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-gold-400 text-xs" />)}
              </div>
              <div className="border-t border-dark-700 pt-4">
                <p className="font-serif font-light text-warm-300 text-sm tracking-wide">{t.name}</p>
                <p className="text-warm-600 text-xs font-sans mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="bg-dark-800 border border-dark-700 p-8">
            <FaQuoteLeft className="text-gold-400 opacity-40 text-xl mb-5" />
            <p className="text-warm-500 text-sm leading-relaxed mb-6 font-sans">"{testimonials[idx].text}"</p>
            <div className="flex gap-0.5 mb-5">
              {[...Array(testimonials[idx].rating)].map((_, j) => <FaStar key={j} className="text-gold-400 text-xs" />)}
            </div>
            <div className="border-t border-dark-700 pt-4">
              <p className="font-serif font-light text-warm-300 tracking-wide">{testimonials[idx].name}</p>
              <p className="text-warm-600 text-xs font-sans mt-0.5">{testimonials[idx].role}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-5">
            <button onClick={prev} className="w-10 h-10 border border-dark-600 hover:border-gold-400 flex items-center justify-center text-warm-400 hover:text-gold-400 transition-colors">
              <FaChevronLeft className="text-sm" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`h-px transition-all ${i === idx ? 'w-8 bg-gold-400' : 'w-3 bg-dark-600'}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 border border-dark-600 hover:border-gold-400 flex items-center justify-center text-warm-400 hover:text-gold-400 transition-colors">
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
