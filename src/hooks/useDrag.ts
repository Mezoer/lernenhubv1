import { useState, useCallback, useRef, useEffect } from 'react';
import { SentenceWord } from '@/data/sentenceDatabase';

interface Position {
  x: number;
  y: number;
}

export const useDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });
  const currentWordRef = useRef<SentenceWord | null>(null);
  const onDropRef = useRef<((word: SentenceWord, slotIndex: number) => void) | null>(null);
  const elementStartRef = useRef<Position>({ x: 0, y: 0 });

  const findSlotUnderPoint = useCallback((clientX: number, clientY: number): number | null => {
    const slots = document.querySelectorAll('[id^="sentence-slot-"]');
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const rect = slot.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return i;
      }
    }
    return null;
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPositionRef.current.x;
    const deltaY = clientY - startPositionRef.current.y;
    
    setPosition({ x: deltaX, y: deltaY });
  }, [isDragging]);

  const handleEnd = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const slotIndex = findSlotUnderPoint(clientX, clientY);
    
    if (slotIndex !== null && currentWordRef.current && onDropRef.current) {
      onDropRef.current(currentWordRef.current, slotIndex);
    }
    
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    currentWordRef.current = null;
    onDropRef.current = null;
  }, [isDragging, findSlotUnderPoint]);

  // Mouse events
  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    word: SentenceWord,
    onDrop: (word: SentenceWord, slotIndex: number) => void
  ) => {
    e.preventDefault();
    startPositionRef.current = { x: e.clientX, y: e.clientY };
    currentWordRef.current = word;
    onDropRef.current = onDrop;
    setIsDragging(true);
  }, []);

  // Touch events
  const handleTouchStart = useCallback((
    e: React.TouchEvent,
    word: SentenceWord,
    onDrop: (word: SentenceWord, slotIndex: number) => void
  ) => {
    const touch = e.touches[0];
    startPositionRef.current = { x: touch.clientX, y: touch.clientY };
    currentWordRef.current = word;
    onDropRef.current = onDrop;
    setIsDragging(true);
  }, []);

  // Global event listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = (e: MouseEvent) => handleEnd(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      handleEnd(touch.clientX, touch.clientY);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return {
    isDragging,
    position,
    handleMouseDown,
    handleTouchStart,
  };
};
