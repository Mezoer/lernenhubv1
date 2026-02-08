import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Flame, Timer } from 'lucide-react';
import { Level, LEVEL_INFO } from '@/data/wordDatabase';

interface SatzGameStatsProps {
  level: Level;
  score: number;
  lives: number;
  streak: number;
  timeLeft: number;
  maxTime: number;
  onBack: () => void;
}

export const SatzGameStats = ({
  level,
  score,
  lives,
  streak,
  timeLeft,
  maxTime,
  onBack,
}: SatzGameStatsProps) => {
  const levelInfo = LEVEL_INFO[level];
  const timePercentage = (timeLeft / maxTime) * 100;
  const isLowTime = timeLeft <= 5;

  return (
    <div className="flex items-center justify-between p-4 md:p-6 bg-card/50 backdrop-blur-sm border-b border-border">
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
            animate={{ 
              width: `${timePercentage}%`,
              backgroundColor: isLowTime ? 'hsl(var(--destructive))' : undefined,
            }}
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

        {/* Lives */}
        <div className="flex items-center gap-1">
          <AnimatePresence mode="popLayout">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: i < lives ? 1 : 0.6,
                  opacity: i < lives ? 1 : 0.3,
                }}
                exit={{
                  scale: [1, 1.4, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, -15, 15],
                  transition: { duration: 0.4 }
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Heart
                  className={`w-6 h-6 ${
                    i < lives
                      ? 'text-destructive fill-destructive'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
