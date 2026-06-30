import { FaArrowRight } from 'react-icons/fa';
import LeadForm from './LeadForm';

export default function Hero() {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative min-h-screen bg-dark-900 overflow-hidden flex items-center">

      {/* Top gold bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gold-400 opacity-60 z-10" />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 60px,#c4a06a 60px,#c4a06a 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#c4a06a 60px,#c4a06a 61px)' }} />

      {/* Right decorative block */}
      <div className="absolute top-20 right-0 w-[40%] bottom-20 bg-dark-600 opacity-50 hidden lg:block"
        style={{ clipPath: 'polygon(10% 0,100% 0,100% 100%,0% 100%)' }} />
      <div className="absolute top-20 right-0 w-[40%] bottom-20 hidden lg:block"
        style={{ clipPath: 'polygon(10% 0,100% 0,100% 100%,0% 100%)', border: '1px solid rgba(196,160,106,0.15)' }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-24 grid lg:grid-cols-2 gap-16 items-center w-full z-10">

        {/* Left: Copy */}
        <div className="animate-fadeInUp">

          {/* Overline */}
          <div className="flex items-center gap-4 mb-8">
            <span className="gold-line" />
            <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">Design · Build · Dubai</span>
          </div>

          {/* Main heading */}
          <h1 className="font-serif font-light text-6xl sm:text-7xl lg:text-8xl text-warm-300 tracking-[0.15em] leading-none mb-3">
            CENTURIES
          </h1>
          <div className="flex items-center gap-4 mb-10">
            <span className="text-gold-400 font-serif font-light text-lg sm:text-xl tracking-[0.5em] uppercase">Construction</span>
          </div>

          <p className="text-warm-500 text-sm leading-relaxed mb-10 max-w-md font-sans">
            Premium fit-out and contracting across Dubai. Luxury villas, commercial spaces, bespoke interiors — delivered on time, on budget, with uncompromising quality.
          </p>

          <ul className="space-y-3 mb-10">
            {[
              'Licensed & Insured in UAE',
              'Free Estimates — No Obligation',
              '12+ Years of Excellence in Dubai',
              'Trusted by 50+ Clients',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-warm-400 text-xs font-sans tracking-widest uppercase">
                <span className="w-1 h-1 bg-gold-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollTo('#contact')} className="btn-primary">
              Get Free Quote <FaArrowRight className="text-xs" />
            </button>
            <button onClick={() => scrollTo('#projects')} className="btn-outline">
              View Our Work
            </button>
          </div>
        </div>

        {/* Right: Lead form */}
        <div className="animate-fadeInUp z-10" style={{ animationDelay: '0.2s' }}>
          <LeadForm compact />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gold-400 opacity-20" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-warm-600 text-xs tracking-widest uppercase font-sans">
        <span>Scroll</span>
        <div className="w-px h-8 bg-gold-400 opacity-40 animate-pulse" />
      </div>
    </section>
  );
}
