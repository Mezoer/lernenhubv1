import { motion } from 'framer-motion';
import { Sentence, SentenceWord } from '@/data/sentenceDatabase';

interface SentenceSlotsProps {
  sentence: Sentence;
  placedWords: (SentenceWord | null)[];
  onDropWord: (word: SentenceWord, slotIndex: number) => void;
}

export const SentenceSlots = ({ sentence, placedWords, onDropWord }: SentenceSlotsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-center gap-3 max-w-4xl"
    >
      {sentence.words.map((word, index) => {
        const isPlaced = placedWords[index] !== null;
        
        return (
          <motion.div
            key={`slot-${index}`}
            id={`sentence-slot-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              borderColor: isPlaced ? 'hsl(var(--success))' : 'hsl(var(--border))',
            }}
            transition={{ delay: index * 0.05 }}
            className={`
              min-w-[80px] px-4 py-3 rounded-xl 
              border-2 border-dashed
              flex items-center justify-center
              font-['JetBrains_Mono'] text-lg
              transition-all duration-200
              ${isPlaced 
                ? 'bg-success/10 border-success text-foreground' 
                : 'bg-secondary/30 border-border text-muted-foreground/50'
              }
            `}
          >
            {isPlaced ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="font-semibold text-foreground"
              >
                {placedWords[index]?.word}
              </motion.span>
            ) : (
              <span className="text-sm">{index + 1}</span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
