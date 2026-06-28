import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const stats = [
  { value: 25, suffix: '+', label: 'Years of Experience' },
  { value: 500, suffix: '+', label: 'Projects Completed' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 150, suffix: '+', label: 'Expert Team Members' },
];

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="bg-primary-500 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
        {stats.map((s, i) => (
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
