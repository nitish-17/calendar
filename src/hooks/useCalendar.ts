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

  const { currentView, navigate, changeView, scrollToNow } = useCalendarNavigation(calendarRef, containerRef);
  
  const {
    editableEventId,
    handleDateClick,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleEventDidMount,
  } = useCalendarInteractions({ updateEvent });

  const calendarEvents = useCalendarEvents(events, editableEventId);

  // Auto-scroll to current time if on today's date
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const date = calendarApi.getDate();
    const today = new Date();
    
    // Check if showing today
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();

    if (isToday) {
      // Use requestAnimationFrame to ensure FullCalendar has rendered the slots
      requestAnimationFrame(() => {
        scrollToNow();
      });
    }
  }, [currentView, scrollToNow]);

  // Resize Handling & View Sync
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.updateSize();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to ensure DOM has settled
      requestAnimationFrame(updateSize);
    });

    resizeObserver.observe(container);

    // Also trigger update when currentView changes explicitly
    updateSize();

    return () => resizeObserver.disconnect();
  }, [currentView]); // Re-run when view changes to ensure sync

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
