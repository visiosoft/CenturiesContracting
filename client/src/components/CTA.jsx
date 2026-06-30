import { FaArrowRight, FaPhone } from 'react-icons/fa';

export default function CTA() {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-24 bg-dark-800 relative overflow-hidden">
      {/* Decorative gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gold-400 opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gold-400 opacity-20" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gold-400 opacity-10" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gold-400 opacity-10" />

      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="gold-line" />
          <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">Start Today</span>
          <span className="gold-line" />
        </div>
        <h2 className="font-serif font-light text-4xl sm:text-5xl text-warm-300 tracking-wide mb-6">
          Ready to Build Something<br />
          <span className="italic text-gold-400">Extraordinary?</span>
        </h2>
        <p className="text-warm-500 text-sm mb-10 max-w-xl mx-auto font-sans leading-relaxed">
          Get your free, no-obligation estimate today. Our team is standing by to discuss your project and bring your vision to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => scrollTo('#contact')} className="btn-primary px-10 py-4">
            Get Free Estimate <FaArrowRight className="text-xs" />
          </button>
          <a href="tel:+971567601154" className="btn-outline px-10 py-4">
            <FaPhone className="text-xs" /> Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
