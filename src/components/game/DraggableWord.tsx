import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
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
  const y = useMotionValue(0);
  const wordRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const hasStartedRef = useRef(false);
  const [dragVelocityX, setDragVelocityX] = useState(0);
  // Track whether drop was successful to control snapToOrigin
  const dropSuccessRef = useRef(false);
  
  const floorY = gameHeight - 200;

  // Subtle glow based on fall position
  const glowIntensity = useTransform(y, [0, floorY / 2, floorY], [0.3, 0.5, 0.8]);

  // Gravity animation loop
  const animate = useCallback((currentTime: number) => {
    if (isDragging || isPaused) {
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
  }, [isDragging, isPaused, fallSpeed, floorY, y, onHitFloor]);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      hasStartedRef.current = true;
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }, 100);
    
    return () => {
      clearTimeout(startDelay);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const handleDragStart = useCallback(() => {
    dropSuccessRef.current = false;
    onDragStart();
  }, [onDragStart]);

  const handleDrag = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Track velocity for tilt effect
    setDragVelocityX(info.velocity.x);
  }, []);

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragVelocityX(0);
    const pointerX = info.point.x;
    const pointerY = info.point.y;

    onDragEnd({ x: pointerX, y: pointerY }, word);
  }, [onDragEnd, word]);

  // Compute tilt from drag velocity (subtle, satisfying)
  const tilt = Math.max(-12, Math.min(12, dragVelocityX * 0.015));

  return (
    <motion.div
      ref={wordRef}
      key={wordKey}
      drag
      dragSnapToOrigin
      dragElastic={0.05}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: tilt }}
      exit={{ 
        opacity: 0, 
        scale: 1.3,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 50,
      }}
      transition={{ rotate: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="absolute left-1/2 -translate-x-1/2 top-8 select-none cursor-grab active:cursor-grabbing"
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
        {/* Subtle background glow */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/15 to-transparent"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <span className="relative z-10 text-2xl md:text-3xl font-bold text-foreground pointer-events-none">
          {word.word}
        </span>
        
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </motion.div>
  );
};
