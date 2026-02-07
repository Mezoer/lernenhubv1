import { motion } from 'framer-motion';
import { Level, LEVEL_INFO } from '@/data/wordDatabase';
import { Zap } from 'lucide-react';
interface LevelSelectProps {
  onSelectLevel: (level: Level) => void;
}
const levels: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const container = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const item = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0
  }
};
export const LevelSelect = ({
  onSelectLevel
}: LevelSelectProps) => {
  return <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Header */}
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
          ArtikelDrop
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          Master German articles by dragging words to <span className="text-der font-semibold">der</span>,{' '}
          <span className="font-semibold text-[#22c365]">d</span>, or{' '}
          <span className="font-semibold text-[#f0427c]">die</span>
        </p>
      </motion.div>

      {/* Level Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl w-full">
        {levels.map(level => {
        const info = LEVEL_INFO[level];
        return <motion.button key={level} variants={item} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.98
        }} onClick={() => onSelectLevel(level)} className="level-card group text-left">
              <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                    {info.name}
                  </span>
                  
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {info.description}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>Speed: {info.speed.toFixed(1)}x</span>
                </div>
              </div>
            </motion.button>;
      })}
      </motion.div>

      {/* Footer hint */}
      <motion.p initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.8
    }} className="mt-12 text-sm text-muted-foreground">
        
        
        Vocabulary gets harder with each level       
             
             
      </motion.p>
    </div>;
};