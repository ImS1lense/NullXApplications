
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on devices with a mouse
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Direct DOM manipulation for performance
        // We use translate3d for GPU acceleration
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'LABEL' ||
        target.closest('button') || 
        target.closest('.cursor-pointer');

      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  // Render via Portal to escape any parent transforms/overflows causing the "drift" bug
  return createPortal(
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      style={{ 
        // Initial position off-screen
        transform: 'translate3d(-100px, -100px, 0)' 
      }} 
    >
      <div 
        className="relative transition-transform duration-150 ease-out"
        style={{
          // Rotated -45deg to point top-left (standard cursor direction)
          // Translate adjusts the "hotspot" to be exactly at the sword tip
          transform: `rotate(-45deg) translate(-30%, -30%) ${isClicking ? 'rotate(-15deg) scale(0.9)' : 'scale(1)'}`
        }}
      >
        <img 
          src={isHovering 
            ? 'https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/items/golden_sword.png' 
            : 'https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/items/diamond_sword.png'
          }
          alt="cursor"
          className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
          style={{ 
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>,
    document.body
  );
};
