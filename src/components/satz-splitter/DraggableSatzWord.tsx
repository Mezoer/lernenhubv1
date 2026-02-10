import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SentenceWord } from '@/data/sentenceDatabase';

interface DraggableSatzWordProps {
  word: SentenceWord;
  onDrop: (word: SentenceWord, slotIndex: number) => void;
}

const findSlotUnderPoint = (clientX: number, clientY: number): number | null => {
  const slots = document.querySelectorAll('[id^="sentence-slot-"]');
  for (let i = 0; i < slots.length; i++) {
    const rect = slots[i].getBoundingClientRect();
    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
      return i;
    }
  }
  return null;
};

export const DraggableSatzWord = ({ word, onDrop }: DraggableSatzWordProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleDragEnd = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const slotIndex = findSlotUnderPoint(centerX, centerY);
    if (slotIndex !== null) {
      onDrop(word, slotIndex);
    }
  }, [word, onDrop]);

  return (
    <motion.div
      ref={ref}
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      className="px-4 py-2 rounded-xl cursor-grab active:cursor-grabbing select-none
        font-['JetBrains_Mono'] font-semibold text-lg
        bg-card border border-border hover:border-primary/50
        transition-colors"
      style={{ touchAction: 'none' }}
    >
      {word.word}
    </motion.div>
  );
};
