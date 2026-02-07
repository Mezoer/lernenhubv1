import { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Word, Artikel } from '@/data/wordDatabase';

interface DraggableWordProps {
  word: Word;
  wordKey: string;
  containerRef: React.RefObject<HTMLDivElement>;
  fallSpeed: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: (info: PanInfo) => void;
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
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  
  // Floor detection threshold (leave space for article zones)
  const floorY = gameHeight - 200;

  // Glow effect based on position
  const glowOpacity = useTransform(y, [0, floorY / 2, floorY], [0.3, 0.5, 0.8]);

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

  return (
    <motion.div
      key={wordKey}
      drag
      dragConstraints={containerRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd(info)}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
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
        className="word-card relative"
        style={{
          boxShadow: useTransform(
            glowOpacity,
            (opacity) => `0 0 ${20 + opacity * 30}px hsl(var(--primary) / ${opacity})`
          ),
        }}
      >
        <span className="text-2xl md:text-3xl font-bold text-foreground">
          {word.word}
        </span>
        
        {/* Subtle shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
