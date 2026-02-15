import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Level, Artikel, Word, getRandomWord, LEVEL_INFO } from '@/data/wordDatabase';
import { DraggableWord } from './DraggableWord';
import { ArticleZone } from './ArticleZone';
import { GameStats } from './GameStats';
import { GameOver } from './GameOver';
import { WrongAnswerExplosion } from './WrongAnswerExplosion';
import { CorrectAnswerCelebration } from './CorrectAnswerCelebration';
import { useSound } from '@/hooks/useSound';

interface GameArenaProps {
  level: Level;
  onBackToMenu: () => void;
}

interface FailedWord {
  word: Word;
  selectedArtikel: string | null;
}

interface ExplodingWord {
  word: Word;
  wrongArtikel: Artikel;
  centerX: number;
  centerY: number;
}

interface CelebratingWord {
  word: string;
  artikel: Artikel;
  centerX: number;
  centerY: number;
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
  explodingWord: ExplodingWord | null;
  celebratingWord: CelebratingWord | null;
  screenShake: boolean;
}

const ARTICLES: Artikel[] = ['der', 'das', 'die'] as const;

export const GameArena = ({ level, onBackToMenu }: GameArenaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zonesRef = useRef<Map<Artikel, DOMRect>>(new Map());
  const [containerHeight, setContainerHeight] = useState(600);
  const { playDing, playWrong } = useSound();

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
    explodingWord: null,
    celebratingWord: null,
    screenShake: false,
  }));

  const fallSpeed = LEVEL_INFO[level].speed;

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

  const handleTogglePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleCorrect = useCallback((
    artikel: Artikel,
    dropPosition?: { centerX: number; centerY: number }
  ) => {
    playDing();

    setGameState((prev) => {
      const newScore = prev.score + 10 * (prev.streak + 1);
      const newStreak = prev.streak + 1;

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
        celebratingWord: dropPosition
          ? { 
              word: prev.currentWord?.word ?? '', 
              artikel: prev.currentWord?.artikel ?? 'der',
              centerX: dropPosition.centerX, 
              centerY: dropPosition.centerY 
            }
          : null,
      };
    });

    setTimeout(() => setGameState((prev) => ({ ...prev, showScreenFlash: null })), 300);
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        celebratingWord: null,
        currentWord: getRandomWord(level),
        wordKey: uuidv4(),
        zoneResult: null,
      }));
    }, 550);
  }, [highScore, level, playDing]);

  const handleIncorrect = useCallback((
    artikel: Artikel,
    wordSnapshot: Word,
    dropPosition?: { centerX: number; centerY: number }
  ) => {
    setGameState((prev) => {
      if (!prev.currentWord) return prev;

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
        explodingWord: dropPosition
          ? { word: wordSnapshot, wrongArtikel: artikel, centerX: dropPosition.centerX, centerY: dropPosition.centerY }
          : null,
        screenShake: !!dropPosition,
      };
    });

    setTimeout(() => {
      setGameState((prev) => ({ ...prev, showScreenFlash: null }));
    }, 300);

    setTimeout(() => {
      setGameState((prev) => ({ ...prev, screenShake: false }));
    }, 200);

    setTimeout(() => {
      setGameState((prev) => {
        if (!prev.isGameOver) {
          return {
            ...prev,
            explodingWord: null,
            currentWord: getRandomWord(level),
            wordKey: uuidv4(),
            zoneResult: null,
          };
        }
        return { ...prev, explodingWord: null, zoneResult: null };
      });
    }, 650);
  }, [level]);

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

  const handleDragStart = useCallback(() => {
    updateZonePositions();
    setGameState((prev) => ({ ...prev, isDragging: true }));
  }, [updateZonePositions]);

  const handleDragEnd = useCallback((pointerPos: { x: number; y: number }, wordSnapshot: Word) => {
    const pointerX = pointerPos.x;
    const pointerY = pointerPos.y;

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
      const wordEl = document.querySelector('.word-card')?.parentElement as HTMLElement | null;
      const containerEl = containerRef.current;
      const dropPos =
        wordEl && containerEl
          ? (() => {
              const wr = wordEl.getBoundingClientRect();
              const cr = containerEl.getBoundingClientRect();
              return {
                centerX: wr.left - cr.left + wr.width / 2,
                centerY: wr.top - cr.top + wr.height / 2,
              };
            })()
          : undefined;
      if (isCorrect) {
        handleCorrect(droppedInZone, dropPos);
      } else {
        handleIncorrect(droppedInZone, wordSnapshot, dropPos);
        playWrong();
      }
    } else {
      let overlapZone: Artikel | null = null;
      const wordElement = document.querySelector(`[key="${gameState.wordKey}"]`) || document.querySelector('.word-card')?.parentElement;
      
      if (wordElement) {
        const wordRect = wordElement.getBoundingClientRect();
        const wordCenterX = wordRect.left + wordRect.width / 2;
        const wordCenterY = wordRect.top + wordRect.height / 2;

        ARTICLES.forEach((artikel) => {
          const zoneElement = document.getElementById(`zone-${artikel}`);
          if (zoneElement) {
            const rect = zoneElement.getBoundingClientRect();
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
        const wordEl = document.querySelector('.word-card')?.parentElement as HTMLElement | null;
        const containerEl = containerRef.current;
        const overlapPos =
          wordEl && containerEl
            ? (() => {
                const wr = wordEl.getBoundingClientRect();
                const cr = containerEl.getBoundingClientRect();
                return {
                  centerX: wr.left - cr.left + wr.width / 2,
                  centerY: wr.top - cr.top + wr.height / 2,
                };
              })()
            : undefined;
        if (isCorrect) {
          handleCorrect(overlapZone, overlapPos);
        } else {
          handleIncorrect(overlapZone, wordSnapshot, overlapPos);
          playWrong();
        }
      } else {
        setGameState((prev) => ({ ...prev, isDragging: false }));
      }
    }
  }, [handleCorrect, handleIncorrect, playWrong, gameState.wordKey]);

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
      explodingWord: null,
      celebratingWord: null,
      screenShake: false,
    });
  }, [level]);

  return (
    <div
      className={`h-screen flex flex-col bg-[image:var(--gradient-game-bg)] relative select-none ${gameState.screenShake ? 'screen-shake-active' : ''}`}
    >
      <AnimatePresence>
        {gameState.showScreenFlash === 'incorrect' && (
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

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
      >
        {gameState.explodingWord && (
          <WrongAnswerExplosion
            word={gameState.explodingWord.word}
            centerX={gameState.explodingWord.centerX}
            centerY={gameState.explodingWord.centerY}
          />
        )}

        {gameState.celebratingWord && gameState.celebratingWord.word && (
          <CorrectAnswerCelebration
            word={gameState.celebratingWord.word}
            artikel={gameState.celebratingWord.artikel}
            centerX={gameState.celebratingWord.centerX}
            centerY={gameState.celebratingWord.centerY}
          />
        )}

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
                  jolt={
                    gameState.zoneResult?.zone === artikel && gameState.zoneResult?.correct === false
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

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