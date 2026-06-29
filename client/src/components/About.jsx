import { useState, useEffect } from 'react';
import { FaCheckCircle, FaAward, FaUsers, FaLeaf } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const values = [
  { icon: FaAward, title: 'Award-Winning Quality', desc: 'Recognized by industry bodies for excellence in construction.' },
  { icon: FaUsers, title: 'Expert Team', desc: '150+ skilled professionals dedicated to your project\'s success.' },
  { icon: FaLeaf, title: 'Sustainable Practices', desc: 'Green building methods that are good for the planet and your wallet.' },
];

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/projects.json')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        // Pick thumbnails from 4 different projects spread across the list
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

  // Fallback Unsplash images until API loads
  const displayImages = images.length === 4 ? images : [
    { src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80', alt: 'construction' },
    { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80', alt: 'building' },
    { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', alt: 'team' },
    { src: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=600&q=80', alt: 'renovation' },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        {/* Image grid */}
        <div className={`relative transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="grid grid-cols-2 gap-3">
            {displayImages.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={`rounded-2xl object-cover h-48 sm:h-60 w-full${i % 2 === 1 ? ' mt-8' : ''}`}
              />
            ))}
          </div>
          {/* Badge */}
          <div className="absolute -bottom-4 -right-4 bg-primary-500 text-white rounded-2xl p-4 shadow-xl text-center">
            <div className="text-3xl font-extrabold">12+</div>
            <div className="text-xs text-primary-100 font-medium">Years of Excellence</div>
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">About Us</span>
          <h2 className="section-title mt-2">We Build More Than Structures — We Build Legacies</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            Founded over a decade ago, Centuries Contracting has grown into one of Dubai's most trusted fit-out and contracting companies. Our commitment to quality craftsmanship, transparent communication, and client-first service has earned us hundreds of 5-star reviews and repeat clients who come back for every project.
          </p>

          <ul className="space-y-3 mb-8">
            {['Licensed and fully insured in UAE', 'On-time and on-budget delivery — guaranteed', 'Dedicated project manager for every job', 'Post-completion support and warranty'].map(item => (
              <li key={item} className="flex items-center gap-3 text-gray-700 text-sm">
                <FaCheckCircle className="text-primary-500 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            {values.map((v, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <v.icon className="text-sm" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{v.title}</h4>
                <p className="text-gray-500 text-xs">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
