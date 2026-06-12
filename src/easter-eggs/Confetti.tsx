import { useEffect, useRef } from 'react';

const COLORS = ['#22d3ee', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#67e8f9'];
const GRAVITY = 0.16;
const DRAG = 0.992;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  circle: boolean;
  wobble: number;
  born: number;
  life: number;
}

/** Full-screen celebratory confetti overlay. Mount it to fire, unmount to clean up. */
export default function Confetti({ duration = 6000 }: { duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const parts: Particle[] = [];
    const start = performance.now();

    const burst = (
      cx: number,
      cy: number,
      count: number,
      baseAngle: number,
      spread: number,
      power: number,
    ) => {
      const now = performance.now();
      for (let i = 0; i < count; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const speed = power * (0.45 + Math.random() * 0.75);
        parts.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.32,
          w: 5 + Math.random() * 5,
          h: 8 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          circle: Math.random() < 0.25,
          wobble: Math.random() * Math.PI * 2,
          born: now,
          life: 2800 + Math.random() * 1800,
        });
      }
    };

    // two side cannons firing inward/upward, then a center pop
    const w = () => window.innerWidth;
    const h = () => window.innerHeight;
    burst(-10, h() * 0.75, 80, -Math.PI / 3, 0.8, 15);
    burst(w() + 10, h() * 0.75, 80, (-2 * Math.PI) / 3, 0.8, 15);
    const popTimer = window.setTimeout(
      () => burst(w() / 2, h() * 0.35, 70, -Math.PI / 2, Math.PI * 2, 8),
      300,
    );

    let raf = 0;
    const loop = (now: number) => {
      ctx.clearRect(0, 0, w(), h());

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        const age = now - p.born;
        if (age > p.life || p.y > h() + 30) {
          parts.splice(i, 1);
          continue;
        }
        p.vy += GRAVITY;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.wobble += 0.12;
        p.x += p.vx + Math.sin(p.wobble) * 0.8;
        p.y += p.vy;
        p.rot += p.vr;

        const alpha = age > p.life - 600 ? (p.life - age) / 600 : 1;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = p.color;
        if (p.circle) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          // squash with the wobble so flakes appear to tumble in 3D
          ctx.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(p.wobble)));
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;

      if (parts.length > 0 || now - start < duration) {
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(popTimer);
      window.removeEventListener('resize', resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[130] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden="true"
    />
  );
}
