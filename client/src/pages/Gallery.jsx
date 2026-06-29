import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaExpand, FaTimes, FaChevronLeft, FaChevronRight,
  FaArrowRight, FaPlay, FaImages, FaVideo, FaSpinner,
} from 'react-icons/fa';
import { apiUrl } from '../lib/api';

const CATEGORIES = ['All', 'Villa', 'Apartment', 'Tower', 'Commercial', 'Landscape'];

const CATEGORY_COLORS = {
  Villa: 'bg-green-500',
  Apartment: 'bg-blue-500',
  Tower: 'bg-purple-500',
  Commercial: 'bg-orange-500',
  Landscape: 'bg-teal-500',
  Other: 'bg-gray-500',
};

function isVideo(url) {
  return /\.(mp4|mov|webm)$/i.test(url);
}

export default function Gallery() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null); // { project, idx }
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    fetch('/projects.json')
      .then(r => { if (!r.ok) throw new Error('Failed to load projects'); return r.json(); })
      .then(data => { setProjects(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  // Lightbox helpers
  const openLightbox = (project, idx = 0) => {
    setLightbox({ project, idx });
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = '';
  }, []);
  const lbPrev = useCallback(() =>
    setLightbox(l => {
      const total = l.project.images.length + l.project.videos.length;
      return { ...l, idx: (l.idx - 1 + total) % total };
    }), []);
  const lbNext = useCallback(() =>
    setLightbox(l => {
      const total = l.project.images.length + l.project.videos.length;
      return { ...l, idx: (l.idx + 1) % total };
    }), []);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') lbPrev();
      if (e.key === 'ArrowRight') lbNext();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, lbPrev, lbNext, closeLightbox]);

  const openProject = (project) => {
    setActiveProject(project);
    document.body.style.overflow = 'hidden';
  };
  const closeProject = () => {
    setActiveProject(null);
    document.body.style.overflow = '';
  };

  // Category counts
  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-primary-500 py-14 text-white text-center px-4">
        <span className="text-primary-200 font-semibold text-sm uppercase tracking-widest">Our Portfolio</span>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-3">Completed Projects</h1>
        <p className="text-primary-100 text-lg max-w-xl mx-auto">
          Real craftsmanship across Dubai's most prestigious addresses — villas, apartments, towers, and beyond.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.filter(c => counts[c] > 0).map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === c
                  ? 'bg-primary-500 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
                }`}
            >
              {c}
              <span className="ml-1.5 text-xs opacity-60">({counts[c]})</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
            <FaSpinner className="text-4xl animate-spin text-primary-400" />
            <p className="text-sm">Loading projects…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16 text-red-500">
            <p>{error}</p>
            <p className="text-sm text-gray-400 mt-1">Make sure the server is running on port 5000.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <FaImages className="text-5xl mx-auto mb-3 opacity-30" />
                <p>No projects in this category yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={() => openProject(project)}
                    onLightbox={(idx) => openLightbox(project, idx)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        {!loading && !error && (
          <div className="mt-16 bg-primary-500 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-3">Ready to Start Your Project?</h2>
            <p className="text-primary-100 mb-6 max-w-md mx-auto">
              Join our growing list of satisfied clients across Dubai. Get your free quote today.
            </p>
            <Link to="/quote" className="btn-primary bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 text-base">
              Get Free Quote <FaArrowRight className="text-xs" />
            </Link>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (() => {
        const media = [...lightbox.project.images, ...lightbox.project.videos];
        const src = media[lightbox.idx];
        const vid = isVideo(src);
        const total = media.length;
        // windowed thumbnails: ±10 around current
        const winStart = Math.max(0, lightbox.idx - 10);
        const winEnd = Math.min(total, lightbox.idx + 11);
        const thumbs = media.slice(winStart, winEnd);

        return (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10"
              onClick={closeLightbox}
            >
              <FaTimes />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10">
              {lightbox.project.title} &nbsp;·&nbsp; {lightbox.idx + 1} / {total}
            </div>

            {/* Prev */}
            <button
              className="absolute left-3 sm:left-6 text-white/70 hover:text-white text-3xl z-10 p-2"
              onClick={e => { e.stopPropagation(); lbPrev(); }}
            >
              <FaChevronLeft />
            </button>

            {/* Main media */}
            <div className="flex-1 flex items-center justify-center w-full px-14 py-4" onClick={e => e.stopPropagation()}>
              {vid ? (
                <video
                  key={src}
                  src={src}
                  controls
                  autoPlay
                  className="max-h-[72vh] max-w-full rounded-xl bg-black shadow-2xl"
                />
              ) : (
                <img
                  key={src}
                  src={src}
                  alt={lightbox.project.title}
                  loading="lazy"
                  className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>

            {/* Next */}
            <button
              className="absolute right-3 sm:right-6 text-white/70 hover:text-white text-3xl z-10 p-2"
              onClick={e => { e.stopPropagation(); lbNext(); }}
            >
              <FaChevronRight />
            </button>

            {/* Thumbnail strip */}
            {total > 1 && (
              <div
                className="flex gap-2 px-4 pb-4 overflow-x-auto max-w-full"
                onClick={e => e.stopPropagation()}
              >
                {thumbs.map((m, i) => {
                  const realIdx = winStart + i;
                  const active = realIdx === lightbox.idx;
                  return (
                    <button
                      key={realIdx}
                      onClick={() => setLightbox(l => ({ ...l, idx: realIdx }))}
                      className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${active ? 'border-primary-400 scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                    >
                      {isVideo(m) ? (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <FaPlay className="text-white text-xs" />
                        </div>
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

      {/* ── Project Detail Modal ── */}
      {activeProject && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeProject}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Hero image */}
            <div className="relative h-64 rounded-t-2xl overflow-hidden">
              {activeProject.thumbnail ? (
                <img
                  src={activeProject.thumbnail}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <FaImages className="text-5xl" />
                </div>
              )}
              <button
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/80"
                onClick={closeProject}
              >
                <FaTimes />
              </button>
              <span className={`absolute top-4 left-4 text-white text-xs px-3 py-1 rounded-full font-medium ${CATEGORY_COLORS[activeProject.category] || 'bg-gray-500'}`}>
                {activeProject.category}
              </span>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{activeProject.title}</h2>

              {/* Stats */}
              <div className="flex gap-4 mb-5">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
                  <FaImages className="text-primary-500" />
                  <span className="text-sm font-semibold text-gray-800">{activeProject.images.length}</span>
                  <span className="text-xs text-gray-400">Photos</span>
                </div>
                {activeProject.videos.length > 0 && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
                    <FaVideo className="text-primary-500" />
                    <span className="text-sm font-semibold text-gray-800">{activeProject.videos.length}</span>
                    <span className="text-xs text-gray-400">Videos</span>
                  </div>
                )}
              </div>

              {/* Preview grid — first 12 images */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {activeProject.images.slice(0, 12).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { closeProject(); openLightbox(activeProject, i); }}
                    className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity relative"
                  >
                    <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                    {/* "more" overlay on last visible if there are more */}
                    {i === 11 && activeProject.images.length > 12 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-bold">
                        +{activeProject.images.length - 12}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Videos preview */}
              {activeProject.videos.length > 0 && (
                <div className="flex gap-2 mb-5">
                  {activeProject.videos.map((vid, i) => (
                    <button
                      key={i}
                      onClick={() => { closeProject(); openLightbox(activeProject, activeProject.images.length + i); }}
                      className="w-20 h-14 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <FaPlay className="text-white" />
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => { closeProject(); openLightbox(activeProject, 0); }}
                className="btn-primary w-full justify-center"
              >
                <FaExpand className="text-sm" /> Open Full Gallery
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
  const catColor = CATEGORY_COLORS[project.category] || 'bg-gray-500';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
      {/* Thumbnail */}
      <div
        className="relative h-60 overflow-hidden cursor-pointer"
        onClick={() => onLightbox(0)}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
            <FaImages className="text-5xl" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
          <FaExpand className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full font-medium ${catColor}`}>
          {project.category}
        </span>

        {/* Media count badge */}
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <FaImages className="text-[10px]" />
          {project.images.length}
          {project.videos.length > 0 && (
            <><FaVideo className="text-[10px] ml-1" /> {project.videos.length}</>
          )}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-3 leading-tight">{project.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{total} media file{total !== 1 ? 's' : ''}</span>
          <button
            onClick={onOpen}
            className="text-primary-500 text-sm font-semibold hover:text-primary-700 flex items-center gap-1 transition-colors"
          >
            View Details <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
