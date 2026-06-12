import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { publications } from '../data/content';

export default function Publications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="publications" className="py-10 border-t border-slate-200 dark:border-slate-800/60" ref={ref}>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
        className="section-title"
      >
        Publications
      </motion.h2>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {publications.map((pub, i) => (
          <motion.article
            key={pub.id}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="py-5 flex gap-5"
          >
            {pub.thumbnail && (
              <img
                src={pub.thumbnail}
                alt=""
                className="hidden sm:block flex-shrink-0 w-16 h-16 object-cover rounded opacity-80"
              />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  [{pub.id}]
                </span>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  {pub.year}
                </span>
                {pub.award && (
                  <span className="text-[11px] text-amber-600 dark:text-amber-400">
                    ★ {pub.award}
                  </span>
                )}
              </div>

              <h3 className="font-medium text-slate-900 dark:text-slate-100 leading-snug mb-1.5 text-[0.925rem]">
                {pub.title}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-500 mb-1">
                {pub.authors.map((a, j) => (
                  <span key={j}>
                    {a.highlight
                      ? <span className="font-medium text-slate-700 dark:text-slate-300">{a.name}</span>
                      : a.name}
                    {j < pub.authors.length - 1 && ', '}
                  </span>
                ))}
              </p>

              <p className="text-sm text-slate-400 dark:text-slate-500 mb-2.5">
                <span className="italic">{pub.venue}</span>
                {pub.location && <>, {pub.location}</>}
              </p>

              <div className="flex gap-3">
                {pub.links.arxiv && (
                  <a
                    href={pub.links.arxiv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors no-underline"
                  >
                    arXiv ↗
                  </a>
                )}
                {pub.links.pdf && pub.links.pdf !== '#' && (
                  <a
                    href={pub.links.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors no-underline"
                  >
                    PDF ↗
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
