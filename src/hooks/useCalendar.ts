import { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useEvents } from './useEvents';
import { useCalendarNavigation } from './useCalendarNavigation';
import { useCalendarInteractions } from './useCalendarInteractions';
import { useCalendarEvents } from './useCalendarEvents';

export const useCalendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { events, updateEvent } = useEvents();

  const { currentView, navigate, changeView } = useCalendarNavigation(calendarRef);
  
  const {
    editableEventId,
    handleDateClick,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleEventDidMount,
  } = useCalendarInteractions({ updateEvent });

  const calendarEvents = useCalendarEvents(events, editableEventId);

  // Resize Handling
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    const container = containerRef.current;
    if (!calendarApi || !container) return;

    const resizeObserver = new ResizeObserver(() => calendarApi.updateSize());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return {
    calendarRef,
    containerRef,
    currentView,
    navigate,
    changeView,
    calendarEvents,
    editableEventId,
    handlers: {
      onDateClick: handleDateClick,
      onEventClick: handleEventClick,
      onEventDrop: handleEventDrop,
      onEventResize: handleEventResize,
      onEventDidMount: handleEventDidMount,
    }
  };
};
