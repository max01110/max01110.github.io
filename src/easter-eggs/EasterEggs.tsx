import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ComponentType, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gamepad2, X } from 'lucide-react';
import DoodleJump from './games/DoodleJump';
import SpaceInvaders from './games/SpaceInvaders';
import Snake from './games/Snake';
import Celebration from './Celebration';

export type EggId = 'doodle' | 'invaders' | 'snake';

const TOTAL = 3;
const STORAGE_KEY = 'portfolio-easter-eggs-found';
const EGG_ORDER: EggId[] = ['doodle', 'invaders', 'snake'];

const GAMES: Record<EggId, { title: string; controls: string; Game: ComponentType }> = {
  doodle: {
    title: 'Rocket Jump',
    controls: '← → or A/D to move · Space or tap to start',
    Game: DoodleJump,
  },
  invaders: {
    title: 'Space Invaders',
    controls: '← → to move · Space to shoot · or drag + tap',
    Game: SpaceInvaders,
  },
  snake: {
    title: 'Snake',
    controls: 'Arrow keys or WASD · or swipe',
    Game: Snake,
  },
};

interface EasterEggApi {
  found: EggId[];
  trigger: (id: EggId) => void;
}

const EasterEggContext = createContext<EasterEggApi | null>(null);

export function useEasterEggs(): EasterEggApi {
  const ctx = useContext(EasterEggContext);
  if (!ctx) throw new Error('useEasterEggs must be used inside <EasterEggProvider>');
  return ctx;
}

function loadFound(): EggId[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(raw)) return raw.filter((id): id is EggId => id in GAMES);
  } catch {
    /* corrupted storage -> start fresh */
  }
  return [];
}

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [found, setFound] = useState<EggId[]>(loadFound);
  const [active, setActive] = useState<EggId | null>(null);
  const [toast, setToast] = useState<number | null>(null); // number of eggs found so far
  const [celebrating, setCelebrating] = useState(false);
  const foundRef = useRef(found);
  foundRef.current = found;
  const toastTimer = useRef<number>();

  const trigger = useCallback((id: EggId) => {
    setActive(id);
    if (!foundRef.current.includes(id)) {
      const next = [...foundRef.current, id];
      setFound(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* private browsing etc. */
      }
      if (next.length === TOTAL) {
        // final egg: confetti celebration instead of the regular toast
        setCelebrating(true);
      } else {
        setToast(next.length);
        window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(null), 5500);
      }
    }
  }, []);

  const close = useCallback(() => setActive(null), []);
  const endCelebration = useCallback(() => setCelebrating(false), []);

  // Esc closes the game, and the page doesn't scroll behind the modal
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const game = active ? GAMES[active] : null;

  return (
    <EasterEggContext.Provider value={{ found, trigger }}>
      {children}

      {/* Game modal */}
      <AnimatePresence>
        {active && game && (
          <motion.div
            key="egg-modal"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-slate-900/50 dark:bg-navy-950/80 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-[420px] rounded-2xl border border-cyan-500/30 bg-white dark:bg-navy-900 p-4 shadow-2xl shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-cyan-500" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                    {game.title}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {/* Progress dots — one per egg, filled if found */}
                  <div className="flex items-center gap-1.5" title={`${found.length} of ${TOTAL} found`}>
                    {EGG_ORDER.map((id) => {
                      const isCurrent = id === active;
                      const isFound = found.includes(id);
                      return (
                        <span
                          key={id}
                          className={[
                            'block w-1.5 h-1.5 rounded-full transition-all',
                            isFound
                              ? isCurrent
                                ? 'bg-cyan-400 scale-125'
                                : 'bg-cyan-500/70'
                              : 'bg-slate-300 dark:bg-slate-700',
                          ].join(' ')}
                        />
                      );
                    })}
                  </div>
                  <button
                    onClick={close}
                    aria-label="Close game"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <game.Game />

              <p className="mt-3 text-center text-[11px] font-mono text-slate-400 dark:text-slate-500">
                {game.controls} · Esc to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Easter egg found" toast */}
      <AnimatePresence>
        {toast !== null && (
          <motion.div
            key="egg-toast"
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ x: '-50%' }}
            className="fixed top-6 left-1/2 z-[120]"
          >
            <div className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-white/95 dark:bg-navy-900/95 backdrop-blur px-4 py-3 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Gamepad2 className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="pr-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Hidden game unlocked
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {toast} of {TOTAL} found
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti celebration when all eggs are found */}
      {celebrating && <Celebration onDone={endCelebration} />}
    </EasterEggContext.Provider>
  );
}
