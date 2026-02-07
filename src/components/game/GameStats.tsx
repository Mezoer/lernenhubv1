import { motion } from 'framer-motion';
import { Trophy, Heart, Target, ArrowLeft } from 'lucide-react';
import { Level } from '@/data/wordDatabase';

interface GameStatsProps {
  level: Level;
  score: number;
  lives: number;
  streak: number;
  onBack: () => void;
}

export const GameStats = ({ level, score, lives, streak, onBack }: GameStatsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border"
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
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="stat-badge flex items-center gap-2 bg-primary/20"
          >
            <Target className="w-4 h-4 text-primary" />
            <span className="font-bold text-primary">{streak}x</span>
          </motion.div>
        )}

        {/* Lives */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i < lives ? 1 : 0.8,
                opacity: i < lives ? 1 : 0.3,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Heart
                className={`w-6 h-6 ${i < lives ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
