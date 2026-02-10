import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Flame, Timer, Pause, Play } from 'lucide-react';
import { Level, LEVEL_INFO } from '@/data/wordDatabase';
import { useEffect, useRef } from 'react';

interface SatzGameStatsProps {
  level: Level;
  score: number;
  lives: number;
  streak: number;
  timeLeft: number;
  maxTime: number;
  isPaused: boolean;
  onBack: () => void;
  onTogglePause: () => void;
}

export const SatzGameStats = ({
  level,
  score,
  lives,
  streak,
  timeLeft,
  maxTime,
  isPaused,
  onBack,
  onTogglePause,
}: SatzGameStatsProps) => {
  const levelInfo = LEVEL_INFO[level];
  const timePercentage = (timeLeft / maxTime) * 100;
  const isLowTime = timeLeft <= 5;
  const prevLives = useRef(lives);
  const justLostLife = prevLives.current > lives;

  useEffect(() => {
    prevLives.current = lives;
  }, [lives]);

  return (
    <div className="flex items-center justify-between p-4 md:p-6 bg-card/50 backdrop-blur-sm border-b border-border select-none">
      {/* Back Button + Level */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        
        <div className="stat-badge">
          <span className={`font-bold bg-gradient-to-r ${levelInfo.color} bg-clip-text text-transparent`}>
            {level}
          </span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="flex-1 max-w-xs mx-4">
        <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${
              isLowTime ? 'bg-destructive' : 'bg-gradient-to-r from-accent to-primary'
            }`}
            initial={{ width: '100%' }}
            animate={{ width: `${timePercentage}%` }}
            transition={{ duration: 0.3 }}
          />
          {isLowTime && (
            <motion.div
              className="absolute inset-0 bg-destructive/30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>
        <div className="flex items-center justify-center gap-1 mt-1">
          <Timer className={`w-3 h-3 ${isLowTime ? 'text-destructive' : 'text-muted-foreground'}`} />
          <span className={`text-xs font-medium ${isLowTime ? 'text-destructive' : 'text-muted-foreground'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Score */}
        <motion.div
          key={score}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.2 }}
          className="stat-badge"
        >
          <span className="text-primary font-bold">{score}</span>
        </motion.div>

        {/* Streak */}
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="stat-badge flex items-center gap-1"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-orange-500 font-bold">x{streak}</span>
          </motion.div>
        )}

        {/* Pause Button */}
        <button
          onClick={onTogglePause}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>

        {/* Lives */}
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
                    ? { scale: [1, 1.4, 0], rotate: [0, -15, 15, 0], opacity: [1, 1, 0] }
                    : { scale: isActive ? 1 : 0.7, opacity: isActive ? 1 : 0.2 }
                }
                transition={
                  isBreaking
                    ? { duration: 0.4, ease: 'easeOut' }
                    : { type: 'spring', stiffness: 500, damping: 25 }
                }
              >
                <Heart
                  className={`w-6 h-6 ${
                    isActive
                      ? 'text-destructive fill-destructive drop-shadow-[0_0_8px_hsl(var(--destructive)/0.6)]'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
