import { motion } from 'framer-motion';
import { Heart, Trophy, Flame, Pause, Play, ArrowLeft, Timer } from 'lucide-react';
import { Level, LEVEL_INFO } from '@/data/wordDatabase';

interface SatzGameStatsProps {
  level: Level;
  score: number;
  lives: number;
  streak: number;
  timeLeft: number;
  maxTime: number;
  isPaused: boolean;
  onBack: () => void;
  onTogglePause: () => void;
}

export const SatzGameStats = ({
  level,
  score,
  lives,
  streak,
  timeLeft,
  maxTime,
  isPaused,
  onBack,
  onTogglePause,
}: SatzGameStatsProps) => {
  const levelInfo = LEVEL_INFO[level];
  const timerProgress = (timeLeft / maxTime) * 100;
  const isLowTime = timeLeft <= 5;

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
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 leading-none mb-1">Satz-Splitter</span>
            <span className={`text-sm font-black bg-gradient-to-r ${levelInfo.color} bg-clip-text text-transparent leading-none`}>
              {levelInfo.name}
            </span>
          </div>
        </div>

        {/* Center: Stats Group */}
        <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 px-2 py-1.5 sm:px-6 sm:py-2 gap-3 sm:gap-8">
          {/* Score */}
          <div className="flex flex-col items-center min-w-[40px] sm:min-w-[60px]">
            <div className="flex items-center gap-1 text-muted-foreground/60 mb-0.5">
              <Trophy className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Score</span>
            </div>
            <div className="text-base sm:text-xl font-black font-['JetBrains_Mono'] text-foreground tabular-nums leading-none">
              {score}
            </div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Circular Timer */}
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
            <svg className="w-full h-full -rotate-90 transform">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-white/10"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="40%"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="100%"
                animate={{ strokeDashoffset: `${100 - timerProgress}%` }}
                transition={{ duration: 0.5, ease: "linear" }}
                className={isLowTime ? 'text-red-500' : 'text-accent'}
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center font-['JetBrains_Mono'] font-bold text-xs sm:text-sm ${isLowTime ? 'text-red-500' : 'text-foreground'}`}>
              {timeLeft}
            </div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Streak */}
          <div className={`flex flex-col items-center min-w-[40px] sm:min-w-[60px] transition-opacity duration-300 ${streak > 0 ? 'opacity-100' : 'opacity-20'}`}>
            <div className="flex items-center gap-1 text-orange-500 mb-0.5">
              <Flame className="w-3 h-3 fill-current" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Streak</span>
            </div>
            <div className="text-base sm:text-xl font-black font-['JetBrains_Mono'] text-orange-500 tabular-nums leading-none">
              {streak}x
            </div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Lives */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-red-500 mb-0.5">
              <Heart className="w-3 h-3 fill-current" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Lives</span>
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                    i < lives ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-white/10'
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