import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const STATIC_STATS = [
  { value: 12, suffix: '+', label: 'Years of Excellence' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 50, suffix: '+', label: 'Trusted Clients' },
];

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [projectCount, setProjectCount] = useState(null);

  useEffect(() => {
    fetch('/projects.json')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setProjectCount(data.length))
      .catch(() => {});
  }, []);

  const allStats = [
    STATIC_STATS[0],
    { value: projectCount ?? 17, suffix: '+', label: 'Projects Completed' },
    ...STATIC_STATS.slice(1),
  ];

  return (
    <section ref={ref} className="bg-dark-800 border-y border-dark-700 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {allStats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl sm:text-5xl font-serif font-light text-gold-400 mb-2 leading-none">
                {inView ? <CountUp end={s.value} duration={2.5} separator="," suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <div className="gold-line mx-auto mb-3" />
              <div className="text-warm-500 text-xs tracking-widest uppercase font-sans">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
