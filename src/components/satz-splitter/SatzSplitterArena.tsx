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
  showFeedback: 'correct' | 'incorrect' | null;
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
      showFeedback: null,
    };
  }, [level, levelInfo.timeLimit]);

  const [gameState, setGameState] = useState<GameState>(initializeGame);

  // Timer countdown
  useEffect(() => {
    if (gameState.isGameOver || gameState.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up - lose a life
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            return { ...prev, timeLeft: 0, lives: 0, isGameOver: true };
          }
          // Get new sentence
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
  }, [gameState.isGameOver, gameState.timeLeft, level, levelInfo.timeLimit]);

  // Clear feedback after animation
  useEffect(() => {
    if (gameState.showFeedback) {
      const timeout = setTimeout(() => {
        setGameState(prev => ({ ...prev, showFeedback: null }));
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [gameState.showFeedback]);

  // Handle placing a word in a slot
  const handlePlaceWord = useCallback((word: SentenceWord, slotIndex: number) => {
    setGameState(prev => {
      if (!prev.currentSentence) return prev;

      // Check if correct position
      const isCorrect = word.position === slotIndex + 1;

      if (isCorrect) {
        // Place the word
        const newPlacedWords = [...prev.placedWords];
        newPlacedWords[slotIndex] = word;

        // Remove from shuffled words
        const newShuffledWords = prev.shuffledWords.filter(w => w.word !== word.word || w.position !== word.position);

        // Check if sentence complete
        if (newShuffledWords.length === 0) {
          const newScore = prev.score + 50 * (prev.streak + 1);
          
          // Update high score
          if (newScore > highScore) {
            localStorage.setItem(`satzsplitter-highscore-${level}`, newScore.toString());
            setHighScore(newScore);
          }

          // Get next sentence after delay
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
        // Wrong position
        return {
          ...prev,
          showFeedback: 'incorrect',
          streak: 0,
        };
      }
    });
  }, [highScore, level, levelInfo.timeLimit]);

  // Restart game
  const handleRestart = useCallback(() => {
    setGameState(initializeGame());
  }, [initializeGame]);

  return (
    <div className="h-screen flex flex-col bg-[image:var(--gradient-game-bg)] relative overflow-hidden">
      {/* Screen flash effect */}
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

      <SatzGameStats
        level={level}
        score={gameState.score}
        lives={gameState.lives}
        streak={gameState.streak}
        timeLeft={gameState.timeLeft}
        maxTime={levelInfo.timeLimit}
        onBack={onBackToMenu}
      />

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-8">
        {/* English hint */}
        {gameState.currentSentence && (
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

        {/* Sentence Slots (Ghost Outline) */}
        {gameState.currentSentence && (
          <SentenceSlots
            key={gameState.sentenceKey + '-slots'}
            sentence={gameState.currentSentence}
            placedWords={gameState.placedWords}
            onDropWord={handlePlaceWord}
          />
        )}

        {/* Word Pool */}
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
      </div>

      {/* Game Over Overlay */}
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
