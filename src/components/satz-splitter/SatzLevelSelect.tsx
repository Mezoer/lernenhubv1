import { motion } from 'framer-motion';
import { Level } from '@/data/wordDatabase';
import { SENTENCE_LEVEL_INFO } from '@/data/sentenceDatabase';
import { ArrowLeft, Timer } from 'lucide-react';
import { KofiFooter } from '@/components/hub/KofiFooter';

interface SatzLevelSelectProps {
  onSelectLevel: (level: Level) => void;
  onBack?: () => void;
}

const levels: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const SatzLevelSelect = ({ onSelectLevel, onBack }: SatzLevelSelectProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[image:var(--gradient-game-bg)] relative">
      {/* Back Button */}
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent font-['JetBrains_Mono']">
          Satz-Splitter
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          Rebuild German sentences with correct word order
        </p>
      </motion.div>

      {/* Level Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl w-full"
      >
        {levels.map((level) => {
          const info = SENTENCE_LEVEL_INFO[level];
          return (
            <motion.button
              key={level}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLevel(level)}
              className="level-card group text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    {info.name}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {info.description}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Timer className="w-3 h-3" />
                  <span>Time: {info.timeLimit}s</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-sm text-muted-foreground"
      >
        Word order gets more complex at higher levels!
      </motion.p>

      <KofiFooter />
    </div>
  );
};
