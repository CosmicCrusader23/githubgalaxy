'use client';

import { useState, useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { Card } from './card';

interface DraggableCardProps {
  children: ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
  style?: CSSProperties;
}

export function DraggableCard({ children, className = '', initialPosition, style }: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the card itself, not from inputs/buttons inside
    if ((e.target as HTMLElement).closest('button, input, textarea, a')) {
      return;
    }

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach global mouse event listeners for dragging
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const transformStyle: CSSProperties = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: isDragging ? 'none' : 'auto',
    ...style,
  };

  return (
    <div
      ref={cardRef}
      className="absolute"
      style={transformStyle}
      onMouseDown={handleMouseDown}
    >
      <Card className={className}>
        {children}
      </Card>
    </div>
  );
}
