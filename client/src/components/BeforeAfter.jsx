import { useState, useRef, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

// Pairs of before/after images — swap src values with real project photos
const PAIRS = [
  {
    label: 'Villa Interior Renovation',
    before: { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Before renovation' },
    after:  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', alt: 'After renovation' },
  },
  {
    label: 'Apartment Fit-Out',
    before: { src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80', alt: 'Before fit-out' },
    after:  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'After fit-out' },
  },
  {
    label: 'Commercial Office Remodel',
    before: { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', alt: 'Before remodel' },
    after:  { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', alt: 'After remodel' },
  },
];

function Slider({ before, after }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e) => { e.preventDefault(); setDragging(true); };
  const onMouseMove = useCallback((e) => { if (dragging) updatePos(e.clientX); }, [dragging, updatePos]);
  const onMouseUp   = useCallback(() => setDragging(false), []);
  const onTouchMove = useCallback((e) => updatePos(e.touches[0].clientX), [updatePos]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden select-none cursor-col-resize shadow-lg"
      onTouchMove={onTouchMove}
      onTouchStart={(e) => updatePos(e.touches[0].clientX)}
    >
      {/* After image (full width, underneath) */}
      <img src={after.src} alt={after.alt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before image (clipped to left side) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before.src} alt={before.alt} className="absolute inset-0 h-full object-cover" style={{ width: containerRef.current?.offsetWidth ?? '100%' }} draggable={false} />
      </div>

      {/* Divider line */}
      <div className="absolute inset-y-0 w-0.5 bg-white shadow-xl" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        {/* Handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-col-resize"
          onMouseDown={onMouseDown}
          onTouchStart={(e) => { e.stopPropagation(); setDragging(true); }}
          onTouchEnd={() => setDragging(false)}
        >
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">BEFORE</span>
      <span className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">AFTER</span>
    </div>
  );
}

export default function BeforeAfter() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 bg-gray-900">
      <div ref={ref} className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest">Transformations</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Before &amp; After</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">Drag the slider to reveal the transformation. See what Centuries Contracting delivers.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {PAIRS.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${active === i ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <Slider key={active} before={PAIRS[active].before} after={PAIRS[active].after} />

        <p className="text-center text-gray-500 text-xs mt-4">← Drag the handle to compare →</p>
      </div>
    </section>
  );
}
