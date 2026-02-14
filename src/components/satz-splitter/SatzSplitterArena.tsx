import { useState, useCallback, useEffect, useRef } from 'react';
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
import { WrongAnswerExplosion } from '@/components/game/WrongAnswerExplosion';
import { useSound } from '@/hooks/useSound';

interface SatzSplitterArenaProps {
  level: Level;
  onBackToMenu: () => void;
}

interface ExplodingWord {
  word: string;
  centerX: number;
  centerY: number;
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
  showHint: boolean;
  failedSentences: { sentence: Sentence; placedWords: (SentenceWord | null)[] }[];
  explodingWord: ExplodingWord | null;
  screenShake: boolean;
  correctSlotIndex: number | null;
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
      showHint: false,
      failedSentences: [],
      explodingWord: null,
      screenShake: false,
      correctSlotIndex: null,
    };
  }, [level, levelInfo.timeLimit]);

  const [gameState, setGameState] = useState<GameState>(initializeGame);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { playDing, playWrong } = useSound();

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

  // Clear feedback, screen shake, explosion, correct slot pulse
  useEffect(() => {
    if (gameState.showFeedback === 'incorrect') {
      const t1 = setTimeout(() => setGameState(prev => ({ ...prev, showFeedback: null })), 300);
      const t2 = setTimeout(() => setGameState(prev => ({ ...prev, screenShake: false })), 200);
      const t3 = setTimeout(() => setGameState(prev => ({ ...prev, explodingWord: null })), 650);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (gameState.showFeedback === 'correct') {
      const t = setTimeout(() => setGameState(prev => ({ ...prev, showFeedback: null })), 300);
      return () => clearTimeout(t);
    }
  }, [gameState.showFeedback]);

  useEffect(() => {
    if (gameState.correctSlotIndex !== null) {
      const t = setTimeout(() => setGameState(prev => ({ ...prev, correctSlotIndex: null })), 500);
      return () => clearTimeout(t);
    }
  }, [gameState.correctSlotIndex]);

  // Toggle pause
  const handleTogglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Get slot center for wrong-placement explosion (same system as Artikel-Drop)
  const getSlotExplosionPos = useCallback((slotIndex: number, wordText: string) => {
    const slotEl = document.getElementById(`sentence-slot-${slotIndex}`);
    const containerEl = gameAreaRef.current;
    if (!slotEl || !containerEl) return null;
    const sr = slotEl.getBoundingClientRect();
    const cr = containerEl.getBoundingClientRect();
    return {
      word: wordText,
      centerX: sr.left - cr.left + sr.width / 2,
      centerY: sr.top - cr.top + sr.height / 2,
    };
  }, []);

  // Handle placing a word in a slot
  const handlePlaceWord = useCallback((word: SentenceWord, slotIndex: number) => {
    const explosionPos = getSlotExplosionPos(slotIndex, word.word);

    setGameState(prev => {
      if (!prev.currentSentence) return prev;

      // If it's a distractor, always wrong - deduct heart + shatter
      if (word.isDistractor) {
        const newLives = prev.lives - 1;
        const newFailed = [...prev.failedSentences, { sentence: prev.currentSentence, placedWords: prev.placedWords }];
        if (newLives <= 0) {
          return {
            ...prev,
            showFeedback: 'incorrect',
            streak: 0,
            lives: 0,
            isGameOver: true,
            failedSentences: newFailed,
            explodingWord: explosionPos,
            screenShake: true,
          };
        }
        return {
          ...prev,
          showFeedback: 'incorrect',
          streak: 0,
          lives: newLives,
          failedSentences: newFailed,
          explodingWord: explosionPos,
          screenShake: true,
        };
      }

      const isCorrect = word.position === slotIndex + 1;

      if (isCorrect) {
        playDing();
        const newPlacedWords = [...prev.placedWords];
        newPlacedWords[slotIndex] = word;

        const newShuffledWords = prev.shuffledWords.filter(
          w => !(w.word === word.word && w.position === word.position)
        );

        const realWordsRemaining = newShuffledWords.filter(w => !w.isDistractor);

        if (realWordsRemaining.length === 0) {
          const newScore = prev.score + 50 * (prev.streak + 1);

          if (newScore > highScore) {
            localStorage.setItem(`satzsplitter-highscore-${level}`, newScore.toString());
            setHighScore(newScore);
          }

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
                showHint: false,
                correctSlotIndex: null,
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
            correctSlotIndex: slotIndex,
          };
        }

        return {
          ...prev,
          placedWords: newPlacedWords,
          shuffledWords: newShuffledWords,
          showFeedback: 'correct',
          correctSlotIndex: slotIndex,
        };
      } else {
        playWrong();
        const newLives = prev.lives - 1;
        if (newLives <= 0) {
          return {
            ...prev,
            showFeedback: 'incorrect',
            streak: 0,
            lives: 0,
            isGameOver: true,
            explodingWord: explosionPos,
            screenShake: true,
          };
        }
        return {
          ...prev,
          showFeedback: 'incorrect',
          streak: 0,
          lives: newLives,
          explodingWord: explosionPos,
          screenShake: true,
        };
      }
    });
  }, [highScore, level, levelInfo.timeLimit, getSlotExplosionPos, playDing, playWrong]);

  const handleRestart = useCallback(() => {
    setGameState(initializeGame());
  }, [initializeGame]);

  return (
    <div
      className={`h-screen flex flex-col bg-[image:var(--gradient-game-bg)] relative overflow-hidden select-none ${gameState.screenShake ? 'screen-shake-active' : ''}`}
    >
      {/* Red splash overlay on wrong (same as Artikel-Drop) */}
      <AnimatePresence>
        {gameState.showFeedback === 'incorrect' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }}
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div
              className="splash-overlay-active w-[min(120vmax,800px)] h-[min(120vmax,800px)] rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(0 85% 55% / 0.5) 0%, hsl(0 75% 55% / 0.2) 40%, transparent 70%)',
              }}
            />
          </motion.div>
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
              <p className="text-muted-foreground mb-6">Game is paused</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTogglePause}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-primary-foreground font-semibold text-lg"
              >
                Resume
              </motion.button>
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
      <div ref={gameAreaRef} className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-8 relative">
        {/* Wrong-placement explosion (same as Artikel-Drop) */}
        {gameState.explodingWord && (
          <WrongAnswerExplosion
            word={gameState.explodingWord}
            centerX={gameState.explodingWord.centerX}
            centerY={gameState.explodingWord.centerY}
            noWordGlow
          />
        )}

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
            {gameState.currentSentence.hint && !gameState.showHint && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameState(prev => ({ ...prev, showHint: true }))}
                className="mt-3 px-4 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground text-sm font-medium transition-colors"
              >
                💡 Show Hint
              </motion.button>
            )}
            {gameState.currentSentence.hint && gameState.showHint && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-muted-foreground mt-3 italic bg-secondary/30 px-4 py-2 rounded-lg"
              >
                💡 {gameState.currentSentence.hint}
              </motion.p>
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
            correctSlotIndex={gameState.correctSlotIndex}
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
            failedSentences={gameState.failedSentences}
            onRestart={handleRestart}
            onBackToMenu={onBackToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
