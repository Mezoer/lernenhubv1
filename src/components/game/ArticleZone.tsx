import { motion, AnimatePresence } from 'framer-motion';
import { Artikel } from '@/data/wordDatabase';

interface ArticleZoneProps {
  artikel: Artikel;
  isActive: boolean;
  isCorrect: boolean | null;
  jolt?: boolean;
}

const articleStyles: Record<Artikel, { zone: string; text: string; glowColor: string }> = {
  der: {
    zone: 'article-zone-der',
    text: 'text-der',
    glowColor: 'hsl(var(--der-glow))',
  },
  die: {
    zone: 'article-zone-die',
    text: 'text-die',
    glowColor: 'hsl(var(--die-glow))',
  },
  das: {
    zone: 'article-zone-das',
    text: 'text-das',
    glowColor: 'hsl(var(--das-glow))',
  },
};

export const ArticleZone = ({ artikel, isActive, isCorrect, jolt = false }: ArticleZoneProps) => {
  const styles = articleStyles[artikel];

  return (
    <motion.div
      className={`
        article-zone ${styles.zone}
        ${isActive ? 'article-zone-active' : ''}
        ${jolt ? 'bucket-jolt-active' : ''}
        ${isCorrect === true ? 'bucket-pulse-correct' : ''}
        flex-1 min-h-[120px] md:min-h-[140px] relative overflow-hidden
      `}
      style={
        isCorrect === true
          ? ({ '--bucket-glow': styles.glowColor } as React.CSSProperties)
          : undefined
      }
      animate={isActive ? { scale: 1.05 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Correct answer ripple effect (theme glow) */}
      <AnimatePresence>
        {isCorrect === true && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle, ${styles.glowColor} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Incorrect answer flash */}
      <AnimatePresence>
        {isCorrect === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-2xl bg-destructive/40"
          />
        )}
      </AnimatePresence>

      {/* Sparkle particles on correct */}
      <AnimatePresence>
        {isCorrect === true && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0,
                  x: '50%',
                  y: '50%',
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1,
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.5 + Math.random() * 0.3,
                  ease: 'easeOut',
                  delay: i * 0.05,
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: styles.glowColor }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="text-center relative z-10">
        <motion.span
          className={`text-4xl md:text-5xl font-bold ${styles.text}`}
          animate={
            isCorrect === true 
              ? { scale: [1, 1.2, 1] }
              : isCorrect === false
              ? { x: [0, -5, 5, -5, 5, 0] }
              : isActive 
              ? { scale: 1.1 } 
              : { scale: 1 }
          }
          transition={
            isCorrect !== null 
              ? { duration: 0.3 }
              : { type: 'spring', stiffness: 400, damping: 25 }
          }
        >
          {artikel}
        </motion.span>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider">
          {artikel === 'der' && 'Masculine'}
          {artikel === 'die' && 'Feminine'}
          {artikel === 'das' && 'Neuter'}
        </p>
      </div>
    </motion.div>
  );
};
