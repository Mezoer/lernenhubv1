import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Level, Artikel, Word, getRandomWord, LEVEL_INFO } from '@/data/wordDatabase';
import { DraggableWord } from './DraggableWord';
import { ArticleZone } from './ArticleZone';
import { GameStats } from './GameStats';
import { GameOver } from './GameOver';

interface GameArenaProps {
  level: Level;
  onBackToMenu: () => void;
}

interface FailedWord {
  word: Word;
  selectedArtikel: string | null;
}

interface GameState {
  currentWord: Word | null;
  wordKey: string;
  score: number;
  lives: number;
  streak: number;
  isGameOver: boolean;
  isDragging: boolean;
  isPaused: boolean;
  activeZone: Artikel | null;
  zoneResult: { zone: Artikel; correct: boolean } | null;
  showScreenFlash: 'correct' | 'incorrect' | null;
  failedWords: FailedWord[];
}

const ARTICLES: Artikel[] = ['der', 'das', 'die'] as const; // das in middle as neutral

export const GameArena = ({ level, onBackToMenu }: GameArenaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zonesRef = useRef<Map<Artikel, DOMRect>>(new Map());
  const [containerHeight, setContainerHeight] = useState(600);
  
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(`artikeldrop-highscore-${level}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [gameState, setGameState] = useState<GameState>(() => ({
    currentWord: getRandomWord(level),
    wordKey: uuidv4(),
    score: 0,
    lives: 3,
    streak: 0,
    isGameOver: false,
    isDragging: false,
    isPaused: false,
    activeZone: null,
    zoneResult: null,
    showScreenFlash: null,
    failedWords: [],
  }));

  const fallSpeed = LEVEL_INFO[level].speed;

  // Update container height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Update zone positions
  const updateZonePositions = useCallback(() => {
    ARTICLES.forEach((artikel) => {
      const element = document.getElementById(`zone-${artikel}`);
      if (element) {
        zonesRef.current.set(artikel, element.getBoundingClientRect());
      }
    });
  }, []);

  useEffect(() => {
    updateZonePositions();
    window.addEventListener('resize', updateZonePositions);
    return () => window.removeEventListener('resize', updateZonePositions);
  }, [updateZonePositions]);

  // Toggle pause
  const handleTogglePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Spawn new word with fresh key (fixes teleport bug)
  const spawnNewWord = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentWord: getRandomWord(level),
      wordKey: uuidv4(), // New key forces complete remount
      isDragging: false,
      activeZone: null,
      zoneResult: null,
    }));
  }, [level]);

  // Handle correct answer
  const handleCorrect = useCallback((artikel: Artikel) => {
    setGameState((prev) => {
      const newScore = prev.score + 10 * (prev.streak + 1);
      const newStreak = prev.streak + 1;
      
      // Save high score
      if (newScore > highScore) {
        localStorage.setItem(`artikeldrop-highscore-${level}`, newScore.toString());
        setHighScore(newScore);
      }

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        currentWord: null,
        zoneResult: { zone: artikel, correct: true },
        showScreenFlash: 'correct',
      };
    });

    // Clear flash effect
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, showScreenFlash: null }));
    }, 300);

    // Spawn new word after animation
    setTimeout(spawnNewWord, 500);
  }, [highScore, level, spawnNewWord]);

  // Handle incorrect answer
  const handleIncorrect = useCallback((artikel: Artikel, wordSnapshot: Word) => {
    setGameState((prev) => {
      const newLives = prev.lives - 1;
      const newFailedWords = [...prev.failedWords, { word: wordSnapshot, selectedArtikel: artikel }];
      
      return {
        ...prev,
        lives: newLives,
        streak: 0,
        currentWord: null,
        zoneResult: { zone: artikel, correct: false },
        showScreenFlash: 'incorrect',
        isGameOver: newLives <= 0,
        failedWords: newFailedWords,
      };
    });

    // Clear flash effect
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, showScreenFlash: null }));
    }, 400);

    // Spawn new word if not game over
    setTimeout(() => {
      setGameState((prev) => {
        if (!prev.isGameOver) {
          return {
            ...prev,
            currentWord: getRandomWord(level),
            wordKey: uuidv4(),
            zoneResult: null,
          };
        }
        return prev;
      });
    }, 600);
  }, [level]);

  // Handle floor hit (word missed)
  const handleHitFloor = useCallback(() => {
    if (gameState.isDragging || gameState.isPaused) return;
    
    setGameState((prev) => {
      if (!prev.currentWord) return prev;
      
      const newLives = prev.lives - 1;
      const newFailedWords = [...prev.failedWords, { word: prev.currentWord, selectedArtikel: null }];
      
      return {
        ...prev,
        lives: newLives,
        streak: 0,
        currentWord: null,
        showScreenFlash: 'incorrect',
        isGameOver: newLives <= 0,
        failedWords: newFailedWords,
      };
    });

    // Clear flash effect
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, showScreenFlash: null }));
    }, 400);

    setTimeout(() => {
      setGameState((prev) => {
        if (!prev.isGameOver) {
          return {
            ...prev,
            currentWord: getRandomWord(level),
            wordKey: uuidv4(),
          };
        }
        return prev;
      });
    }, 400);
  }, [gameState.isDragging, gameState.isPaused, level]);

  // Drag handlers
  const handleDragStart = useCallback(() => {
    updateZonePositions();
    setGameState((prev) => ({ ...prev, isDragging: true }));
  }, [updateZonePositions]);

  const handleDragEnd = useCallback((pointerPos: { x: number; y: number }, wordSnapshot: Word) => {
    const pointerX = pointerPos.x;
    const pointerY = pointerPos.y;

    // Check which zone the pointer is over
    let droppedInZone: Artikel | null = null;
    
    ARTICLES.forEach((artikel) => {
      const zoneElement = document.getElementById(`zone-${artikel}`);
      if (zoneElement) {
        const rect = zoneElement.getBoundingClientRect();
        if (
          pointerX >= rect.left &&
          pointerX <= rect.right &&
          pointerY >= rect.top &&
          pointerY <= rect.bottom
        ) {
          droppedInZone = artikel;
        }
      }
    });

    if (droppedInZone) {
      const isCorrect = droppedInZone === wordSnapshot.artikel;
      if (isCorrect) {
        handleCorrect(droppedInZone);
      } else {
        handleIncorrect(droppedInZone, wordSnapshot);
      }
    } else {
      // Check if word is physically overlapping a zone even if pointer isn't
      // This helps with "missed" glitches on fast movements
      let overlapZone: Artikel | null = null;
      const wordElement = document.querySelector(`[key="${wordKey}"]`) || document.querySelector('.word-card')?.parentElement;
      
      if (wordElement) {
        const wordRect = wordElement.getBoundingClientRect();
        const wordCenterX = wordRect.left + wordRect.width / 2;
        const wordCenterY = wordRect.top + wordRect.height / 2;

        ARTICLES.forEach((artikel) => {
          const zoneElement = document.getElementById(`zone-${artikel}`);
          if (zoneElement) {
            const rect = zoneElement.getBoundingClientRect();
            // Larger detection area for the word itself
            if (
              wordCenterX >= rect.left - 20 &&
              wordCenterX <= rect.right + 20 &&
              wordCenterY >= rect.top - 20 &&
              wordCenterY <= rect.bottom + 20
            ) {
              overlapZone = artikel;
            }
          }
        });
      }

      if (overlapZone) {
        const isCorrect = overlapZone === wordSnapshot.artikel;
        if (isCorrect) {
          handleCorrect(overlapZone);
        } else {
          handleIncorrect(overlapZone, wordSnapshot);
        }
      } else {
        setGameState((prev) => ({ ...prev, isDragging: false }));
      }
    }
  }, [handleCorrect, handleIncorrect]);

  // Restart game
  const handleRestart = useCallback(() => {
    setGameState({
      currentWord: getRandomWord(level),
      wordKey: uuidv4(),
      score: 0,
      lives: 3,
      streak: 0,
      isGameOver: false,
      isDragging: false,
      isPaused: false,
      activeZone: null,
      zoneResult: null,
      showScreenFlash: null,
      failedWords: [],
    });
  }, [level]);

  return (
    <div className="h-screen flex flex-col bg-[image:var(--gradient-game-bg)] relative select-none">
      {/* Screen flash effects */}
      <AnimatePresence>
        {gameState.showScreenFlash === 'incorrect' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-50 pointer-events-none bg-destructive/20"
          />
        )}
        {gameState.showScreenFlash === 'correct' && (
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

      <GameStats
        level={level}
        score={gameState.score}
        lives={gameState.lives}
        streak={gameState.streak}
        isPaused={gameState.isPaused}
        onBack={onBackToMenu}
        onTogglePause={handleTogglePause}
      />

      {/* Game Area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
      >
        {/* Falling Word */}
        <AnimatePresence mode="wait">
          {gameState.currentWord && !gameState.isGameOver && (
            <DraggableWord
              key={gameState.wordKey}
              word={gameState.currentWord}
              wordKey={gameState.wordKey}
              containerRef={containerRef}
              fallSpeed={fallSpeed}
              isDragging={gameState.isDragging}
              isPaused={gameState.isPaused}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onHitFloor={handleHitFloor}
              gameHeight={containerHeight}
            />
          )}
        </AnimatePresence>

        {/* Article Zones */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex gap-3 md:gap-4 max-w-4xl mx-auto">
            {ARTICLES.map((artikel) => (
              <div
                key={artikel}
                id={`zone-${artikel}`}
                className="flex-1"
              >
                <ArticleZone
                  artikel={artikel}
                  isActive={gameState.activeZone === artikel}
                  isCorrect={
                    gameState.zoneResult?.zone === artikel
                      ? gameState.zoneResult.correct
                      : null
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameState.isGameOver && (
          <GameOver
            score={gameState.score}
            level={level}
            highScore={highScore}
            failedWords={gameState.failedWords}
            onRestart={handleRestart}
            onBackToMenu={onBackToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
