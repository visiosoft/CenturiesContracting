import { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaVolumeMute, FaVolumeUp, FaExpand } from 'react-icons/fa';

const REELS = [
  {
    src: '/projects/Arabian%20Ranches/1st%20Reel.mp4',
    label: 'Arabian Ranches',
    sub: 'Villa Fit-Out',
  },
  {
    src: 'https://res.cloudinary.com/dpfywvykx/video/upload/v1782699640/2nd_Reel_SHORT_mj1wwo.mp4',
    label: 'Interior Design',
    sub: 'Living Spaces',
  },
  {
    src: 'https://res.cloudinary.com/dpfywvykx/video/upload/v1782699654/3rd_Reel_SHORT_aydisf.mp4',
    label: 'Finishing Works',
    sub: 'Detail & Craft',
  },
];

function ReelCard({ reel, muted, onToggleSound, index }) {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: false });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  };

  return (
    <div
      ref={ref}
      className="relative rounded-2xl overflow-hidden bg-black group"
      style={{ aspectRatio: '9/16' }}
    >
      <video
        ref={videoRef}
        src={reel.src}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Label */}
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-white font-bold text-base leading-tight">{reel.label}</p>
        <p className="text-gray-300 text-xs mt-0.5">{reel.sub}</p>
      </div>

      {/* Controls — show on hover */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onToggleSound}
          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <FaVolumeMute className="text-xs" /> : <FaVolumeUp className="text-xs" />}
        </button>
        <button
          onClick={handleFullscreen}
          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          title="Fullscreen"
        >
          <FaExpand className="text-xs" />
        </button>
      </div>

      {/* Reel number badge */}
      <div className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
        {index + 1}
      </div>
    </div>
  );
}

export default function Showreel() {
  const [muted, setMuted] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 bg-gray-950">
      <div ref={ref} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest">In Motion</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Our Work, Brought to Life</h2>
          <p className="text-gray-400 mt-3 text-sm max-w-lg mx-auto">Cinematic reels showcasing the craftsmanship and attention to detail behind every Centuries project.</p>

          {/* Sound toggle */}
          <button
            onClick={() => setMuted(m => !m)}
            className="mt-5 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors border border-white/20"
          >
            {muted ? <><FaVolumeMute /> Sound off — tap to unmute</> : <><FaVolumeUp /> Sound on</>}
          </button>
        </div>

        {/* Reels grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {REELS.map((reel, i) => (
            <ReelCard
              key={i}
              reel={reel}
              index={i}
              muted={muted}
              onToggleSound={() => setMuted(m => !m)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
