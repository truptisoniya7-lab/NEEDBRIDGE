import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { FileText, Users, CheckCircle2, HeartHandshake } from 'lucide-react';
import { ImpactStat } from '../types';

export const ImpactStats: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [realStats, setRealStats] = useState<ImpactStat[]>([
    { label: 'Requests posted', value: 0 },
    { label: 'Active needs', value: 0 },
    { label: 'Resolved requests', value: 0 },
    { label: 'Active volunteers', value: 0 },
  ]);
  const [displayStats, setDisplayStats] = useState<ImpactStat[]>([
    { label: 'Requests posted', value: 0 },
    { label: 'Active needs', value: 0 },
    { label: 'Resolved requests', value: 0 },
    { label: 'Active volunteers', value: 0 },
  ]);

  useEffect(() => {
    // Fetch real metrics from the database
    api
      .getImpactStats()
      .then((data) => {
        const loaded: ImpactStat[] = [
          { label: 'Requests posted', value: data.totalRequests || 0 },
          { label: 'Active needs', value: data.activeRequests || 0 },
          { label: 'Resolved requests', value: data.resolvedRequests || 0 },
          { label: 'Active volunteers', value: data.activeHelpers || 0 },
        ];
        setRealStats(loaded);
        setDisplayStats(loaded);
      })
      .catch((err) => {
        console.warn('Could not fetch impact metrics:', err);
      });
  }, []);

  // Count-up animation on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1200;
          const steps = 30;
          const stepTime = duration / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setDisplayStats(
              realStats.map((stat) => ({
                ...stat,
                value: Math.floor(stat.value * easeOut),
              }))
            );

            if (currentStep >= steps) {
              clearInterval(timer);
              setDisplayStats(realStats);
            }
          }, stepTime);
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, realStats]);

  const icons = [
    <FileText key="1" className="w-5 h-5 text-teal-700" aria-hidden="true" />,
    <HeartHandshake key="2" className="w-5 h-5 text-amber-600" aria-hidden="true" />,
    <CheckCircle2 key="3" className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
    <Users key="4" className="w-5 h-5 text-coral-600" aria-hidden="true" />,
  ];

  return (
    <section
      ref={containerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      aria-label="Community impact numbers"
    >
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          {displayStats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                idx > 0 ? 'sm:pl-8 pt-4 sm:pt-0' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-center mb-3">
                {icons[idx]}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#14201F] tracking-tight tabular-nums">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-stone-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
