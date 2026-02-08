import { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Word } from '@/data/wordDatabase';

interface DraggableWordProps {
  word: Word;
  wordKey: string;
  containerRef: React.RefObject<HTMLDivElement>;
  fallSpeed: number;
  isDragging: boolean;
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
  onDragStart,
  onDragEnd,
  onHitFloor,
  gameHeight,
}: DraggableWordProps) => {
  const y = useMotionValue(0);
  const wordRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  
  // Floor detection threshold (leave space for article zones)
  const floorY = gameHeight - 200;

  // Glow effect based on position - pulsing golden glow
  const glowIntensity = useTransform(y, [0, floorY / 2, floorY], [0.4, 0.6, 0.9]);

  // Gravity animation loop
  const animate = useCallback((currentTime: number) => {
    if (isDragging) {
      lastTimeRef.current = currentTime;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    const currentY = y.get();
    const newY = currentY + fallSpeed * 120 * deltaTime;

    if (newY >= floorY) {
      y.set(floorY);
      onHitFloor();
      return;
    }

    y.set(newY);
    animationRef.current = requestAnimationFrame(animate);
  }, [isDragging, fallSpeed, floorY, y, onHitFloor]);

  // Start/stop gravity based on drag state
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const handleDragEnd = useCallback(() => {
    if (wordRef.current) {
      const rect = wordRef.current.getBoundingClientRect();
      // Pass the word snapshot to prevent race conditions
      onDragEnd(rect, word);
    }
  }, [onDragEnd, word]);

  return (
    <motion.div
      ref={wordRef}
      key={wordKey}
      drag
      dragConstraints={containerRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      style={{ y }}
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
      className="absolute left-1/2 -translate-x-1/2 top-8"
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
        
        <span className="relative z-10 text-2xl md:text-3xl font-bold text-foreground">
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
