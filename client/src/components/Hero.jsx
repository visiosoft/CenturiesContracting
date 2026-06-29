import { useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaStar } from 'react-icons/fa';
import LeadForm from './LeadForm';

export default function Hero() {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background video + overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
      >
        <source src="/projects/Arabian%20Ranches/1st%20Reel.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 hero-gradient" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Copy */}
        <div className="text-white animate-fadeInUp">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <FaStar className="text-yellow-400 text-xs" />
            <span>Trusted by 50+ clients across United Arab Emirates</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Building Your Vision <br />
            <span className="text-primary-300">For Centuries</span>
          </h1>

          <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
            Premium contracting services with unmatched craftsmanship. From commercial builds to residential renovations — we deliver on time, on budget, every time.
          </p>

          <ul className="space-y-2 mb-8">
            {['Licensed & Fully Insured', 'Free Estimates', '10-Year Workmanship Warranty', '500+ Projects Completed'].map(item => (
              <li key={item} className="flex items-center gap-2 text-white/90 text-sm">
                <FaCheckCircle className="text-primary-300 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => scrollTo('#contact')} className="btn-primary bg-white text-primary-600 hover:bg-primary-50 shadow-xl">
              Get Free Quote <FaArrowRight className="text-xs" />
            </button>
            <button onClick={() => scrollTo('#projects')} className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              View Our Work
            </button>
          </div>
        </div>

        {/* Right: Lead form */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <LeadForm compact />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 text-xs">
        <span>Scroll to explore</span>
        <div className="w-5 h-8 border border-white/40 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
