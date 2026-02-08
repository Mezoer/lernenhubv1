import { motion } from 'framer-motion';
import { Layers3, Type } from 'lucide-react';

interface GameHubProps {
  onSelectArtikelDrop: () => void;
  onSelectSatzSplitter: () => void;
}

export const GameHub = ({ onSelectArtikelDrop, onSelectSatzSplitter }: GameHubProps) => {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-game-bg)] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 font-['JetBrains_Mono']">
          Lernen Hub
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          Master German with fun, interactive games
        </p>
      </motion.div>

      {/* Game Cards */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl w-full">
        {/* Artikel-Drop Card */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectArtikelDrop}
          className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-300"
          style={{
            background: 'var(--gradient-card)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Icon */}
          <div className="relative z-10 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[hsl(var(--der-color))] via-[hsl(var(--das-color))] to-[hsl(var(--die-color))]">
              <Layers3 className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-['JetBrains_Mono']">
              Artikel-Drop
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Catch falling words and sort them by their German article: <span className="text-[hsl(var(--der-color))]">der</span>, <span className="text-[hsl(var(--das-color))]">das</span>, or <span className="text-[hsl(var(--die-color))]">die</span>. Train your instinct for German noun genders!
            </p>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--der-color))] via-[hsl(var(--das-color))] to-[hsl(var(--die-color))] opacity-50 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        {/* Satz-Splitter Card */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectSatzSplitter}
          className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-300"
          style={{
            background: 'var(--gradient-card)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Icon */}
          <div className="relative z-10 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-accent to-primary">
              <Type className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-['JetBrains_Mono']">
              Satz-Splitter
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Rebuild German sentences by dragging words into the correct positions. Master German word order from simple clauses to complex structures!
            </p>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 text-sm text-muted-foreground/60"
      >
        Select a game to begin
      </motion.p>
    </div>
  );
};
