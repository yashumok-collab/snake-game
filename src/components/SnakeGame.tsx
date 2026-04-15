import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : '#bc13fe';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = isHead ? '#00f3ff' : '#bc13fe';
      
      // Rounded segments
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(foodX, foodY, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-dark-surface rounded-[40px] neon-border-cyan relative overflow-hidden">
      <div className="scanline" />
      
      <div className="flex justify-between w-full items-center px-6 py-4 border-2 border-dashed border-neon-cyan/30 rounded-2xl bg-black/20">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan/60 font-mono font-bold">Current Score</span>
          <span className="text-5xl font-digital font-black neon-glow-cyan glitch-text tracking-widest">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neon-pink/60 font-mono font-bold">High Score</span>
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-neon-pink" />
            <span className="text-5xl font-digital font-black neon-glow-pink glitch-text tracking-widest">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-xl bg-black/50 backdrop-blur-sm border border-white/10"
        />
        
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md rounded-xl"
            >
              {gameOver ? (
                <>
                  <h2 className="text-6xl font-digital font-black text-neon-pink mb-4 tracking-tighter uppercase glitch-text">Game Over</h2>
                  <p className="text-white/60 mb-10 font-mono text-lg tracking-widest uppercase">Final Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-3 px-10 py-4 bg-neon-pink text-black font-black rounded-full hover:scale-110 transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,0,255,0.6)] uppercase tracking-widest"
                  >
                    <RotateCcw size={24} />
                    TRY AGAIN
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-7xl font-digital font-black text-neon-cyan mb-12 tracking-tighter uppercase glitch-text">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-3 px-12 py-5 bg-neon-cyan text-black font-black rounded-full hover:scale-110 transition-transform active:scale-95 shadow-[0_0_30px_rgba(0,243,255,0.6)] uppercase tracking-widest text-xl"
                  >
                    <Play size={28} fill="currentColor" />
                    RESUME
                  </button>
                  <p className="mt-8 text-[12px] text-white/40 uppercase tracking-[0.4em] font-mono font-bold">Press SPACE to toggle</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
        <span>Arrows to Move</span>
        <span>•</span>
        <span>Space to Pause</span>
      </div>
    </div>
  );
}
