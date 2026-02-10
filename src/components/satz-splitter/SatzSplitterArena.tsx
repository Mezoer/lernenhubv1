import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Level } from '@/data/wordDatabase';
import { 
  Sentence, 
  SentenceWord, 
  getRandomSentence, 
  shuffleWords, 
  SENTENCE_LEVEL_INFO 
} from '@/data/sentenceDatabase';
import { SatzGameStats } from './SatzGameStats';
import { SatzGameOver } from './SatzGameOver';
import { DraggableSatzWord } from './DraggableSatzWord';
import { SentenceSlots } from './SentenceSlots';

interface SatzSplitterArenaProps {
  level: Level;
  onBackToMenu: () => void;
}

interface GameState {
  currentSentence: Sentence | null;
  shuffledWords: SentenceWord[];
  placedWords: (SentenceWord | null)[];
  sentenceKey: string;
  score: number;
  lives: number;
  streak: number;
  timeLeft: number;
  isGameOver: boolean;
  isPaused: boolean;
  showFeedback: 'correct' | 'incorrect' | null;
  isFirstRound: boolean;
  showIntro: boolean;
}

export const SatzSplitterArena = ({ level, onBackToMenu }: SatzSplitterArenaProps) => {
  const levelInfo = SENTENCE_LEVEL_INFO[level];
  
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(`satzsplitter-highscore-${level}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const initializeGame = useCallback((): GameState => {
    const sentence = getRandomSentence(level);
    return {
      currentSentence: sentence,
      shuffledWords: shuffleWords(sentence),
      placedWords: new Array(sentence.words.length).fill(null),
      sentenceKey: uuidv4(),
      score: 0,
      lives: 3,
      streak: 0,
      timeLeft: levelInfo.timeLimit,
      isGameOver: false,
      isPaused: false,
      showFeedback: null,
      isFirstRound: true,
      showIntro: true,
    };
  }, [level, levelInfo.timeLimit]);

  const [gameState, setGameState] = useState<GameState>(initializeGame);

  // Intro animation - dismiss after 2s, then start timer
  useEffect(() => {
    if (gameState.showIntro) {
      const timeout = setTimeout(() => {
        setGameState(prev => ({ ...prev, showIntro: false }));
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gameState.showIntro]);

  // Timer countdown - paused during intro
  useEffect(() => {
    if (gameState.isGameOver || gameState.timeLeft <= 0 || gameState.isPaused || gameState.showIntro) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            return { ...prev, timeLeft: 0, lives: 0, isGameOver: true };
          }
          const newSentence = getRandomSentence(level);
          return {
            ...prev,
            timeLeft: levelInfo.timeLimit,
            lives: newLives,
            streak: 0,
            currentSentence: newSentence,
            shuffledWords: shuffleWords(newSentence),
            placedWords: new Array(newSentence.words.length).fill(null),
            sentenceKey: uuidv4(),
            showFeedback: 'incorrect',
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameOver, gameState.timeLeft, gameState.isPaused, gameState.showIntro, level, levelInfo.timeLimit]);

  // Clear feedback
  useEffect(() => {
    if (gameState.showFeedback) {
      const timeout = setTimeout(() => {
        setGameState(prev => ({ ...prev, showFeedback: null }));
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [gameState.showFeedback]);

  // Toggle pause
  const handleTogglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Handle placing a word in a slot
  const handlePlaceWord = useCallback((word: SentenceWord, slotIndex: number) => {
    setGameState(prev => {
      if (!prev.currentSentence) return prev;

      // If it's a distractor, always wrong
      if (word.isDistractor) {
        return { ...prev, showFeedback: 'incorrect', streak: 0 };
      }

      const isCorrect = word.position === slotIndex + 1;

      if (isCorrect) {
        const newPlacedWords = [...prev.placedWords];
        newPlacedWords[slotIndex] = word;

        // Remove from shuffled words
        const newShuffledWords = prev.shuffledWords.filter(
          w => !(w.word === word.word && w.position === word.position)
        );

        // Check if all REAL words are placed (ignore remaining distractors)
        const realWordsRemaining = newShuffledWords.filter(w => !w.isDistractor);
        
        if (realWordsRemaining.length === 0) {
          const newScore = prev.score + 50 * (prev.streak + 1);
          
          if (newScore > highScore) {
            localStorage.setItem(`satzsplitter-highscore-${level}`, newScore.toString());
            setHighScore(newScore);
          }

          // Spawn next sentence after delay
          setTimeout(() => {
            setGameState(p => {
              const newSentence = getRandomSentence(level);
              return {
                ...p,
                currentSentence: newSentence,
                shuffledWords: shuffleWords(newSentence),
                placedWords: new Array(newSentence.words.length).fill(null),
                sentenceKey: uuidv4(),
                timeLeft: levelInfo.timeLimit,
                isFirstRound: false,
                showIntro: false,
              };
            });
          }, 800);

          return {
            ...prev,
            placedWords: newPlacedWords,
            shuffledWords: newShuffledWords,
            score: newScore,
            streak: prev.streak + 1,
            showFeedback: 'correct',
          };
        }

        return {
          ...prev,
          placedWords: newPlacedWords,
          shuffledWords: newShuffledWords,
          showFeedback: 'correct',
        };
      } else {
        return { ...prev, showFeedback: 'incorrect', streak: 0 };
      }
    });
  }, [highScore, level, levelInfo.timeLimit]);

  const handleRestart = useCallback(() => {
    setGameState(initializeGame());
  }, [initializeGame]);

  return (
    <div className="h-screen flex flex-col bg-[image:var(--gradient-game-bg)] relative overflow-hidden select-none">
      {/* Screen flash */}
      <AnimatePresence>
        {gameState.showFeedback === 'incorrect' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-50 pointer-events-none bg-destructive/20"
          />
        )}
        {gameState.showFeedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-50 pointer-events-none bg-success/20"
          />
        )}
      </AnimatePresence>

      {/* Pause Overlay */}
      <AnimatePresence>
        {gameState.isPaused && !gameState.isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4 font-['JetBrains_Mono']">Paused</h2>
              <p className="text-muted-foreground">Press the play button to continue</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro animation overlay */}
      <AnimatePresence>
        {gameState.showIntro && gameState.currentSentence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0, y: -30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-center px-8"
            >
              <motion.p
                className="text-3xl md:text-4xl font-bold text-foreground font-['JetBrains_Mono'] drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                animate={{ textShadow: ['0 0 10px hsl(var(--primary)/0.3)', '0 0 30px hsl(var(--primary)/0.6)', '0 0 10px hsl(var(--primary)/0.3)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {gameState.currentSentence.words.map(w => w.word).join(' ')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground mt-4 text-lg"
              >
                "{gameState.currentSentence.english}"
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SatzGameStats
        level={level}
        score={gameState.score}
        lives={gameState.lives}
        streak={gameState.streak}
        timeLeft={gameState.timeLeft}
        maxTime={levelInfo.timeLimit}
        isPaused={gameState.isPaused}
        onBack={onBackToMenu}
        onTogglePause={handleTogglePause}
      />

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-8">
        {/* English hint */}
        {gameState.currentSentence && !gameState.showIntro && (
          <motion.div
            key={gameState.sentenceKey + '-hint'}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-muted-foreground text-sm mb-1">Translate:</p>
            <p className="text-lg md:text-xl text-foreground font-medium">
              "{gameState.currentSentence.english}"
            </p>
            {gameState.currentSentence.hint && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                💡 {gameState.currentSentence.hint}
              </p>
            )}
          </motion.div>
        )}

        {/* Sentence Slots */}
        {gameState.currentSentence && !gameState.showIntro && (
          <SentenceSlots
            key={gameState.sentenceKey + '-slots'}
            sentence={gameState.currentSentence}
            placedWords={gameState.placedWords}
            onDropWord={handlePlaceWord}
          />
        )}

        {/* Word Pool */}
        {!gameState.showIntro && (
          <motion.div
            key={gameState.sentenceKey + '-pool'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 max-w-3xl"
          >
            {gameState.shuffledWords.map((word, index) => (
              <DraggableSatzWord
                key={`${word.word}-${word.position}-${index}`}
                word={word}
                onDrop={handlePlaceWord}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Game Over */}
      <AnimatePresence>
        {gameState.isGameOver && (
          <SatzGameOver
            score={gameState.score}
            level={level}
            highScore={highScore}
            onRestart={handleRestart}
            onBackToMenu={onBackToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
