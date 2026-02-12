import { useRef, useEffect, useCallback } from 'react';
import { Word } from '@/data/wordDatabase';

type PointInfo = { x: number; y: number };

interface DraggableWordProps {
  word: Word;
  wordKey: string;
  containerRef: React.RefObject<HTMLDivElement>;
  fallSpeed: number;
  isDragging: boolean;
  isPaused: boolean;
  onDragStart: () => void;
  onDragEnd: (pointerPos: PointInfo, wordSnapshot: Word) => void;
  onHitFloor: () => void;
  gameHeight: number;
}

export const DraggableWord = ({
  word,
  wordKey,
  fallSpeed,
  isPaused,
  onDragStart,
  onDragEnd,
  onHitFloor,
  gameHeight,
}: DraggableWordProps) => {
  const elRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Position state stored in refs for direct DOM manipulation — no React rerenders
  const posRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const mountedRef = useRef(true);

  const floorY = gameHeight - 200;

  // Apply transform directly to DOM — bypasses all animation libraries
  const applyTransform = useCallback(() => {
    if (!elRef.current) return;
    const { x, y } = posRef.current;
    const tilt = tiltRef.current;
    const scale = draggingRef.current ? 1.1 : 1;
    elRef.current.style.transform = `translate(-50%, 0) translate(${x}px, ${y}px) rotate(${tilt}deg) scale(${scale})`;
  }, []);

  // Gravity loop
  useEffect(() => {
    mountedRef.current = true;
    const animate = (currentTime: number) => {
      if (!mountedRef.current) return;

      if (draggingRef.current || isPaused) {
        lastTimeRef.current = currentTime;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      const clampedDelta = Math.min(deltaTime, 0.1);

      posRef.current.y += fallSpeed * 120 * clampedDelta;

      if (posRef.current.y >= floorY) {
        posRef.current.y = floorY;
        applyTransform();
        onHitFloor();
        return;
      }

      // Decay tilt when not dragging
      tiltRef.current *= 0.9;
      if (Math.abs(tiltRef.current) < 0.5) tiltRef.current = 0;

      applyTransform();
      animationRef.current = requestAnimationFrame(animate);
    };

    const startDelay = setTimeout(() => {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(startDelay);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, fallSpeed, floorY, applyTransform, onHitFloor]);

  // Pointer handlers via window
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      posStartRef.current = { x: posRef.current.x, y: posRef.current.y };
      lastPointerXRef.current = e.clientX;
      tiltRef.current = 0;
      applyTransform();
      onDragStart();
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      posRef.current.x = posStartRef.current.x + dx;
      posRef.current.y = posStartRef.current.y + dy;

      // Tilt from horizontal velocity
      const vx = e.clientX - lastPointerXRef.current;
      tiltRef.current = Math.max(-12, Math.min(12, vx * 0.8));
      lastPointerXRef.current = e.clientX;

      applyTransform();
    };

    const onUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      tiltRef.current = 0;

      // Reset X to center, keep Y for gravity to continue
      posRef.current.x = 0;
      lastTimeRef.current = performance.now();
      applyTransform();

      onDragEnd({ x: e.clientX, y: e.clientY }, word);
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [applyTransform, onDragStart, onDragEnd, word]);

  // Fade-in on mount
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, 0) scale(0.8)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.opacity = '1';
      el.style.transform = 'translate(-50%, 0) scale(1)';
      // Remove transition after intro so it doesn't interfere with drag
      setTimeout(() => {
        if (el) el.style.transition = 'none';
      }, 350);
    });
  }, []);

  return (
    <div
      ref={elRef}
      key={wordKey}
      className="absolute left-1/2 top-8 select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ willChange: 'transform', zIndex: 20 }}
    >
      <div className="word-card relative overflow-hidden">
        <span className="relative z-10 text-2xl md:text-3xl font-bold text-foreground pointer-events-none">
          {word.word}
        </span>
      </div>
    </div>
  );
};
