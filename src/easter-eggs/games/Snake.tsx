import { useEffect, useRef } from 'react';

const COLS = 20;
const ROWS = 20;
const CELL = 19;
const W = COLS * CELL;
const H = ROWS * CELL;
const BEST_KEY = 'egg-snake-best';

interface Vec {
  x: number;
  y: number;
}

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let mode: 'ready' | 'playing' | 'over' = 'ready';
    let snake: Vec[] = [];
    let dir: Vec = { x: 1, y: 0 };
    let dirQueue: Vec[] = [];
    let food: Vec = { x: 14, y: 10 };
    let score = 0;
    let best = Number(localStorage.getItem(BEST_KEY) || 0);
    let stepMs = 130;
    let lastStep = 0;
    let swipeStart: Vec | null = null;

    const placeFood = () => {
      do {
        food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      } while (snake.some((s) => s.x === food.x && s.y === food.y));
    };

    const reset = () => {
      snake = [
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 },
      ];
      dir = { x: 1, y: 0 };
      dirQueue = [];
      score = 0;
      stepMs = 130;
      placeFood();
    };

    const queueDir = (d: Vec) => {
      const last = dirQueue[dirQueue.length - 1] ?? dir;
      // ignore reversals and duplicates
      if (d.x === -last.x && d.y === -last.y) return;
      if (d.x === last.x && d.y === last.y) return;
      if (dirQueue.length < 3) dirQueue.push(d);
    };

    const step = () => {
      if (dirQueue.length > 0) dir = dirQueue.shift()!;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
      const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);
      if (hitWall || hitSelf) {
        mode = 'over';
        best = Math.max(best, score);
        localStorage.setItem(BEST_KEY, String(best));
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 1;
        stepMs = Math.max(65, stepMs - 2.5);
        placeFood();
      } else {
        snake.pop();
      }
    };

    const draw = (t: number) => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, W, H);

      // subtle grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.lineWidth = 1;
      for (let i = 1; i < COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL + 0.5, 0);
        ctx.lineTo(i * CELL + 0.5, H);
        ctx.stroke();
      }
      for (let j = 1; j < ROWS; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * CELL + 0.5);
        ctx.lineTo(W, j * CELL + 0.5);
        ctx.stroke();
      }

      // food (pulsing)
      const pulse = 0.75 + 0.25 * Math.sin(t / 200);
      ctx.fillStyle = '#fb7185';
      ctx.shadowColor = 'rgba(251, 113, 133, 0.8)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, (CELL / 2 - 4) * pulse + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // snake, head brightest, fading toward the tail
      snake.forEach((s, i) => {
        const f = i / Math.max(1, snake.length - 1);
        const alpha = 0.95 - f * 0.5;
        ctx.fillStyle = i === 0 ? '#67e8f9' : `rgba(34, 211, 238, ${alpha})`;
        ctx.beginPath();
        ctx.roundRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3, 5);
        ctx.fill();
      });
      // eyes on the head
      const head = snake[0];
      ctx.fillStyle = '#020617';
      const ex = head.x * CELL + CELL / 2 + dir.x * 3;
      const ey = head.y * CELL + CELL / 2 + dir.y * 3;
      const px = dir.y !== 0 ? 4 : 0;
      const py = dir.x !== 0 ? 4 : 0;
      ctx.beginPath();
      ctx.arc(ex - px, ey - py, 1.8, 0, Math.PI * 2);
      ctx.arc(ex + px, ey + py, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // HUD
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.95)';
      ctx.fillText(`SCORE ${score}`, 10, 18);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.fillText(`BEST ${best}`, W - 10, 18);

      if (mode !== 'playing') {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#67e8f9';
        ctx.font = '700 22px "JetBrains Mono", monospace';
        ctx.fillText(mode === 'ready' ? 'SNAKE' : 'GAME OVER', W / 2, H / 2 - 30);
        ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
        ctx.font = '500 13px "JetBrains Mono", monospace';
        const lines =
          mode === 'ready'
            ? ['Eat. Grow. Don\u2019t crash.', '', 'Press any arrow or tap to start']
            : [`Score: ${score}`, `Best: ${best}`, '', 'Space or tap to retry'];
        lines.forEach((line, i) => ctx.fillText(line, W / 2, H / 2 + i * 22));
      }
    };

    let raf = 0;
    const loop = (t: number) => {
      if (mode === 'playing' && t - lastStep >= stepMs) {
        lastStep = t;
        step();
      }
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    reset();
    raf = requestAnimationFrame(loop);

    const start = () => {
      reset();
      mode = 'playing';
      lastStep = 0;
    };

    const KEY_DIRS: Record<string, Vec> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key in KEY_DIRS || e.key === ' ' || e.key === 'Enter') e.preventDefault();
      const d = KEY_DIRS[e.key];
      if (d) {
        if (mode === 'ready') start();
        if (mode === 'playing') queueDir(d);
      } else if ((e.key === ' ' || e.key === 'Enter') && mode !== 'playing') {
        start();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (mode !== 'playing') {
        start();
        return;
      }
      swipeStart = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!swipeStart) return;
      const dx = e.clientX - swipeStart.x;
      const dy = e.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
      if (Math.abs(dx) > Math.abs(dy)) queueDir({ x: Math.sign(dx), y: 0 });
      else queueDir({ x: 0, y: Math.sign(dy) });
    };

    window.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
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
