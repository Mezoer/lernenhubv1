import { motion } from 'framer-motion';
import { Level, LEVEL_INFO } from '@/data/wordDatabase';
import { Sentence, SentenceWord } from '@/data/sentenceDatabase';
import { Trophy, RotateCcw, Home, Star, AlertCircle } from 'lucide-react';

interface FailedSentence {
  sentence: Sentence;
  placedWords: (SentenceWord | null)[];
}

interface SatzGameOverProps {
  score: number;
  level: Level;
  highScore: number;
  failedSentences?: FailedSentence[];
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const SatzGameOver = ({
  score,
  level,
  highScore,
  failedSentences = [],
  onRestart,
  onBackToMenu,
}: SatzGameOverProps) => {
  const isNewHighScore = score >= highScore && score > 0;
  const levelInfo = LEVEL_INFO[level];

  // Deduplicate by sentence english text
  const uniqueFailed = failedSentences.filter(
    (f, i, arr) => arr.findIndex(x => x.sentence.english === f.sentence.english) === i
  );

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
        className="w-full max-w-lg text-center max-h-[90vh] overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
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
          className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-['JetBrains_Mono']"
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
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Your Score</p>
          <p className="text-6xl font-bold text-primary">{score}</p>
          {!isNewHighScore && highScore > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Best: <span className="text-foreground font-semibold">{highScore}</span>
            </p>
          )}
        </motion.div>

        {/* Failed Sentences Review */}
        {uniqueFailed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6 text-left bg-card rounded-2xl p-4 md:p-6 border border-border max-h-[300px] overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h3 className="font-bold text-lg text-foreground">Sentences to Review</h3>
            </div>
            
            <div className="space-y-4">
              {uniqueFailed.slice(0, 5).map((failed, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="border-b border-border pb-3 last:border-0"
                >
                  <p className="text-sm text-muted-foreground mb-1">
                    English: <span className="text-foreground font-medium">"{failed.sentence.english}"</span>
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    Correct: {failed.sentence.words.map(w => w.word).join(' ')}
                  </p>
                  {failed.sentence.hint && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      💡 {failed.sentence.hint}
                    </p>
                  )}
                </motion.div>
              ))}
              {uniqueFailed.length > 5 && (
                <p className="text-sm text-muted-foreground italic">
                  +{uniqueFailed.length - 5} more sentences...
                </p>
              )}
            </div>
          </motion.div>
        )}

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