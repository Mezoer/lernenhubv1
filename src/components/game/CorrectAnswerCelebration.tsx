import { useMemo } from 'react';
import { Artikel } from '@/data/wordDatabase';

const PARTICLE_COUNT = 8;

const articleColors: Record<Artikel, string> = {
  der: 'hsl(210, 90%, 65%)',
  die: 'hsl(340, 85%, 70%)',
  das: 'hsl(145, 70%, 55%)',
};

interface CorrectAnswerCelebrationProps {
  word: string;
  artikel: Artikel;
  centerX: number;
  centerY: number;
}

/** Purely visual: word scale/fade + gender-matched sparkles floating upward. */
export const CorrectAnswerCelebration = ({ word, artikel, centerX, centerY }: CorrectAnswerCelebrationProps) => {
  const particles = useMemo(() => {
    const baseColor = articleColors[artikel];
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const cx = (Math.random() - 0.5) * 60;
      const cy = -60 - Math.random() * 60;
      const size = 5 + Math.random() * 8;
      const delay = i * 0.03 + Math.random() * 0.02;
      return { cx, cy, size, delay, color: baseColor };
    });
  }, [artikel]);

  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: centerX,
        top: centerY,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="correct-word-fade absolute font-['JetBrains_Mono'] text-2xl md:text-3xl font-bold whitespace-nowrap"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          color: articleColors[artikel],
          textShadow: `0 0 20px ${articleColors[artikel]}`,
        }}
      >
        {word}
      </div>

      {particles.map((p, i) => (
        <div
          key={i}
          className="correct-particle-up absolute rounded-full"
          style={{
            '--cx': `${p.cx}px`,
            '--cy': `${p.cy}px`,
            left: 0,
            top: 0,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
