import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, Star, AlertCircle } from 'lucide-react';
import { Level, Word } from '@/data/wordDatabase';
import { Button } from '@/components/ui/button';

interface FailedWord {
  word: Word;
  selectedArtikel: string | null; // null if floor hit
}

interface GameOverProps {
  score: number;
  level: Level;
  highScore: number;
  failedWords: FailedWord[];
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameOver = ({ score, level, highScore, failedWords, onRestart, onBackToMenu }: GameOverProps) => {
  const isNewHighScore = score >= highScore && score > 0;

  // Get article color
  const getArtikelColor = (artikel: string) => {
    switch (artikel) {
      case 'der': return 'text-[hsl(var(--der-color))]';
      case 'die': return 'text-[hsl(var(--die-color))]';
      case 'das': return 'text-[hsl(var(--das-color))]';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-md z-50 overflow-y-auto p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="text-center p-6 md:p-8 max-w-2xl mx-4 w-full"
      >
        {/* Game Over Title */}
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-['JetBrains_Mono']"
        >
          Game Over
        </motion.h2>

        {/* High Score Badge */}
        {isNewHighScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-4"
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
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <span className="text-5xl md:text-6xl font-bold text-primary">{score}</span>
          </div>
          <p className="text-muted-foreground">
            Level {level} • Best: {Math.max(score, highScore)}
          </p>
        </motion.div>

        {/* Failed Words Explanation */}
        {failedWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 text-left bg-card rounded-2xl p-4 md:p-6 border border-border max-h-[300px] overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h3 className="font-bold text-lg text-foreground">Words to Review</h3>
            </div>
            
            <div className="space-y-4">
              {failedWords.slice(0, 5).map((failed, index) => (
                <motion.div
                  key={`${failed.word.word}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="border-b border-border pb-3 last:border-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-lg ${getArtikelColor(failed.word.artikel)}`}>
                      {failed.word.artikel}
                    </span>
                    <span className="font-semibold text-foreground">{failed.word.word}</span>
                    {failed.selectedArtikel && failed.selectedArtikel !== failed.word.artikel && (
                      <span className="text-sm text-destructive ml-2">
                        (you chose: {failed.selectedArtikel})
                      </span>
                    )}
                    {!failed.selectedArtikel && (
                      <span className="text-sm text-muted-foreground ml-2">(missed)</span>
                    )}
                  </div>
                  {failed.word.explanation && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {failed.word.explanation}
                    </p>
                  )}
                </motion.div>
              ))}
              {failedWords.length > 5 && (
                <p className="text-sm text-muted-foreground italic">
                  +{failedWords.length - 5} more words...
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
