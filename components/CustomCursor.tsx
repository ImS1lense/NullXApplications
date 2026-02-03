
import React, { useEffect, useRef, useState } from 'react';

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
        // Direct DOM manipulation for performance (no React re-renders on move)
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) rotate(${isClicking ? -45 : 0}deg)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
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
  }, [isClicking]);

  // Update rotation when click state changes via effect to sync with ref style
  useEffect(() => {
    if (cursorRef.current) {
      const currentTransform = cursorRef.current.style.transform;
      // Extract coordinates to preserve position while updating rotation
      const coords = currentTransform.split(' rotate')[0] || 'translate3d(0px, 0px, 0)';
      cursorRef.current.style.transform = `${coords} rotate(${isClicking ? -45 : 0}deg)`;
    }
  }, [isClicking]);

  if (!isVisible) return null;

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      style={{ marginTop: '-10px', marginLeft: '-10px' }} // Offset to center tip slightly
    >
      <img 
        src={isHovering 
          ? 'https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/items/golden_sword.png' 
          : 'https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/items/diamond_sword.png'
        }
        alt="cursor"
        className="w-16 h-16 transition-all duration-100 ease-out drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ 
          imageRendering: 'pixelated',
          transformOrigin: 'bottom left' // Rotate from the handle
        }}
      />
    </div>
  );
};
