import { motion } from 'framer-motion';
import { SentenceWord } from '@/data/sentenceDatabase';
import { useDrag } from '@/hooks/useDrag';

interface DraggableSatzWordProps {
  word: SentenceWord;
  onDrop: (word: SentenceWord, slotIndex: number) => void;
}

export const DraggableSatzWord = ({ word, onDrop }: DraggableSatzWordProps) => {
  const { isDragging, position, handleMouseDown, handleTouchStart } = useDrag();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isDragging ? 1.1 : 1,
        x: position.x,
        y: position.y,
        zIndex: isDragging ? 100 : 1,
      }}
      whileHover={{ scale: 1.05 }}
      onMouseDown={(e) => handleMouseDown(e, word, onDrop)}
      onTouchStart={(e) => handleTouchStart(e, word, onDrop)}
      className={`
        px-4 py-2 rounded-xl cursor-grab active:cursor-grabbing select-none
        font-['JetBrains_Mono'] font-semibold text-lg
        ${isDragging 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
          : 'bg-card border border-border hover:border-primary/50'
        }
        transition-colors
      `}
      style={{ touchAction: 'none' }}
    >
      {word.word}
    </motion.div>
  );
};
