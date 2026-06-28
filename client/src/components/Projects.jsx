import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const CATEGORIES = ['All', 'Villa', 'Apartment', 'Tower', 'Commercial', 'Landscape'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);
  const visible = filtered.slice(0, 6);

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Our Portfolio</span>
          <h2 className="section-title mt-2">Projects That Speak for Themselves</h2>
          <p className="section-subtitle mx-auto">Browse our completed projects across villas, apartments, towers, and commercial spaces.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${active === c ? 'bg-primary-500 text-white shadow' : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((p, i) => (
                <Link
                  to="/gallery"
                  key={p.id}
                  className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 block ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="relative overflow-hidden h-52 sm:h-56 bg-gray-200">
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute top-3 right-3 bg-primary-500 text-white text-xs px-3 py-1 rounded-full">{p.category}</span>
                    {(p.images?.length > 0 || p.videos?.length > 0) && (
                      <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {p.images?.length || 0} photos{p.videos?.length > 0 ? ` · ${p.videos.length} videos` : ''}
                      </span>
                    )}
                  </div>
                  <div className="p-5 bg-white">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{p.title}</h3>
                    <p className="text-gray-400 text-sm">{p.category} Project · Dubai</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View all button */}
            <div className="text-center mt-10">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                View Full Portfolio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {filtered.length > 6 && (
                <p className="text-gray-400 text-sm mt-3">{filtered.length - 6} more projects in gallery</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
