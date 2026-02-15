import { motion } from 'framer-motion';
import { Heart, Trophy, Flame, Pause, Play, ArrowLeft } from 'lucide-react';
import { Level, LEVEL_INFO } from '@/data/wordDatabase';

interface GameStatsProps {
  level: Level;
  score: number;
  lives: number;
  streak: number;
  isPaused: boolean;
  onBack: () => void;
  onTogglePause: () => void;
}

export const GameStats = ({
  level,
  score,
  lives,
  streak,
  isPaused,
  onBack,
  onTogglePause,
}: GameStatsProps) => {
  const levelInfo = LEVEL_INFO[level];

  return (
    <div className="w-full bg-background/40 backdrop-blur-md border-b border-white/10 px-3 py-2 sm:px-6 sm:py-3 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Back & Level */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground active:scale-90"
            aria-label="Back to menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 leading-none mb-1">Level</span>
            <span className={`text-sm font-black bg-gradient-to-r ${levelInfo.color} bg-clip-text text-transparent leading-none`}>
              {levelInfo.name}
            </span>
          </div>
        </div>

        {/* Center: Stats Group */}
        <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 px-3 py-1.5 sm:px-6 sm:py-2 gap-4 sm:gap-8">
          {/* Score */}
          <div className="flex flex-col items-center min-w-[45px] sm:min-w-[60px]">
            <div className="flex items-center gap-1 text-muted-foreground/60 mb-0.5">
              <Trophy className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Score</span>
            </div>
            <motion.div 
              key={score}
              initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
              animate={{ scale: 1, color: 'white' }}
              className="text-base sm:text-xl font-black font-['JetBrains_Mono'] tabular-nums leading-none"
            >
              {score}
            </motion.div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Streak - Always visible, dims when 0 */}
          <div className={`flex flex-col items-center min-w-[45px] sm:min-w-[60px] transition-opacity duration-300 ${streak > 0 ? 'opacity-100' : 'opacity-20'}`}>
            <div className="flex items-center gap-1 text-orange-500 mb-0.5">
              <Flame className="w-3 h-3 fill-current" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Streak</span>
            </div>
            <motion.div 
              key={streak}
              initial={streak > 0 ? { scale: 1.3 } : {}}
              animate={{ scale: 1 }}
              className="text-base sm:text-xl font-black font-['JetBrains_Mono'] text-orange-500 tabular-nums leading-none"
            >
              {streak}x
            </motion.div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Lives - Always visible */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-red-500 mb-0.5">
              <Heart className="w-3 h-3 fill-current" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Lives</span>
            </div>
            <div className="flex gap-1 sm:gap-1.5">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < lives ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.2 }}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                    i < lives ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pause */}
        <button
          onClick={onTogglePause}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 border border-white/10"
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-emerald-500 fill-current" />
          ) : (
            <Pause className="w-5 h-5 text-foreground fill-current" />
          )}
        </button>
      </div>
    </div>
  );
};