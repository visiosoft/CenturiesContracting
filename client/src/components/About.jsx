import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/projects.json')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const picks = [];
        const step = Math.max(1, Math.floor(data.length / 4));
        for (let i = 0; i < 4 && i * step < data.length; i++) {
          const p = data[i * step];
          if (p.thumbnail) picks.push({ src: p.thumbnail, alt: p.title });
        }
        if (picks.length === 4) setImages(picks);
      })
      .catch(() => {});
  }, []);

  const displayImages = images.length === 4 ? images : [
    { src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80', alt: 'construction' },
    { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80', alt: 'building' },
    { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', alt: 'team' },
    { src: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=600&q=80', alt: 'renovation' },
  ];

  return (
    <section id="about" className="py-24 bg-dark-800">
      <div ref={ref} className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">

        {/* Image grid */}
        <div className={`relative transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="grid grid-cols-2 gap-2">
            {displayImages.map((img, i) => (
              <div key={i} className={`overflow-hidden ${i % 2 === 1 ? 'mt-8' : ''}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
          {/* Badge */}
          <div className="absolute -bottom-5 -right-5 bg-dark-900 border border-gold-400 p-5 text-center">
            <div className="font-serif text-3xl font-light text-gold-400 leading-none">12+</div>
            <div className="gold-line mx-auto my-2" />
            <div className="text-warm-500 text-xs tracking-widest uppercase font-sans">Years of Excellence</div>
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="flex items-center gap-4 mb-5">
            <span className="gold-line" />
            <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">About Us</span>
          </div>
          <h2 className="section-title mb-6">We Build More Than Structures</h2>
          <p className="text-warm-500 text-sm leading-relaxed mb-8 font-sans">
            Founded over a decade ago, Centuries Contracting has grown into one of Dubai's most trusted fit-out and contracting companies. Our commitment to quality craftsmanship, transparent communication, and client-first service has earned us the loyalty of clients who return project after project.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              'Licensed and fully insured in UAE',
              'On-time and on-budget delivery',
              'Dedicated project manager for every job',
              'Post-completion support and warranty',
            ].map(item => (
              <li key={item} className="flex items-center gap-4 text-warm-400 text-xs font-sans tracking-wide">
                <span className="w-4 h-px bg-gold-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-px bg-dark-700">
            {[
              { num: '17+', label: 'Projects' },
              { num: '50+', label: 'Clients' },
              { num: '12+', label: 'Years' },
            ].map((v, i) => (
              <div key={i} className="bg-dark-800 p-5 text-center">
                <div className="font-serif font-light text-2xl text-gold-400 mb-1">{v.num}</div>
                <div className="text-warm-600 text-xs tracking-widest uppercase font-sans">{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
