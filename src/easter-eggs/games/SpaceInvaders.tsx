import { useEffect, useRef } from 'react';

const W = 360;
const H = 440;
const COLS = 8;
const ROWS = 4;
const ALIEN_W = 24;
const ALIEN_H = 16;
const CELL_X = 36;
const CELL_Y = 30;
const BEST_KEY = 'egg-invaders-best';

const ROW_COLORS = ['#c4b5fd', '#67e8f9', '#6ee7b7', '#fcd34d'];

interface Alien {
  x: number;
  y: number;
  row: number;
  alive: boolean;
}
interface Bullet {
  x: number;
  y: number;
  vy: number;
}

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.1 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    let mode: 'ready' | 'playing' | 'over' = 'ready';
    let player = { x: W / 2 - 15, w: 30, h: 14, lives: 3 };
    let bullets: Bullet[] = [];
    let alienBullets: Bullet[] = [];
    let aliens: Alien[] = [];
    let alienDir = 1;
    let wave = 1;
    let score = 0;
    let best = Number(localStorage.getItem(BEST_KEY) || 0);
    let lastShot = 0;
    let lastAlienShot = 0;
    let hitFlash = 0; // frames of red flash after losing a life
    const input = { left: false, right: false, fire: false };
    const PLAYER_Y = H - 36;

    const spawnWave = () => {
      aliens = [];
      const offsetX = (W - (COLS - 1) * CELL_X - ALIEN_W) / 2;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          aliens.push({ x: offsetX + c * CELL_X, y: 52 + r * CELL_Y, row: r, alive: true });
        }
      }
      alienDir = 1;
      bullets = [];
      alienBullets = [];
    };

    const reset = () => {
      player = { x: W / 2 - 15, w: 30, h: 14, lives: 3 };
      score = 0;
      wave = 1;
      spawnWave();
    };

    const endGame = () => {
      mode = 'over';
      best = Math.max(best, score);
      localStorage.setItem(BEST_KEY, String(best));
    };

    const update = (t: number) => {
      // player movement + shooting
      const dir = (input.left ? -1 : 0) + (input.right ? 1 : 0);
      player.x = Math.max(6, Math.min(W - player.w - 6, player.x + dir * 4.2));
      if (input.fire && t - lastShot > 320) {
        bullets.push({ x: player.x + player.w / 2, y: PLAYER_Y - 6, vy: -7 });
        lastShot = t;
      }

      // alien fleet movement: speeds up as the fleet thins out
      const alive = aliens.filter((a) => a.alive);
      const speed = (0.35 + (1 - alive.length / (COLS * ROWS)) * 1.5 + wave * 0.15) * alienDir;
      let hitEdge = false;
      for (const a of alive) {
        a.x += speed;
        if (a.x < 6 || a.x + ALIEN_W > W - 6) hitEdge = true;
      }
      if (hitEdge) {
        alienDir *= -1;
        for (const a of alive) {
          a.x += alienDir * 2;
          a.y += 12;
        }
      }

      // alien fire
      const fireEvery = Math.max(450, 950 - wave * 80);
      if (alive.length > 0 && t - lastAlienShot > fireEvery) {
        const shooter = alive[Math.floor(Math.random() * alive.length)];
        alienBullets.push({
          x: shooter.x + ALIEN_W / 2,
          y: shooter.y + ALIEN_H,
          vy: 2.6 + wave * 0.3,
        });
        lastAlienShot = t;
      }

      for (const b of bullets) b.y += b.vy;
      for (const b of alienBullets) b.y += b.vy;
      bullets = bullets.filter((b) => b.y > -10);
      alienBullets = alienBullets.filter((b) => b.y < H + 10);

      // player bullets vs aliens
      for (const b of bullets) {
        for (const a of aliens) {
          if (
            a.alive &&
            b.x > a.x - 2 &&
            b.x < a.x + ALIEN_W + 2 &&
            b.y > a.y &&
            b.y < a.y + ALIEN_H
          ) {
            a.alive = false;
            b.y = -100;
            score += 10 * wave;
            break;
          }
        }
      }

      // alien bullets vs player
      for (const b of alienBullets) {
        if (
          b.x > player.x &&
          b.x < player.x + player.w &&
          b.y > PLAYER_Y &&
          b.y < PLAYER_Y + player.h
        ) {
          b.y = H + 100;
          player.lives -= 1;
          hitFlash = 12;
          if (player.lives <= 0) endGame();
        }
      }

      // invasion complete?
      for (const a of alive) {
        if (a.y + ALIEN_H >= PLAYER_Y - 4) {
          endGame();
          break;
        }
      }

      if (alive.length === 0) {
        wave += 1;
        spawnWave();
      }
    };

    const drawBackground = (t: number) => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, W, H);
      for (const s of stars) {
        const tw = 0.35 + 0.4 * Math.sin(t / 1100 + s.phase);
        ctx.fillStyle = `rgba(186, 230, 253, ${tw})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (hitFlash > 0) {
        ctx.fillStyle = `rgba(244, 63, 94, ${hitFlash / 40})`;
        ctx.fillRect(0, 0, W, H);
        hitFlash -= 1;
      }
    };

    const drawAlien = (a: Alien, t: number) => {
      const wiggle = Math.sin(t / 250 + a.row) > 0 ? 1 : -1;
      ctx.fillStyle = ROW_COLORS[a.row];
      // body
      ctx.beginPath();
      ctx.roundRect(a.x, a.y + 3, ALIEN_W, ALIEN_H - 5, 4);
      ctx.fill();
      // antennae
      ctx.fillRect(a.x + 4, a.y, 2, 4);
      ctx.fillRect(a.x + ALIEN_W - 6, a.y, 2, 4);
      // legs (alternate as the fleet marches)
      ctx.fillRect(a.x + 3 + wiggle, a.y + ALIEN_H - 2, 4, 3);
      ctx.fillRect(a.x + ALIEN_W - 7 - wiggle, a.y + ALIEN_H - 2, 4, 3);
      // eyes
      ctx.fillStyle = '#020617';
      ctx.fillRect(a.x + 6, a.y + 7, 3, 3);
      ctx.fillRect(a.x + ALIEN_W - 9, a.y + 7, 3, 3);
    };

    const drawPlayer = () => {
      const { x, w } = player;
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = 'rgba(34, 211, 238, 0.7)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, PLAYER_Y - 8);
      ctx.lineTo(x + w, PLAYER_Y + player.h);
      ctx.lineTo(x, PLAYER_Y + player.h);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0e7490';
      ctx.fillRect(x + w / 2 - 2, PLAYER_Y - 2, 4, 8);
    };

    const drawBullets = () => {
      ctx.fillStyle = '#e0f2fe';
      for (const b of bullets) ctx.fillRect(b.x - 1.5, b.y - 6, 3, 8);
      ctx.fillStyle = '#fb7185';
      for (const b of alienBullets) ctx.fillRect(b.x - 1.5, b.y, 3, 8);
    };

    const drawHud = () => {
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.95)';
      ctx.fillText(`SCORE ${score}`, 12, 20);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.fillText(`WAVE ${wave}`, W / 2, 20);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fb7185';
      ctx.fillText('♥'.repeat(Math.max(0, player.lives)), W - 12, 20);
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
      for (const a of aliens) if (a.alive) drawAlien(a, t);
      drawPlayer();
      drawBullets();
      drawHud();
      if (mode === 'ready') {
        drawOverlay('SPACE INVADERS', ['Defend the home planet.', '', 'Space or tap to start']);
      } else if (mode === 'over') {
        drawOverlay('GAME OVER', [`Score: ${score}`, `Best: ${best}`, '', 'Space or tap to retry']);
      }
    };

    let raf = 0;
    const loop = (t: number) => {
      if (mode === 'playing') update(t);
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
      if (e.key === ' ' || e.key === 'Enter') {
        if (mode !== 'playing') start();
        else input.fire = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') input.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') input.right = false;
      if (e.key === ' ' || e.key === 'Enter') input.fire = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (mode !== 'playing') {
        start();
        return;
      }
      input.fire = true;
      movePlayerTo(e);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons > 0) movePlayerTo(e);
    };
    const onPointerUp = () => {
      input.fire = false;
    };
    const movePlayerTo = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      player.x = Math.max(6, Math.min(W - player.w - 6, x - player.w / 2));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
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
