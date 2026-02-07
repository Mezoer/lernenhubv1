import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Level } from '@/data/wordDatabase';
import { LevelSelect, GameArena } from '@/components/game';

type GameScreen = 'menu' | 'playing';

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setScreen('playing');
  };

  const handleBackToMenu = () => {
    setScreen('menu');
    setSelectedLevel(null);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <LevelSelect onSelectLevel={handleSelectLevel} />
          </motion.div>
        )}

        {screen === 'playing' && selectedLevel && (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            <GameArena level={selectedLevel} onBackToMenu={handleBackToMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
