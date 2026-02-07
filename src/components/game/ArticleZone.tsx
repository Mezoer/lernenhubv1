import { motion } from 'framer-motion';
import { Artikel } from '@/data/wordDatabase';

interface ArticleZoneProps {
  artikel: Artikel;
  isActive: boolean;
  isCorrect: boolean | null;
}

const articleStyles: Record<Artikel, { zone: string; text: string; gradient: string }> = {
  der: {
    zone: 'article-zone-der',
    text: 'text-der',
    gradient: 'from-der/30 to-der/10',
  },
  die: {
    zone: 'article-zone-die',
    text: 'text-die',
    gradient: 'from-die/30 to-die/10',
  },
  das: {
    zone: 'article-zone-das',
    text: 'text-das',
    gradient: 'from-das/30 to-das/10',
  },
};

export const ArticleZone = ({ artikel, isActive, isCorrect }: ArticleZoneProps) => {
  const styles = articleStyles[artikel];

  return (
    <motion.div
      className={`
        article-zone ${styles.zone}
        ${isActive ? 'article-zone-active' : ''}
        ${isCorrect === true ? 'feedback-correct' : ''}
        ${isCorrect === false ? 'feedback-incorrect' : ''}
        flex-1 min-h-[120px] md:min-h-[140px]
      `}
      animate={isActive ? { scale: 1.05 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="text-center">
        <motion.span
          className={`text-4xl md:text-5xl font-bold ${styles.text}`}
          animate={isActive ? { scale: 1.1 } : { scale: 1 }}
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
