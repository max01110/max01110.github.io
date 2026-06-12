import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { projects } from '../data/content';

const VISIBLE = projects.filter(
  (p) => p.title !== 'FINCH CubeSat Mission' && p.title !== 'Digital Image Correlation & 3D Printing'
);

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="projects" className="py-10 border-t border-slate-200 dark:border-slate-800/60" ref={ref}>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
        className="section-title"
      >
        Research Projects
      </motion.h2>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {VISIBLE.map((project, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="py-5 cursor-pointer group"
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 text-[0.95rem] leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 text-slate-300 dark:text-slate-600"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {project.lab}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                  {project.period}
                </span>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-2">
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {project.description}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">
                        {project.details}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
