import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart, Target, ArrowLeft, Pause, Play } from 'lucide-react';
import { Level } from '@/data/wordDatabase';
import { useEffect, useRef } from 'react';

interface GameStatsProps {
  level: Level;
  score: number;
  lives: number;
  streak: number;
  isPaused: boolean;
  onBack: () => void;
  onTogglePause: () => void;
}

export const GameStats = ({ level, score, lives, streak, isPaused, onBack, onTogglePause }: GameStatsProps) => {
  const prevLives = useRef(lives);
  const justLostLife = prevLives.current > lives;
  
  useEffect(() => {
    prevLives.current = lives;
  }, [lives]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border select-none"
    >
      {/* Back button + Level */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Back to menu"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="stat-badge">
          <span className="text-sm text-muted-foreground">Level:</span>{' '}
          <span className="font-bold text-primary">{level}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Score */}
        <motion.div
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="stat-badge flex items-center gap-2"
        >
          <Trophy className="w-4 h-4 text-primary" />
          <span className="font-bold">{score}</span>
        </motion.div>

        {/* Streak */}
        <AnimatePresence>
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="stat-badge flex items-center gap-2 bg-primary/20"
            >
              <Target className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{streak}x</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Button */}
        <button
          onClick={onTogglePause}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>

        {/* Lives with satisfying heart animations */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => {
            const isActive = i < lives;
            const isBreaking = justLostLife && i === lives;
            
            return (
              <motion.div
                key={i}
                initial={false}
                animate={
                  isBreaking
                    ? {
                        scale: [1, 1.4, 0],
                        rotate: [0, -15, 15, 0],
                        opacity: [1, 1, 0],
                      }
                    : {
                        scale: isActive ? 1 : 0.7,
                        opacity: isActive ? 1 : 0.2,
                      }
                }
                transition={
                  isBreaking
                    ? { duration: 0.4, ease: 'easeOut' }
                    : { type: 'spring', stiffness: 500, damping: 25 }
                }
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isActive 
                      ? 'text-destructive fill-destructive drop-shadow-[0_0_8px_hsl(var(--destructive)/0.6)]' 
                      : 'text-muted-foreground/40'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
