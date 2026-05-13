import React, { useRef } from 'react';
import type { EventContentArg } from '@fullcalendar/core';
import { ChevronDown } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { CALENDAR_CONFIG } from '../../constants/calendar';

interface EventCardProps {
  info: EventContentArg;
  isEditable: boolean;
}

const EventCard: React.FC<EventCardProps> = React.memo(({ info, isEditable }) => {
  const { setEditingEventId } = useAppContext();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseColor = info.event.backgroundColor || '#a855f7';
  
  // Solo Leveling Secret: Proportional glass effect based on user alpha
  const getGlassColor = (color: string) => {
    if (color.startsWith('rgba')) {
      return color.replace(/rgba?\((.*?)(?:,\s*([\d.]+))?\)/, (_, rgb, a) => {
        const alpha = a ? parseFloat(a) : 1;
        // We use roughly half the user's chosen alpha for the glass background
        // to maintain that "depth" feel while respecting their customization.
        return `rgba(${rgb}, ${Math.max(0.05, alpha * 0.5)})`;
      });
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
        className={`flex flex-col h-full w-full px-2 py-1 relative solo-glass solo-aura rounded-md transition-all duration-200 ${
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
        
        <div className="flex flex-col h-full overflow-hidden">
          <span className="font-extrabold text-[11px] leading-tight whitespace-normal break-words uppercase tracking-wider mb-1">
            {info.event.title}
          </span>
          {info.event.extendedProps.description && (
            <span className="text-[11px] leading-tight text-white/70 italic">
              {info.event.extendedProps.description}
            </span>
          )}
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
});

export default EventCard;
