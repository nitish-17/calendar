import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CALENDAR_CONFIG } from '../../constants/calendar';
import EventCard from './EventCard';

interface CalendarCoreProps {
  calendarRef: React.RefObject<FullCalendar | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentView: string;
  events: any[];
  editableEventId: string | null;
  onDateClick: (arg: any) => void;
  onEventClick: (info: any) => void;
  onEventDrop: (info: any) => void;
  onEventResize: (info: any) => void;
  onEventDidMount: (info: any) => void;
}

const CalendarCore: React.FC<CalendarCoreProps> = ({
  calendarRef,
  containerRef,
  currentView,
  events,
  editableEventId,
  onDateClick,
  onEventClick,
  onEventDrop,
  onEventResize,
  onEventDidMount,
}) => {
  return (
    <div className={`glass rounded-xl glow h-full transition-all duration-300 ${
      currentView === 'timeGridWeek' ? 'overflow-x-auto' : 'overflow-hidden'
    }`}>
      <div 
        ref={containerRef}
        className="h-full transition-all duration-300" 
        style={{ width: currentView === 'timeGridWeek' ? `${CALENDAR_CONFIG.WEEK_VIEW_WIDTH_FACTOR * 100}%` : '100%' }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          headerToolbar={false}
          editable={true}
          selectable={false}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          dateClick={onDateClick}
          eventClick={onEventClick}
          eventDrop={onEventDrop}
          eventResize={onEventResize}
          eventDidMount={onEventDidMount}
          eventContent={(info) => <EventCard info={info} isEditable={editableEventId === info.event.id} />}
          height="100%"
          nowIndicator={true}
          slotDuration={CALENDAR_CONFIG.SLOT_DURATION}
          snapDuration={CALENDAR_CONFIG.SNAP_DURATION}
          slotLabelInterval={CALENDAR_CONFIG.SLOT_LABEL_INTERVAL}
          eventLongPressDelay={0}
        />
      </div>
    </div>
  );
};

export default CalendarCore;
