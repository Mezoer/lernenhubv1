import { motion } from 'framer-motion';
import { Layers3, Type, Coffee, MessageCircle, Play } from 'lucide-react';

interface GameHubProps {
  onSelectArtikelDrop: () => void;
  onSelectSatzSplitter: () => void;
}

export const GameHub = ({
  onSelectArtikelDrop,
  onSelectSatzSplitter,
}: GameHubProps) => {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-game-bg)] flex flex-col items-center px-6 pt-[12vh] pb-12 select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-3 font-['JetBrains_Mono'] text-[#fff1e6]">
          Lernen Hub
        </h1>
        <p className="text-lg md:text-xl max-w-md mx-auto" style={{ color: '#A0AFB7' }}>
          Master German with fun, interactive games
        </p>
      </motion.div>

      {/* Game Cards */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl w-full auto-rows-fr">
        {/* Artikel-Drop Card */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectArtikelDrop}
          className="group relative overflow-hidden rounded-3xl p-10 md:p-12 text-left flex flex-col h-full transition-shadow duration-150 ease-out hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
          style={{
            background: 'var(--gradient-card)',
            boxShadow: 'var(--shadow-lg)',
            willChange: 'box-shadow'
          }}
        >
          <div className="relative z-10 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[hsl(var(--der-color))] via-[hsl(var(--das-color))] to-[hsl(var(--die-color))]">
              <Layers3 className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex-grow">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-['JetBrains_Mono']">
              <span className="bg-gradient-to-r from-[hsl(var(--der-color))] via-[hsl(var(--das-color))] to-[hsl(var(--die-color))] bg-clip-text text-transparent">
                Artikel-Drop
              </span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[#fffcf5] min-h-[4.5rem]">
              Catch falling words and sort them by their German article:{' '}
              <span className="text-[hsl(var(--der-color))] font-semibold">der</span>,{' '}
              <span className="text-[hsl(var(--das-color))] font-semibold">das</span>, or{' '}
              <span className="text-[hsl(var(--die-color))] font-semibold">die</span>. Train your instinct for German noun genders!
            </p>
          </div>
          <div className="mt-8 relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[#fffcf5] font-semibold text-sm high-contrast-play play-btn-glow play-btn-article bg-gradient-to-r from-[hsl(var(--der-color))]/25 via-[hsl(var(--das-color))]/25 to-[hsl(var(--die-color))]/25 border-[hsl(var(--der-color))]/50 hover:brightness-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all self-end">
            <Play className="w-5 h-5 fill-current" />
            <span>Play →</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--der-color))] via-[hsl(var(--das-color))] to-[hsl(var(--die-color))] opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </motion.button>

        {/* Satz-Splitter Card */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectSatzSplitter}
          className="group relative overflow-hidden rounded-3xl p-10 md:p-12 text-left flex flex-col h-full transition-shadow duration-150 ease-out hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
          style={{
            background: 'var(--gradient-card)',
            boxShadow: 'var(--shadow-lg)',
            willChange: 'box-shadow'
          }}
        >
          <div className="relative z-10 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-accent to-primary">
              <Type className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex-grow">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-['JetBrains_Mono']">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Satz-Splitter
              </span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[#fffcf5] min-h-[4.5rem]">
              Rebuild German sentences by dragging words into the correct positions. Master German word order!
            </p>
          </div>
          <div className="mt-8 relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[#fffcf5] font-semibold text-sm high-contrast-play play-btn-glow play-btn-satz bg-gradient-to-r from-accent/30 to-primary/30 border-accent/50 hover:brightness-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all self-end">
            <Play className="w-5 h-5 fill-current" />
            <span>Play →</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </motion.button>
      </div>

      {/* Story Section — narrower than game cards, ~60% viewport */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-24 w-full max-w-5xl story-card-container px-4"
      >
        <div className="rounded-2xl p-6 md:p-8 border border-border/30 bg-secondary/20">
          <h3 className="text-base md:text-lg font-semibold mb-3 font-['JetBrains_Mono'] bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            The Story behind Lernen Hub
          </h3>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#A0AFB7' }}>
            Hi! I'm a 15-year-old developer from Egypt. I built Lernen Hub to make German grammar fun and accessible for everyone. My goal is to keep this platform free, fast, and completely ad-free.
          </p>

          {/* Support CTA */}
          <div className="rounded-xl p-4 bg-secondary/30 border border-border/20">
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#8a969e' }}>
              Donating helps me cover domain hosting costs and ensures the game stays free of ads and in-game purchases.
            </p>
            <div className="flex gap-3">
              <a href="https://ko-fi.com/mezohehe" target="_blank" rel="noopener noreferrer" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent to-primary text-primary-foreground font-semibold text-sm"
                >
                  <Coffee className="w-4 h-4" />
                  Support on Ko-fi
                </motion.button>
              </a>
              <a href="https://discord.gg/EX4bAGKa" target="_blank" rel="noopener noreferrer" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#5865F2] text-white font-semibold text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join Discord
                </motion.button>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer spacer */}
      <div className="mt-8" />
    </div>
  );
};
