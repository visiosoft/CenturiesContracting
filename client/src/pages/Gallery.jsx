import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaExpand, FaTimes, FaChevronLeft, FaChevronRight,
  FaArrowRight, FaPlay, FaImages, FaSpinner,
} from 'react-icons/fa';

const CATEGORIES = ['All', 'Villa', 'Apartment', 'Tower', 'Commercial', 'Landscape'];

function isVideo(url) {
  return /\.(mp4|mov|webm)$/i.test(url);
}

export default function Gallery() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    fetch('/projects.json')
      .then(r => { if (!r.ok) throw new Error('Failed to load projects'); return r.json(); })
      .then(data => { setProjects(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const filtered = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);

  const openLightbox = (project, idx = 0) => { setLightbox({ project, idx }); document.body.style.overflow = 'hidden'; };
  const closeLightbox = useCallback(() => { setLightbox(null); document.body.style.overflow = ''; }, []);
  const lbPrev = useCallback(() => setLightbox(l => { const total = l.project.images.length + l.project.videos.length; return { ...l, idx: (l.idx - 1 + total) % total }; }), []);
  const lbNext = useCallback(() => setLightbox(l => { const total = l.project.images.length + l.project.videos.length; return { ...l, idx: (l.idx + 1) % total }; }), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'ArrowLeft') lbPrev(); if (e.key === 'ArrowRight') lbNext(); if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, lbPrev, lbNext, closeLightbox]);

  const openProject = (project) => { setActiveProject(project); document.body.style.overflow = 'hidden'; };
  const closeProject = () => { setActiveProject(null); document.body.style.overflow = ''; };

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 py-16 text-center px-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="gold-line" />
          <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">Our Portfolio</span>
          <span className="gold-line" />
        </div>
        <h1 className="font-serif font-light text-4xl sm:text-5xl text-warm-300 tracking-wide">Completed Projects</h1>
        <p className="text-warm-500 text-sm mt-3 max-w-xl mx-auto font-sans">
          Real craftsmanship across Dubai's most prestigious addresses — villas, apartments, towers, and beyond.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.filter(c => counts[c] > 0 || c === 'All').map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-5 py-2 text-xs tracking-widest uppercase font-sans transition-all duration-200 ${
                activeCategory === c ? 'bg-gold-400 text-dark-900' : 'border border-dark-600 text-warm-500 hover:border-gold-400 hover:text-gold-400'
              }`}>
              {c} <span className="ml-1 opacity-50">({counts[c] || 0})</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-warm-600 gap-4">
            <FaSpinner className="text-3xl animate-spin text-gold-400" />
            <p className="text-xs tracking-widest uppercase font-sans">Loading projects…</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-400 text-sm font-sans">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-warm-600">
                <FaImages className="text-4xl mx-auto mb-3 opacity-30" />
                <p className="text-xs tracking-widest uppercase font-sans">No projects in this category yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-dark-700">
                {filtered.map(project => (
                  <ProjectCard key={project.id} project={project} onOpen={() => openProject(project)} onLightbox={(idx) => openLightbox(project, idx)} />
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        {!loading && !error && (
          <div className="mt-16 bg-dark-800 border border-dark-700 p-10 sm:p-14 text-center">
            <div className="h-px bg-gold-400 opacity-30 mb-10" />
            <h2 className="font-serif font-light text-3xl text-warm-300 tracking-wide mb-3">Ready to Start Your Project?</h2>
            <p className="text-warm-500 text-sm mb-8 font-sans max-w-md mx-auto">
              Join our growing list of satisfied clients across Dubai. Get your free quote today.
            </p>
            <Link to="/quote" className="btn-primary px-10 py-4">
              Get Free Quote <FaArrowRight className="text-xs" />
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (() => {
        const media = [...lightbox.project.images, ...lightbox.project.videos];
        const src = media[lightbox.idx];
        const vid = isVideo(src);
        const total = media.length;
        const winStart = Math.max(0, lightbox.idx - 10);
        const winEnd = Math.min(total, lightbox.idx + 11);
        const thumbs = media.slice(winStart, winEnd);
        return (
          <div className="fixed inset-0 bg-dark-900/98 z-50 flex flex-col items-center justify-center" onClick={closeLightbox}>
            <button className="absolute top-4 right-4 text-warm-500 hover:text-gold-400 text-2xl z-10" onClick={closeLightbox}><FaTimes /></button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-warm-600 text-xs tracking-widest uppercase font-sans z-10">
              {lightbox.project.title} · {lightbox.idx + 1} / {total}
            </div>
            <button className="absolute left-3 sm:left-6 text-warm-500 hover:text-gold-400 text-2xl z-10 p-2" onClick={e => { e.stopPropagation(); lbPrev(); }}><FaChevronLeft /></button>
            <div className="flex-1 flex items-center justify-center w-full px-14 py-4" onClick={e => e.stopPropagation()}>
              {vid ? (
                <video key={src} src={src} controls autoPlay className="max-h-[72vh] max-w-full bg-black" />
              ) : (
                <img key={src} src={src} alt={lightbox.project.title} loading="lazy" className="max-h-[72vh] max-w-full object-contain" />
              )}
            </div>
            <button className="absolute right-3 sm:right-6 text-warm-500 hover:text-gold-400 text-2xl z-10 p-2" onClick={e => { e.stopPropagation(); lbNext(); }}><FaChevronRight /></button>
            {total > 1 && (
              <div className="flex gap-2 px-4 pb-4 overflow-x-auto max-w-full" onClick={e => e.stopPropagation()}>
                {thumbs.map((m, i) => {
                  const realIdx = winStart + i;
                  const active = realIdx === lightbox.idx;
                  return (
                    <button key={realIdx} onClick={() => setLightbox(l => ({ ...l, idx: realIdx }))}
                      className={`flex-shrink-0 w-14 h-10 overflow-hidden border transition-all ${active ? 'border-gold-400' : 'border-dark-700 opacity-40 hover:opacity-70'}`}>
                      {isVideo(m) ? (
                        <div className="w-full h-full bg-dark-800 flex items-center justify-center"><FaPlay className="text-gold-400 text-xs" /></div>
                      ) : (
                        <img src={m} alt="" loading="lazy" className="w-full h-full object-cover" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 bg-dark-900/90 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={closeProject}>
          <div className="bg-dark-800 border border-dark-700 max-w-2xl w-full my-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-60 overflow-hidden">
              {activeProject.thumbnail ? (
                <img src={activeProject.thumbnail} alt={activeProject.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-dark-900 flex items-center justify-center text-warm-600"><FaImages className="text-4xl" /></div>
              )}
              <button className="absolute top-3 right-3 bg-dark-900/70 text-warm-300 w-8 h-8 flex items-center justify-center hover:text-gold-400 transition-colors" onClick={closeProject}><FaTimes /></button>
              <span className="absolute top-3 left-3 border border-gold-400 text-gold-400 text-xs px-2 py-0.5 tracking-widest uppercase font-sans">{activeProject.category}</span>
            </div>
            <div className="p-6">
              <h2 className="font-serif font-light text-2xl text-warm-300 tracking-wide mb-2">{activeProject.title}</h2>
              <div className="flex gap-4 mb-5 text-xs font-sans text-warm-500">
                <span>{activeProject.images.length} photos</span>
                {activeProject.videos.length > 0 && <span>· {activeProject.videos.length} videos</span>}
              </div>
              <div className="grid grid-cols-4 gap-1 mb-5">
                {activeProject.images.slice(0, 12).map((img, i) => (
                  <button key={i} onClick={() => { closeProject(); openLightbox(activeProject, i); }} className="aspect-square overflow-hidden hover:opacity-80 transition-opacity relative">
                    <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                    {i === 11 && activeProject.images.length > 12 && (
                      <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center text-warm-300 text-xs font-sans">+{activeProject.images.length - 12}</div>
                    )}
                  </button>
                ))}
              </div>
              {activeProject.videos.length > 0 && (
                <div className="flex gap-2 mb-5">
                  {activeProject.videos.map((vid, i) => (
                    <button key={i} onClick={() => { closeProject(); openLightbox(activeProject, activeProject.images.length + i); }} className="w-20 h-14 bg-dark-900 border border-dark-600 flex items-center justify-center hover:border-gold-400 transition-colors">
                      <FaPlay className="text-gold-400 text-sm" />
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => { closeProject(); openLightbox(activeProject, 0); }} className="btn-primary w-full justify-center">
                <FaExpand className="text-xs" /> Open Full Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onOpen, onLightbox }) {
  const total = project.images.length + project.videos.length;
  return (
    <div className="bg-dark-900 overflow-hidden group hover:bg-dark-800 transition-colors duration-300">
      <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => onLightbox(0)}>
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-dark-800 flex items-center justify-center text-warm-600"><FaImages className="text-3xl" /></div>
        )}
        <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/30 transition-colors flex items-center justify-center">
          <FaExpand className="text-gold-400 text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="absolute top-3 left-3 border border-gold-400 text-gold-400 text-xs px-2 py-0.5 tracking-widest uppercase font-sans">{project.category}</span>
        <span className="absolute bottom-3 right-3 bg-dark-900/70 text-warm-400 text-xs px-2 py-1 font-sans opacity-0 group-hover:opacity-100 transition-opacity">
          {total} media
        </span>
      </div>
      <div className="p-5 border-b border-dark-700 group-hover:border-gold-400 transition-colors duration-300 cursor-pointer" onClick={onOpen}>
        <h3 className="font-serif font-light text-warm-300 tracking-wide mb-1">{project.title}</h3>
        <p className="text-warm-600 text-xs font-sans">{project.images.length} photos{project.videos.length > 0 ? ` · ${project.videos.length} videos` : ''}</p>
      </div>
    </div>
  );
}
