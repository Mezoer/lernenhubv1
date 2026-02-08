import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Level } from '@/data/wordDatabase';
import { LevelSelect, GameArena } from '@/components/game';
import { SatzSplitterArena } from '@/components/satz-splitter/SatzSplitterArena';
import { SatzLevelSelect } from '@/components/satz-splitter/SatzLevelSelect';
import { GameHub } from '@/components/hub/GameHub';

type GameScreen = 'hub' | 'artikel-menu' | 'artikel-playing' | 'satz-menu' | 'satz-playing';

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('hub');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const handleSelectArtikelGame = () => {
    setScreen('artikel-menu');
  };

  const handleSelectSatzGame = () => {
    setScreen('satz-menu');
  };

  const handleSelectArtikelLevel = (level: Level) => {
    setSelectedLevel(level);
    setScreen('artikel-playing');
  };

  const handleSelectSatzLevel = (level: Level) => {
    setSelectedLevel(level);
    setScreen('satz-playing');
  };

  const handleBackToHub = () => {
    setScreen('hub');
    setSelectedLevel(null);
  };

  const handleBackToArtikelMenu = () => {
    setScreen('artikel-menu');
    setSelectedLevel(null);
  };

  const handleBackToSatzMenu = () => {
    setScreen('satz-menu');
    setSelectedLevel(null);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'hub' && (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GameHub
              onSelectArtikelDrop={handleSelectArtikelGame}
              onSelectSatzSplitter={handleSelectSatzGame}
            />
          </motion.div>
        )}

        {screen === 'artikel-menu' && (
          <motion.div
            key="artikel-menu"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <LevelSelect onSelectLevel={handleSelectArtikelLevel} onBack={handleBackToHub} />
          </motion.div>
        )}

        {screen === 'artikel-playing' && selectedLevel && (
          <motion.div
            key="artikel-game"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            <GameArena level={selectedLevel} onBackToMenu={handleBackToArtikelMenu} />
          </motion.div>
        )}

        {screen === 'satz-menu' && (
          <motion.div
            key="satz-menu"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <SatzLevelSelect onSelectLevel={handleSelectSatzLevel} onBack={handleBackToHub} />
          </motion.div>
        )}

        {screen === 'satz-playing' && selectedLevel && (
          <motion.div
            key="satz-game"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            <SatzSplitterArena level={selectedLevel} onBackToMenu={handleBackToSatzMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
