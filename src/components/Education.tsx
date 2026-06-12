import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { education } from '../data/content';

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="education" className="py-10 border-t border-slate-200 dark:border-slate-800/60" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, x: -15 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="section-title"
      >
        Education
      </motion.h2>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {education.map((entry, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
            className="py-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-snug">
                    {entry.degree}
                  </h3>
                  {entry.current && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
                      Current
                    </span>
                  )}
                </div>

                <p className="text-base text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
                  {entry.specialization}
                </p>

                {entry.minor && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Minor in {entry.minor}
                  </p>
                )}

                {entry.supervisor && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                    Supervised by {entry.supervisor}
                  </p>
                )}

                {entry.lab && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {entry.lab}
                  </p>
                )}


                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {entry.university}
                  {entry.department && <span className="text-slate-300 dark:text-slate-600">/</span>}
                  {entry.department && <span>{entry.department}</span>}
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  {entry.location}
                </p>
              </div>

              <div className="flex-shrink-0">
                <span className="font-mono text-xs text-slate-500 dark:text-slate-500">
                  {entry.period}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
