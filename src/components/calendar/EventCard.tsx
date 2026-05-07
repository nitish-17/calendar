import React, { useRef } from 'react';
import type { EventContentArg } from '@fullcalendar/core';
import { ChevronDown } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { CALENDAR_CONFIG } from '../../constants/calendar';

interface EventCardProps {
  info: EventContentArg;
  isEditable: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ info, isEditable }) => {
  const { setEditingEventId } = useAppContext();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseColor = info.event.backgroundColor || '#a855f7';
  
  // Solo Leveling Secret: 40% opacity for glass effect
  const getGlassColor = (color: string) => {
    if (color.startsWith('rgba')) {
      return color.replace(/rgba?\((.*?)(?:,\s*[\d.]+)?\)/, 'rgba($1, 0.4)');
    }
    if (color.startsWith('#')) {
      const cleanHex = color.replace('#', '');
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.4)`;
    }
    return color;
  };

  const handleStart = () => {
    longPressTimer.current = setTimeout(() => {
      setEditingEventId(info.event.id);
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, CALENDAR_CONFIG.LONG_PRESS_THRESHOLD_MS);
  };

  const handleEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const glassBg = getGlassColor(baseColor);

  return (
    <div 
      className="h-full w-full p-[2px] overflow-visible"
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div 
        className={`flex flex-col h-full w-full p-2 relative solo-glass solo-aura rounded-md transition-all duration-200 ${
          isEditable ? 'is-active-editing' : ''
        }`}
        style={{ 
          '--event-bg-glass': glassBg,
          '--event-glow': baseColor
        } as React.CSSProperties}
      >
        {/* Drag Indicator (Top Bar) - Only visible when editable */}
        {isEditable && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/40 rounded-full z-10 pointer-events-none" />
        )}
        
        <div className="flex items-start justify-between overflow-hidden">
          <span className="font-extrabold text-[11px] leading-tight whitespace-normal break-words uppercase tracking-wider">{info.event.title}</span>
        </div>
        
        {/* Resize Indicator (Bottom Arrow) - Only visible when editable */}
        {isEditable && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-white/70">
            <ChevronDown size={14} strokeWidth={3} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
