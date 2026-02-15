import { useMemo } from 'react';
import { Artikel } from '@/data/wordDatabase';

const PARTICLE_COUNT = 12;

const articleColors: Record<Artikel, string> = {
  der: 'hsl(210, 100%, 65%)', // Vibrant Blue
  die: 'hsl(340, 95%, 70%)',  // Vibrant Pink
  das: 'hsl(145, 85%, 55%)',  // Vibrant Green
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
      const cx = (Math.random() - 0.5) * 80;
      const cy = -80 - Math.random() * 100;
      const size = 4 + Math.random() * 10;
      const delay = i * 0.02 + Math.random() * 0.05;
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
        className="correct-word-fade absolute font-['JetBrains_Mono'] text-3xl md:text-4xl font-bold whitespace-nowrap"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          color: articleColors[artikel],
          textShadow: `0 0 25px ${articleColors[artikel]}, 0 0 10px white`,
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
            boxShadow: `0 0 15px ${p.color}`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};