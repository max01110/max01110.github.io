import { useEffect, useRef } from 'react';

const W = 320;
const H = 460;
const GRAVITY = 0.32;
const JUMP_V = -9.6;
const BEST_KEY = 'egg-doodle-best';

interface Platform {
  x: number;
  y: number;
  w: number;
  moving: boolean;
  dir: number;
  speed: number;
}

export default function DoodleJump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.1 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    let mode: 'ready' | 'playing' | 'over' = 'ready';
    let player = { x: W / 2 - 13, y: H - 92, w: 26, h: 30, vx: 0, vy: 0 };
    let platforms: Platform[] = [];
    let score = 0;
    let best = Number(localStorage.getItem(BEST_KEY) || 0);
    const input = { left: false, right: false, touch: 0 };

    const newPlatform = (y: number): Platform => ({
      x: Math.random() * (W - 58),
      y,
      w: 58,
      moving: Math.random() < Math.min(0.08 + score / 6000, 0.5),
      dir: Math.random() < 0.5 ? -1 : 1,
      speed: 0.8 + Math.random() * 1.4,
    });

    const reset = () => {
      score = 0;
      player = { x: W / 2 - 13, y: H - 92, w: 26, h: 30, vx: 0, vy: JUMP_V };
      platforms = [{ x: W / 2 - 29, y: H - 52, w: 58, moving: false, dir: 1, speed: 0 }];
      for (let y = H - 110; y > -40; y -= 54) platforms.push(newPlatform(y));
    };

    const update = () => {
      const dir = (input.left ? -1 : 0) + (input.right ? 1 : 0) + input.touch;
      player.vx = Math.max(-5.5, Math.min(5.5, (player.vx + dir * 0.55) * 0.93));
      player.x += player.vx;
      // wrap around the screen edges
      if (player.x > W) player.x = -player.w;
      if (player.x < -player.w) player.x = W;

      const prevBottom = player.y + player.h;
      player.vy += GRAVITY;
      player.y += player.vy;

      // only land when falling and the feet cross the platform top this frame
      if (player.vy > 0) {
        for (const p of platforms) {
          if (
            prevBottom <= p.y + 4 &&
            player.y + player.h >= p.y &&
            player.x + player.w > p.x + 6 &&
            player.x < p.x + p.w - 6
          ) {
            player.y = p.y - player.h;
            player.vy = JUMP_V;
            break;
          }
        }
      }

      for (const p of platforms) {
        if (!p.moving) continue;
        p.x += p.dir * p.speed;
        if (p.x < 0 || p.x + p.w > W) p.dir *= -1;
      }

      // camera: keep the player below the scroll line, push the world down
      if (player.y < 200) {
        const dy = 200 - player.y;
        player.y = 200;
        score += dy;
        for (const p of platforms) p.y += dy;
      }

      platforms = platforms.filter((p) => p.y < H + 20);
      let top = Math.min(...platforms.map((p) => p.y));
      while (top > -40) {
        top -= 46 + Math.random() * 20;
        platforms.push(newPlatform(top));
      }

      if (player.y > H + 60) {
        mode = 'over';
        best = Math.max(best, Math.round(score / 10));
        localStorage.setItem(BEST_KEY, String(best));
      }
    };

    const drawBackground = (t: number) => {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(1, '#0c1430');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      for (const s of stars) {
        const tw = 0.45 + 0.45 * Math.sin(t / 900 + s.phase);
        ctx.fillStyle = `rgba(186, 230, 253, ${tw})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawPlatforms = () => {
      for (const p of platforms) {
        ctx.fillStyle = p.moving ? 'rgba(167, 139, 250, 0.95)' : 'rgba(34, 211, 238, 0.9)';
        ctx.shadowColor = p.moving ? 'rgba(167, 139, 250, 0.6)' : 'rgba(34, 211, 238, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.w, 9, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const drawPlayer = (t: number) => {
      const { x, y, w, h } = player;
      const cx = x + w / 2;
      ctx.save();
      ctx.translate(cx, y + h / 2);

      // jetpack flame while rising
      if (mode === 'playing' && player.vy < -2) {
        const flick = 6 + 4 * Math.abs(Math.sin(t / 40));
        const flame = ctx.createLinearGradient(0, h / 2, 0, h / 2 + flick);
        flame.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
        flame.addColorStop(1, 'rgba(251, 113, 22, 0)');
        ctx.fillStyle = flame;
        ctx.beginPath();
        ctx.moveTo(-5, h / 2 - 2);
        ctx.lineTo(5, h / 2 - 2);
        ctx.lineTo(0, h / 2 + flick);
        ctx.closePath();
        ctx.fill();
      }

      // body
      ctx.fillStyle = '#a5f3fc';
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 9);
      ctx.fill();
      // visor
      ctx.fillStyle = '#0e7490';
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 5, -h / 2 + 6, w - 10, 10, 5);
      ctx.fill();
      // eyes looking in the direction of travel
      const look = Math.max(-2.5, Math.min(2.5, player.vx));
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(-4.5 + look, -h / 2 + 11, 2.2, 0, Math.PI * 2);
      ctx.arc(4.5 + look, -h / 2 + 11, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawHud = () => {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.95)';
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`ALT ${Math.round(score / 10)} m`, 12, 22);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.fillText(`BEST ${best} m`, W - 12, 22);
    };

    const drawOverlay = (title: string, lines: string[]) => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#67e8f9';
      ctx.font = '700 22px "JetBrains Mono", monospace';
      ctx.fillText(title, W / 2, H / 2 - 30);
      ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
      ctx.font = '500 13px "JetBrains Mono", monospace';
      lines.forEach((line, i) => ctx.fillText(line, W / 2, H / 2 + i * 22));
    };

    const draw = (t: number) => {
      drawBackground(t);
      drawPlatforms();
      drawPlayer(t);
      drawHud();
      if (mode === 'ready') {
        drawOverlay('ROCKET JUMP', ['Bounce as high as you can.', '', 'Space or tap to launch']);
      } else if (mode === 'over') {
        drawOverlay('GAME OVER', [
          `Altitude: ${Math.round(score / 10)} m`,
          `Best: ${best} m`,
          '',
          'Space or tap to retry',
        ]);
      }
    };

    let raf = 0;
    const loop = (t: number) => {
      if (mode === 'playing') update();
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    reset();
    raf = requestAnimationFrame(loop);

    const start = () => {
      reset();
      mode = 'playing';
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', ' ', 'Enter'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowLeft' || e.key === 'a') input.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') input.right = true;
      if ((e.key === ' ' || e.key === 'Enter') && mode !== 'playing') start();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') input.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') input.right = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (mode !== 'playing') {
        start();
        return;
      }
      const rect = canvas.getBoundingClientRect();
      input.touch = e.clientX - rect.left < rect.width / 2 ? -1 : 1;
    };
    const onPointerUp = () => {
      input.touch = 0;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', maxWidth: W, touchAction: 'none' }}
      className="block mx-auto rounded-lg select-none"
    />
  );
}
