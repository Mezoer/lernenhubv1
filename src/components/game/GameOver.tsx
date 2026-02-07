import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, Star } from 'lucide-react';
import { Level } from '@/data/wordDatabase';
import { Button } from '@/components/ui/button';

interface GameOverProps {
  score: number;
  level: Level;
  highScore: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameOver = ({ score, level, highScore, onRestart, onBackToMenu }: GameOverProps) => {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-md z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="text-center p-8 max-w-md mx-4"
      >
        {/* Game Over Title */}
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
        >
          Game Over
        </motion.h2>

        {/* High Score Badge */}
        {isNewHighScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6"
          >
            <Star className="w-5 h-5 fill-primary" />
            <span className="font-bold">New High Score!</span>
          </motion.div>
        )}

        {/* Score Display */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <span className="text-6xl md:text-7xl font-bold text-primary">{score}</span>
          </div>
          <p className="text-muted-foreground">
            Level {level} • Best: {Math.max(score, highScore)}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRestart}
            size="lg"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </Button>
          
          <Button
            onClick={onBackToMenu}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
