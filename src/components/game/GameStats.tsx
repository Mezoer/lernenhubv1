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
      className="select-none"
    >
      {/* Desktop / iPad layout - consolidated HUD */}
      <div className="hidden md:block px-4 pt-4 pb-3 bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between rounded-2xl bg-secondary/60 border border-border/50 px-5 py-3">
          {/* Back + Level */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-background/50 transition-colors"
              aria-label="Back to menu"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-px h-6 bg-border/50" />
            <span className="text-sm text-muted-foreground">Level</span>
            <span className="font-bold text-primary">{level}</span>
          </div>

          {/* Center stats */}
          <div className="flex items-center gap-6">
            {/* Lives */}
            <div className="flex items-center gap-1.5">
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

            <div className="w-px h-6 bg-border/50" />

            {/* Streak - always reserves space */}
            <div className="flex items-center gap-1.5 min-w-[56px] justify-center">
              <AnimatePresence mode="wait">
                {streak > 1 ? (
                  <motion.div
                    key="streak-active"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-bold text-primary">{streak}x</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="streak-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    className="flex items-center gap-1.5"
                  >
                    <Target className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">--</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-border/50" />

            {/* Score */}
            <motion.div
              key={score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">{score}</span>
            </motion.div>
          </div>

          {/* Pause */}
          <button
            onClick={onTogglePause}
            className="p-2 rounded-lg hover:bg-background/50 transition-colors"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile consolidated HUD */}
      <div className="md:hidden px-3 pt-3 pb-2 bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between rounded-xl bg-secondary/60 border border-border/50 px-3 py-2">
          {/* Back */}
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0"
            aria-label="Back to menu"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>

          {/* Lives */}
          <div className="flex items-center gap-0.5 shrink-0">
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
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? 'text-destructive fill-destructive drop-shadow-[0_0_6px_hsl(var(--destructive)/0.6)]'
                        : 'text-muted-foreground/40'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="w-px h-5 bg-border/50" />

          {/* Streak - always reserves space */}
          <div className="flex items-center gap-1 min-w-[40px] justify-center shrink-0">
            <AnimatePresence mode="wait">
              {streak > 1 ? (
                <motion.div
                  key="streak-active"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-bold text-primary text-sm">{streak}x</span>
                </motion.div>
              ) : (
                <motion.div
                  key="streak-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  className="flex items-center gap-1"
                >
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground text-sm">--</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-5 bg-border/50" />

          {/* Score */}
          <motion.div
            key={score}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 shrink-0"
          >
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground text-sm">{score}</span>
          </motion.div>

          <div className="w-px h-5 bg-border/50" />

          {/* Pause */}
          <button
            onClick={onTogglePause}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
