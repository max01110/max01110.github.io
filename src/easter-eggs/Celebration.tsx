import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import Confetti from './Confetti';
import { personalInfo } from '../data/content';

const DURATION_MS = 8000;

/** Confetti + banner shown when the final easter egg is found. */
export default function Celebration({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, DURATION_MS);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <Confetti duration={DURATION_MS - 1500} />
      <motion.div
        initial={{ opacity: 0, y: -28, scale: 0.92 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [-28, 0, 0, -10],
          scale: [0.92, 1, 1, 0.97],
        }}
        transition={{ duration: DURATION_MS / 1000, times: [0, 0.05, 0.93, 1] }}
        style={{ x: '-50%' }}
        className="fixed top-8 left-1/2 z-[140]"
      >
        <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-r from-cyan-400 via-violet-500 to-rose-400 shadow-[0_0_40px_rgba(6,182,212,0.35)]">
          <div className="flex items-center gap-4 rounded-2xl bg-white/95 dark:bg-navy-900/95 backdrop-blur px-5 py-4">
            <motion.div
              className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15"
              animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
              transition={{ duration: 1.1, delay: 0.3 }}
            >
              <PartyPopper className="w-7 h-7 text-cyan-500" />
            </motion.div>
            <div className="pr-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Three for three!
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Impressive!{' '}
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  We should chat.
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
