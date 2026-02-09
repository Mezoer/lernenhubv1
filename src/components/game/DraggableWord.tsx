import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from 'framer-motion';
import { Word } from '@/data/wordDatabase';

interface DraggableWordProps {
  word: Word;
  wordKey: string;
  containerRef: React.RefObject<HTMLDivElement>;
  fallSpeed: number;
  isDragging: boolean;
  isPaused: boolean;
  onDragStart: () => void;
  onDragEnd: (wordRect: DOMRect, wordSnapshot: Word) => void;
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
  const rawY = useMotionValue(0);
  const y = useSpring(rawY, { stiffness: 300, damping: 30 });
  const wordRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const hasStartedRef = useRef(false);
  
  // Track drag velocity for tilt effect
  const [dragVelocity, setDragVelocity] = useState({ x: 0, y: 0 });
  
  // Floor detection threshold (leave space for article zones)
  const floorY = gameHeight - 200;

  // Glow effect based on position - pulsing golden glow
  const glowIntensity = useTransform(rawY, [0, floorY / 2, floorY], [0.4, 0.6, 0.9]);

  // Tilt based on drag velocity (resistance feel)
  const tiltX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  // Gravity animation loop
  const animate = useCallback((currentTime: number) => {
    if (isDragging || isPaused) {
      lastTimeRef.current = currentTime;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    // Clamp deltaTime to avoid huge jumps
    const clampedDelta = Math.min(deltaTime, 0.1);
    
    const currentY = rawY.get();
    const newY = currentY + fallSpeed * 120 * clampedDelta;

    if (newY >= floorY) {
      rawY.set(floorY);
      onHitFloor();
      return;
    }

    rawY.set(newY);
    animationRef.current = requestAnimationFrame(animate);
  }, [isDragging, isPaused, fallSpeed, floorY, rawY, onHitFloor]);

  // Start gravity after initial render
  useEffect(() => {
    // Small delay to ensure proper mounting
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

  // Handle drag with velocity tracking for tilt
  const handleDrag = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragVelocity({ x: info.velocity.x, y: info.velocity.y });
    
    // Apply tilt based on velocity (resistance/weight feel)
    const maxTilt = 15;
    const velocityScale = 0.02;
    tiltX.set(Math.max(-maxTilt, Math.min(maxTilt, info.velocity.x * velocityScale)));
    tiltY.set(Math.max(-maxTilt, Math.min(maxTilt, info.velocity.y * velocityScale * 0.5)));
  }, [tiltX, tiltY]);

  const handleDragEnd = useCallback(() => {
    // Reset tilt
    tiltX.set(0);
    tiltY.set(0);
    setDragVelocity({ x: 0, y: 0 });
    
    if (wordRef.current) {
      const rect = wordRef.current.getBoundingClientRect();
      // Pass the word snapshot to prevent race conditions
      onDragEnd(rect, word);
    }
  }, [onDragEnd, word, tiltX, tiltY]);

  return (
    <motion.div
      ref={wordRef}
      key={wordKey}
      drag
      dragConstraints={containerRef}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ 
        y,
        rotateX: tiltY,
        rotateZ: tiltX,
      }}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.3,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 50,
      }}
      className="absolute left-1/2 -translate-x-1/2 top-8 select-none cursor-grab active:cursor-grabbing"
    >
      <motion.div
        className="word-card relative overflow-hidden"
        style={{
          boxShadow: useTransform(
            glowIntensity,
            (intensity) => `
              0 0 ${15 + intensity * 25}px hsl(var(--primary) / ${intensity * 0.6}),
              0 ${4 + intensity * 8}px ${20 + intensity * 20}px hsl(220 25% 5% / 0.5)
            `
          ),
        }}
      >
        {/* Pulsing background glow */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/20 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <span className="relative z-10 text-2xl md:text-3xl font-bold text-foreground pointer-events-none">
          {word.word}
        </span>
        
        {/* Subtle shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
