import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const STATIC_STATS = [
  { value: 12, suffix: '+', label: 'Years of Experience' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 150, suffix: '+', label: 'Expert Team Members' },
];

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [projectCount, setProjectCount] = useState(null);

  useEffect(() => {
    fetch('/api/projects')
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
    <section ref={ref} className="bg-primary-500 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
        {allStats.map((s, i) => (
          <div key={i}>
            <div className="text-4xl sm:text-5xl font-extrabold mb-1">
              {inView ? <CountUp end={s.value} duration={2.5} separator="," suffix={s.suffix} /> : `0${s.suffix}`}
            </div>
            <div className="text-primary-100 text-sm font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
