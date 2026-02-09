import { motion } from 'framer-motion';
import { Layers3, Type } from 'lucide-react';

interface GameHubProps {
  onSelectArtikelDrop: () => void;
  onSelectSatzSplitter: () => void;
}

export const GameHub = ({ onSelectArtikelDrop, onSelectSatzSplitter }: GameHubProps) => {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-game-bg)] flex flex-col items-center justify-center p-6 select-none">
      {/* Header with German flag colors and glow */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-['JetBrains_Mono']">
          <motion.span 
            className="inline-block text-black drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            animate={{ 
              textShadow: [
                '0 0 10px rgba(0,0,0,0.5)',
                '0 0 20px rgba(0,0,0,0.8)',
                '0 0 10px rgba(0,0,0,0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Ler
          </motion.span>
          <motion.span 
            className="inline-block text-[hsl(45,100%,50%)] drop-shadow-[0_0_15px_rgba(255,200,0,0.6)]"
            animate={{ 
              textShadow: [
                '0 0 10px rgba(255,200,0,0.5)',
                '0 0 25px rgba(255,200,0,0.8)',
                '0 0 10px rgba(255,200,0,0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            nen
          </motion.span>
          <motion.span 
            className="inline-block text-[hsl(0,85%,45%)] drop-shadow-[0_0_15px_rgba(200,50,50,0.6)]"
            animate={{ 
              textShadow: [
                '0 0 10px rgba(200,50,50,0.5)',
                '0 0 25px rgba(200,50,50,0.8)',
                '0 0 10px rgba(200,50,50,0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            {' '}Hub
          </motion.span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          Master <span className="font-bold">
            <span className="text-black">Ger</span>
            <span className="text-[hsl(45,100%,50%)]">m</span>
            <span className="text-[hsl(0,85%,45%)]">an</span>
          </span> with fun, interactive games
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
          className="group relative overflow-hidden rounded-3xl p-8 text-left"
          style={{
            background: 'var(--gradient-card)',
            boxShadow: 'var(--shadow-lg)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {/* Gradient overlay on hover */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100"
            style={{ transition: 'opacity 0.2s ease-in-out' }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
            style={{
              boxShadow: 'inset 0 0 30px hsl(var(--primary) / 0.2), 0 0 40px hsl(var(--primary) / 0.3)',
              transition: 'opacity 0.2s ease-in-out',
            }}
          />
          
          {/* Icon */}
          <div className="relative z-10 mb-6">
            <motion.div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[hsl(var(--der-color))] via-[hsl(var(--das-color))] to-[hsl(var(--die-color))]"
              animate={{
                boxShadow: [
                  '0 0 20px hsl(var(--der-color) / 0.5)',
                  '0 0 30px hsl(var(--das-color) / 0.5)',
                  '0 0 20px hsl(var(--die-color) / 0.5)',
                  '0 0 20px hsl(var(--der-color) / 0.5)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Layers3 className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-['JetBrains_Mono']"
              animate={{
                textShadow: [
                  '0 0 0px transparent',
                  '0 0 10px hsl(var(--primary) / 0.5)',
                  '0 0 0px transparent',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Artikel-Drop
            </motion.h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Catch falling words and sort them by their German article: <span className="text-[hsl(var(--der-color))] font-semibold">der</span>, <span className="text-[hsl(var(--das-color))] font-semibold">das</span>, or <span className="text-[hsl(var(--die-color))] font-semibold">die</span>. Train your instinct for German noun genders!
            </p>
          </div>

          {/* Bottom decorative line with glow */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--der-color))] via-[hsl(var(--das-color))] to-[hsl(var(--die-color))]"
            animate={{
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                '0 0 10px hsl(var(--der-color) / 0.5)',
                '0 0 20px hsl(var(--das-color) / 0.8)',
                '0 0 10px hsl(var(--die-color) / 0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        {/* Satz-Splitter Card */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectSatzSplitter}
          className="group relative overflow-hidden rounded-3xl p-8 text-left"
          style={{
            background: 'var(--gradient-card)',
            boxShadow: 'var(--shadow-lg)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {/* Gradient overlay on hover */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100"
            style={{ transition: 'opacity 0.2s ease-in-out' }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
            style={{
              boxShadow: 'inset 0 0 30px hsl(var(--accent) / 0.2), 0 0 40px hsl(var(--accent) / 0.3)',
              transition: 'opacity 0.2s ease-in-out',
            }}
          />
          
          {/* Icon */}
          <div className="relative z-10 mb-6">
            <motion.div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-accent to-primary"
              animate={{
                boxShadow: [
                  '0 0 20px hsl(var(--accent) / 0.5)',
                  '0 0 30px hsl(var(--primary) / 0.5)',
                  '0 0 20px hsl(var(--accent) / 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Type className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-['JetBrains_Mono']"
              animate={{
                textShadow: [
                  '0 0 0px transparent',
                  '0 0 10px hsl(var(--accent) / 0.5)',
                  '0 0 0px transparent',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Satz-Splitter
            </motion.h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Rebuild German sentences by dragging words into the correct positions. Master German word order from simple clauses to complex structures!
            </p>
          </div>

          {/* Bottom decorative line with glow */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary"
            animate={{
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                '0 0 10px hsl(var(--accent) / 0.5)',
                '0 0 20px hsl(var(--primary) / 0.8)',
                '0 0 10px hsl(var(--accent) / 0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
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
