import { useMemo } from 'react';

const PARTICLE_COUNT = 6;
const GOLD = 'hsl(45 90% 60%)';
const WHITE = 'hsl(45 20% 98%)';

interface CorrectAnswerCelebrationProps {
  word: string;
  centerX: number;
  centerY: number;
}

/** Purely visual: word scale/fade + golden/white sparkles floating upward. */
export const CorrectAnswerCelebration = ({ word, centerX, centerY }: CorrectAnswerCelebrationProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const cx = (Math.random() - 0.5) * 40;
      const cy = -50 - Math.random() * 50;
      const size = 4 + Math.random() * 6;
      const delay = i * 0.04 + Math.random() * 0.03;
      const color = Math.random() > 0.5 ? GOLD : WHITE;
      return { cx, cy, size, delay, color };
    });
  }, []);

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
        className="correct-word-fade absolute font-['JetBrains_Mono'] text-2xl md:text-3xl font-bold whitespace-nowrap text-primary"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          textShadow: '0 0 16px hsl(var(--primary) / 0.8)',
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
            boxShadow: `0 0 8px ${p.color}`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
