import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Word } from '@/data/wordDatabase';

type PointInfo = { x: number; y: number };

interface DraggableWordProps {
  word: Word;
  wordKey: string;
  containerRef: React.RefObject<HTMLDivElement>;
  fallSpeed: number;
  isDragging: boolean;
  isPaused: boolean;
  onDragStart: () => void;
  onDragEnd: (pointerPos: PointInfo, wordSnapshot: Word) => void;
  onHitFloor: () => void;
  gameHeight: number;
}

export const DraggableWord = ({
  word,
  wordKey,
  containerRef,
  fallSpeed,
  isDragging,
  isPaused,
  onDragStart,
  onDragEnd,
  onHitFloor,
  gameHeight,
}: DraggableWordProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const wordRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const [tilt, setTilt] = useState(0);

  // Pointer tracking refs
  const draggingRef = useRef(false);
  const pointerStartRef = useRef<PointInfo>({ x: 0, y: 0 });
  const valueStartRef = useRef<PointInfo>({ x: 0, y: 0 });
  const lastPointerRef = useRef<PointInfo>({ x: 0, y: 0 });

  const floorY = gameHeight - 200;

  const glowIntensity = useTransform(y, [0, floorY / 2, floorY], [0.3, 0.5, 0.8]);

  // Gravity loop — only runs when NOT dragging
  const animate = useCallback((currentTime: number) => {
    if (draggingRef.current || isPaused) {
      lastTimeRef.current = currentTime;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;
    const clampedDelta = Math.min(deltaTime, 0.1);

    const currentY = y.get();
    const newY = currentY + fallSpeed * 120 * clampedDelta;

    if (newY >= floorY) {
      y.set(floorY);
      onHitFloor();
      return;
    }

    y.set(newY);
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, fallSpeed, floorY, y, onHitFloor]);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }, 100);
    return () => {
      clearTimeout(startDelay);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  // --- Manual pointer handlers for 1:1 tracking ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    valueStartRef.current = { x: x.get(), y: y.get() };
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setTilt(0);
    onDragStart();
  }, [onDragStart, x, y]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    x.set(valueStartRef.current.x + dx);
    y.set(valueStartRef.current.y + dy);

    // Tilt from horizontal velocity
    const vx = e.clientX - lastPointerRef.current.x;
    setTilt(Math.max(-12, Math.min(12, vx * 0.8)));
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  }, [x, y]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setTilt(0);

    // Reset x back to center, keep y where it is so gravity continues from there
    x.set(0);
    lastTimeRef.current = performance.now();

    onDragEnd({ x: e.clientX, y: e.clientY }, word);
  }, [onDragEnd, word, x]);

  return (
    <motion.div
      ref={wordRef}
      key={wordKey}
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: draggingRef.current ? 1.1 : 1, rotate: tilt }}
      exit={{
        opacity: 0,
        scale: 1.3,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      transition={{ rotate: { type: 'spring', stiffness: 300, damping: 20 } }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute left-1/2 -translate-x-1/2 top-8 select-none touch-none cursor-grab active:cursor-grabbing"
    >
      <motion.div
        className="word-card relative overflow-hidden"
        style={{
          boxShadow: useTransform(
            glowIntensity,
            (intensity) => `
              0 0 ${10 + intensity * 15}px hsl(var(--primary) / ${intensity * 0.4}),
              0 ${4 + intensity * 6}px ${15 + intensity * 15}px hsl(220 25% 5% / 0.4)
            `
          ),
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/15 to-transparent"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="relative z-10 text-2xl md:text-3xl font-bold text-foreground pointer-events-none">
          {word.word}
        </span>
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </motion.div>
  );
};
