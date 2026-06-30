import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { FaArrowRight } from 'react-icons/fa';

const CATEGORIES = ['All', 'Villa', 'Apartment', 'Tower', 'Commercial', 'Landscape'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetch('/projects.json')
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);
  const visible = filtered.slice(0, 6);

  return (
    <section id="projects" className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="gold-line" />
              <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">Our Portfolio</span>
            </div>
            <h2 className="section-title">Projects That Speak<br />for Themselves</h2>
          </div>
          <Link to="/gallery" className="btn-outline self-start lg:self-auto whitespace-nowrap">
            View Full Gallery <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-5 py-2 text-xs tracking-widest uppercase font-sans transition-all duration-200 ${
                active === c
                  ? 'bg-gold-400 text-dark-900'
                  : 'border border-dark-600 text-warm-500 hover:border-gold-400 hover:text-gold-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-dark-600 border-t-gold-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-dark-700">
            {visible.map((p, i) => (
              <Link
                to="/gallery"
                key={p.id}
                className={`group bg-dark-900 overflow-hidden block transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative overflow-hidden h-56 bg-dark-800">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-warm-600 text-xs">No image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 border border-gold-400 text-gold-400 text-xs px-2 py-0.5 tracking-widest uppercase font-sans">{p.category}</span>
                </div>
                <div className="p-5 border-b border-dark-700 group-hover:border-gold-400 transition-colors duration-300">
                  <h3 className="font-serif font-light text-warm-300 tracking-wide mb-1">{p.title}</h3>
                  <p className="text-warm-600 text-xs font-sans tracking-wide">{p.images?.length || 0} photos{p.videos?.length > 0 ? ` · ${p.videos.length} videos` : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filtered.length > 6 && (
          <p className="text-warm-600 text-xs text-center mt-6 tracking-widest font-sans">{filtered.length - 6} more projects in gallery</p>
        )}
      </div>
    </section>
  );
}
