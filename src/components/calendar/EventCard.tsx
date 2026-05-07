import React from 'react';

interface EventCardProps {
  info: any;
  isEditable: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ info, isEditable }) => {
  return (
    <div className={`flex flex-col h-full w-full p-1 relative overflow-hidden ${isEditable ? 'animate-pulse' : ''}`}>
      {/* Drag Indicator (Top Bar) */}
      {isEditable && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/40 rounded-full z-10 pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[11px] truncate">{info.event.title}</span>
      </div>
      
      <div className="text-[9px] opacity-70 truncate">
        {info.timeText}
      </div>
      
      {/* Resize Indicator (Bottom Circle) */}
      {isEditable && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full border border-black/20 z-10 pointer-events-none" />
      )}
    </div>
  );
};

export default EventCard;
