import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { EventClickArg, EventDropArg, EventMountArg, EventInput } from '@fullcalendar/core';
import { CALENDAR_CONFIG } from '../../constants/calendar';
import EventCard from './EventCard';

interface CalendarCoreProps {
  calendarRef: React.RefObject<FullCalendar | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentView: string;
  events: EventInput[];
  editableEventId: string | null;
  onDateClick: (arg: DateClickArg) => void;
  onEventClick: (info: EventClickArg) => void;
  onEventDrop: (info: EventDropArg) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEventResize: (info: any) => void;
  onEventDidMount: (info: EventMountArg) => void;
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
          dayHeaderContent={(arg) => {
            const date = arg.date;
            const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
            const month = date.toLocaleDateString('en-US', { month: 'long' });
            const day = date.getDate();

            // Ordinal suffix
            const j = day % 10, k = day % 100;
            let suffix = "th";
            if (j === 1 && k !== 11) suffix = "st";
            if (j === 2 && k !== 12) suffix = "nd";
            if (j === 3 && k !== 13) suffix = "rd";

            return (
              <span className="text-brand-primary">
                {`${weekday}, ${month} ${day}${suffix}`}
              </span>
            );
          }}
          eventContent={(info) => <EventCard info={info} isEditable={editableEventId === info.event.id} />}

          height="100%"
          nowIndicator={true}
          slotDuration={CALENDAR_CONFIG.SLOT_DURATION}
          snapDuration={CALENDAR_CONFIG.SNAP_DURATION}
          slotLabelInterval={CALENDAR_CONFIG.SLOT_LABEL_INTERVAL}
          slotLaneClassNames={(arg) => {
            if (!arg.date) return [];
            const minutes = arg.date.getMinutes();
            if (minutes === 45) return ['fc-timegrid-slot-00']; // bottom border is :00
            if (minutes === 15) return ['fc-timegrid-slot-30']; // bottom border is :30
            return ['fc-timegrid-slot-15-45']; // bottom borders are :15 and :45
          }}
          slotLabelClassNames={(arg) => {
            if (!arg.date) return [];
            const minutes = arg.date.getMinutes();
            if (minutes === 45) return ['fc-timegrid-slot-00'];
            if (minutes === 15) return ['fc-timegrid-slot-30'];
            return ['fc-timegrid-slot-15-45'];
          }}
          eventLongPressDelay={0}
        />
      </div>
    </div>
  );
};

export default CalendarCore;
