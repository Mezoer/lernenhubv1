import { motion } from 'framer-motion';
import { Level, LEVEL_INFO } from '@/data/wordDatabase';
import { Trophy, RotateCcw, Home, Star } from 'lucide-react';

interface SatzGameOverProps {
  score: number;
  level: Level;
  highScore: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const SatzGameOver = ({
  score,
  level,
  highScore,
  onRestart,
  onBackToMenu,
}: SatzGameOverProps) => {
  const isNewHighScore = score >= highScore && score > 0;
  const levelInfo = LEVEL_INFO[level];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-6 overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-md text-center overflow-hidden"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isNewHighScore
              ? 'bg-gradient-to-br from-primary to-accent'
              : 'bg-secondary'
          }`}
        >
          {isNewHighScore ? (
            <Trophy className="w-12 h-12 text-primary-foreground" />
          ) : (
            <Star className="w-12 h-12 text-muted-foreground" />
          )}
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-2"
        >
          {isNewHighScore ? 'New High Score!' : 'Game Over'}
        </motion.h2>

        {/* Level */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-muted-foreground mb-6"
        >
          Level:{' '}
          <span className={`font-bold bg-gradient-to-r ${levelInfo.color} bg-clip-text text-transparent`}>
            {level}
          </span>
        </motion.p>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Your Score</p>
          <p className="text-6xl font-bold text-primary">{score}</p>
          {!isNewHighScore && highScore > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Best: <span className="text-foreground font-semibold">{highScore}</span>
            </p>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-primary-foreground font-semibold"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToMenu}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-semibold"
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
