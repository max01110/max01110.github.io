import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Mail, GraduationCap } from 'lucide-react';
import { personalInfo, bio } from '../data/content';
import { useEasterEggs } from '../easter-eggs/EasterEggs';

function parseBio(text: string) {
  return text.split('\n\n').map((paragraph, pi) => {
    const parts = paragraph.split(/(\[.*?\]\(.*?\))/g);
    return (
      <p key={pi} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 last:mb-0">
        {parts.map((part, i) => {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer">
                {match[1]}
              </a>
            );
          }
          return part;
        })}
      </p>
    );
  });
}

// Keplerian orbital elements for the satellite (head sits at one focus).
// The orbital plane is inclined toward the viewer, so the satellite sweeps
// in front of the photo on the near arc and disappears behind the head on
// the far arc. The plane precesses continuously clockwise, so every pass
// is tilted a little differently.
const ORBIT = {
  a: 112, // semi-major axis (px)
  e: 0.18, // eccentricity (speed-up at perigee)
  inclDeg: 62, // inclination of the orbital plane from the screen plane
  period: 6500, // orbital period (ms)
  precess: 38000, // time for one full clockwise revolution of the plane (ms)
};
const ORBIT_B = ORBIT.a * Math.sqrt(1 - ORBIT.e * ORBIT.e); // semi-minor axis
const COS_I = Math.cos((ORBIT.inclDeg * Math.PI) / 180);

// Easter egg: the first "x" in the name launches Rocket Jump
function SecretName({ name, onSecret }: { name: string; onSecret: () => void }) {
  const i = name.indexOf('x');
  if (i === -1) return <>{name}</>;
  return (
    <>
      {name.slice(0, i)}
      <span
        onClick={onSecret}
        className="cursor-pointer transition-colors duration-300 hover:text-cyan-500"
      >
        {name[i]}
      </span>
      {name.slice(i + 1)}
    </>
  );
}

export default function About() {
  const { trigger } = useEasterEggs();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const satRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const sat = satRef.current;
    if (!sat) return;

    const { a, e, period, precess } = ORBIT;
    const b = ORBIT_B;

    const history: { x: number; y: number; depth: number }[] = [];

    const place = (now: number) => {
      // Mean anomaly -> eccentric anomaly via Newton's method (Kepler's equation)
      const M = ((now % period) / period) * Math.PI * 2;
      let E = M;
      for (let i = 0; i < 6; i++) {
        E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      }

      // Position in the orbital plane (head at the focus)
      const xo = a * (Math.cos(E) - e);
      const yo = b * Math.sin(E);

      // Steady clockwise precession of the orbit in the screen plane
      const omega = ((now % precess) / precess) * Math.PI * 2;
      const cw = Math.cos(omega);
      const sw = Math.sin(omega);

      // Incline the plane toward the viewer, then rotate in screen space.
      // yo > 0 is the near arc (in front), yo < 0 the far arc (behind).
      const yt = yo * COS_I;
      const x = 96 + (xo * cw - yt * sw);
      const y = 96 + (xo * sw + yt * cw);
      const depth = Math.max(-1, Math.min(1, yo / b)); // 1 = nearest to viewer

      // Velocity direction -> heading, so the satellite flies "forward"
      const vxo = -a * Math.sin(E);
      const vyt = b * Math.cos(E) * COS_I;
      const angle =
        (Math.atan2(vxo * sw + vyt * cw, vxo * cw - vyt * sw) * 180) / Math.PI;

      const scale = 1 + 0.3 * depth;
      const opacity = 0.55 + 0.45 * (depth + 1) * 0.5;
      sat.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
      sat.style.opacity = String(opacity);
      sat.style.zIndex = depth > 0 ? '20' : '0';

      // Short comet-like trail (stretches at perigee, bunches at apogee)
      history.push({ x, y, depth });
      if (history.length > 30) history.shift();
      trailRef.current.forEach((ghost, i) => {
        if (!ghost) return;
        const idx = history.length - 1 - (i + 1) * 5;
        if (idx < 0) {
          ghost.style.opacity = '0';
          return;
        }
        const p = history[idx];
        ghost.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${1 - i * 0.18})`;
        ghost.style.opacity = String((0.35 - i * 0.07) * (0.5 + 0.5 * (p.depth + 1) * 0.5));
        ghost.style.zIndex = p.depth > 0 ? '20' : '0';
      });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      place(period * 0.05);
      return;
    }

    let raf = requestAnimationFrame(function loop(now) {
      place(now);
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="about" className="pt-16 pb-12" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row gap-10 items-start"
      >
        {/* Profile photo with orbital satellite */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex-shrink-0 relative mx-auto md:mx-0"
        >
          {/* Orbiting satellite + trail — disabled, keep for re-enabling */}
          {false && <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                ref={(el) => {
                  trailRef.current[i] = el;
                }}
                className="absolute top-0 left-0 w-1 h-1 rounded-full bg-cyan-400 opacity-0"
                style={{ willChange: 'transform, opacity' }}
              />
            ))}
            <div
              ref={satRef}
              className="absolute top-0 left-0"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="relative">
                {/* Soft glow */}
                <div className="absolute -inset-1 rounded-full bg-cyan-400/40 blur-[3px]" />
                {/* Solar panels (fore and aft along the velocity vector) */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[1px] w-2 h-[3px] bg-gradient-to-r from-cyan-400/30 to-cyan-300/90 rounded-[1px]" />
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-[1px] w-2 h-[3px] bg-gradient-to-l from-cyan-400/30 to-cyan-300/90 rounded-[1px]" />
                {/* Bus */}
                <div className="relative w-[7px] h-[7px] bg-cyan-300 rounded-[2px] shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                {/* Easter egg: catching the satellite launches Space Invaders */}
                <div
                  className="absolute -inset-2.5 rounded-full pointer-events-auto cursor-pointer"
                  onClick={() => trigger('invaders')}
                />
              </div>
            </div>
          </div>}

          {/* Photo */}
          <img
            src="/images/profile.png"
            alt={personalInfo.name}
            className="w-48 h-48 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xl relative z-10"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = 'none';
              t.parentElement!.insertAdjacentHTML(
                'beforeend',
                `<div class="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-xl border-2 border-slate-700 relative z-10">
                  <span class="text-4xl font-bold text-white">MM</span>
                </div>`,
              );
            }}
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex-1 min-w-0"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-5">
            <SecretName name={personalInfo.name} onSecret={() => trigger('doodle')} />
          </h1>

          {/* Bio */}
          <div className="mb-6 text-[0.95rem]">{parseBio(bio)}</div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center gap-3"
          >
            {[
              { href: `mailto:${personalInfo.email}`, icon: Mail, label: 'Email' },
              { href: personalInfo.github, icon: Github, label: 'GitHub' },
              { href: personalInfo.linkedin, icon: Linkedin, label: 'LinkedIn' },
              { href: personalInfo.googleScholar, icon: GraduationCap, label: 'Scholar' },
            ].map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target={label !== 'Email' ? '_blank' : undefined}
                rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                title={label}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-all no-underline"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
