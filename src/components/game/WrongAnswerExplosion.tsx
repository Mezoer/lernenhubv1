import { useMemo } from 'react';

const PARTICLE_COUNT = 6;
const ERROR_RED = 'hsl(0 85% 55%)';

interface WrongAnswerExplosionProps {
  /** Word text to display (Word from wordDatabase or SentenceWord.word from Satz-Splitter). */
  word: { word: string };
  centerX: number;
  centerY: number;
  /** When true (e.g. Satz-Splitter), no red glow on the word. */
  noWordGlow?: boolean;
}

/** Purely visual: word scale/fade + 5–6 particle circles flying out. No collision logic. */
export const WrongAnswerExplosion = ({ word, centerX, centerY, noWordGlow = false }: WrongAnswerExplosionProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 50 + Math.random() * 40;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;
      const size = 6 + Math.random() * 6;
      const delay = 0.15 + i * 0.03 + Math.random() * 0.02;
      return { px, py, size, delay };
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
      {/* Word: scale 1.2x, turn error red, then fade out */}
      <div
        className="wrong-word-shatter absolute font-['JetBrains_Mono'] text-2xl md:text-3xl font-bold whitespace-nowrap"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          ...(noWordGlow ? {} : { textShadow: '0 0 12px hsl(0 85% 55% / 0.8)' }),
        }}
      >
        {word.word}
      </div>

      {/* Particles: small circles flying outward (purely visual) */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="wrong-particle absolute rounded-full"
          style={{
            '--px': `${p.px}px`,
            '--py': `${p.py}px`,
            left: 0,
            top: 0,
            width: p.size,
            height: p.size,
            backgroundColor: ERROR_RED,
            boxShadow: `0 0 8px ${ERROR_RED}`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
