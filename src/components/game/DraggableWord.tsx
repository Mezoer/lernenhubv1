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
  const lastTimeRef = useRef<number>(0);

  // Position state stored in refs for direct DOM manipulation — no React rerenders
  const posRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const mountedRef = useRef(true);
  
  // Entry animation state
  const entryProgressRef = useRef(0);

  const floorY = gameHeight - 200;

  // Apply transform directly to DOM — bypasses all animation libraries
  const applyTransform = useCallback(() => {
    if (!elRef.current) return;
    const { x, y } = posRef.current;
    const tilt = tiltRef.current;
    
    // Smooth entry scale
    const entryScale = 0.95 + (Math.min(entryProgressRef.current, 1) * 0.05);
    const dragScale = draggingRef.current ? 1.1 : 1;
    const scale = entryScale * dragScale;
    
    elRef.current.style.transform = `translate(-50%, 0) translate(${x}px, ${y}px) rotate(${tilt}deg) scale(${scale})`;
    elRef.current.style.opacity = Math.min(entryProgressRef.current, 1).toString();
  }, []);

  // Gravity loop
  useEffect(() => {
    mountedRef.current = true;
    lastTimeRef.current = 0; // Reset clock on mount to avoid first-frame jump

    const animate = (currentTime: number) => {
      if (!mountedRef.current) return;

      // Initialize clock on first frame
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      const clampedDelta = Math.min(deltaTime, 0.05); // Stricter clamping for smoothness

      // Handle entry animation in the loop to avoid CSS transition conflicts
      if (entryProgressRef.current < 1) {
        entryProgressRef.current += clampedDelta * 10; // Fast fade in (0.1s)
      }

      if (draggingRef.current || isPaused) {
        applyTransform();
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      posRef.current.y += fallSpeed * 120 * clampedDelta;

      // Anti-Float Logic: Check for zone collision while falling
      const el = elRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        if (centerY > gameHeight - 180) {
          const articles: ('der' | 'das' | 'die')[] = ['der', 'das', 'die'];
          for (const artikel of articles) {
            const zoneEl = document.getElementById(`zone-${artikel}`);
            if (zoneEl) {
              const zoneRect = zoneEl.getBoundingClientRect();
              if (
                centerX >= zoneRect.left &&
                centerX <= zoneRect.right &&
                centerY >= zoneRect.top &&
                centerY <= zoneRect.bottom
              ) {
                onDragEnd({ x: centerX, y: centerY }, word);
                return;
              }
            }
          }
        }
      }

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

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      mountedRef.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, fallSpeed, floorY, applyTransform, onHitFloor, onDragEnd, word, gameHeight]);

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

      const vx = e.clientX - lastPointerXRef.current;
      tiltRef.current = Math.max(-12, Math.min(12, vx * 0.8));
      lastPointerXRef.current = e.clientX;

      applyTransform();
    };

    const onUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      tiltRef.current = 0;

      requestAnimationFrame(() => {
        if (!mountedRef.current) return;
        lastTimeRef.current = performance.now();
        applyTransform();
        onDragEnd({ x: e.clientX, y: e.clientY }, word);
      });
    };

    el.addEventListener('pointerdown', onDown, { passive: false });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });

    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [applyTransform, onDragStart, onDragEnd, word]);

  return (
    <div
      ref={elRef}
      key={wordKey}
      className="absolute left-1/2 top-8 select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ willChange: 'transform', zIndex: 20, opacity: 0 }}
    >
      <div className="word-card relative overflow-hidden">
        <span className="relative z-10 text-2xl md:text-3xl font-bold text-foreground pointer-events-none">
          {word.word}
        </span>
      </div>
    </div>
  );
};