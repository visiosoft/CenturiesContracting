import { useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaStar } from 'react-icons/fa';
import LeadForm from './LeadForm';

export default function Hero() {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-cream-100">

      {/* Subtle cream texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cream-200 via-cream-100 to-cream-50 opacity-60" />

      {/* Decorative teal shape top-right */}
      <div className="absolute top-0 right-0 w-[45%] h-full bg-primary-500 clip-hero hidden lg:block" />
      <style>{`.clip-hero { clip-path: polygon(18% 0, 100% 0, 100% 100%, 0% 100%); }`}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 grid lg:grid-cols-2 gap-12 items-center w-full">

        {/* Left: Copy */}
        <div className="animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-gold-300 rounded-full px-4 py-1.5 text-sm mb-8 shadow-sm">
            <FaStar className="text-gold-400 text-xs" />
            <span className="text-primary-500 font-medium">Trusted by 50+ clients across United Arab Emirates</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-500 leading-tight mb-2">
            Building Your<br />Vision
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-0.5 bg-gold-400" />
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold italic text-gold-400 leading-tight">
              For Centuries
            </h1>
          </div>

          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed font-sans">
            Premium fit-out and contracting services across Dubai. From luxury villa interiors to commercial spaces — we deliver on time, on budget, every time.
          </p>

          <ul className="space-y-2 mb-8">
            {[
              'Licensed & Fully Insured in UAE',
              'Free Estimates, No Obligation',
              'Quality Workmanship Guaranteed',
              '17+ Projects Completed in Dubai',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-primary-500 text-sm font-medium">
                <FaCheckCircle className="text-primary-500 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-primary-400 text-xs">
        <span>Scroll to explore</span>
        <div className="w-5 h-8 border border-primary-300 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-primary-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
