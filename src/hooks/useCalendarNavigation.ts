import { useState, useCallback } from 'react';
import type { RefObject } from 'react';
import FullCalendar from '@fullcalendar/react';

export const useCalendarNavigation = (
  calendarRef: RefObject<FullCalendar | null>,
  containerRef: RefObject<HTMLDivElement | null>
) => {
  const [currentView, setCurrentView] = useState('timeGridDay');

  const navigate = useCallback((action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    
    calendarApi[action]();
    
    if (action === 'today') {
      const now = new Date();
      // Look back 1 hour for context, but clamp to 00:00 if it's currently before 01:00
      let hours = now.getHours() - 1;
      let minutes = now.getMinutes();
      
      if (hours < 0) {
        hours = 0;
        minutes = 0;
      }

      calendarApi.scrollToTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);

      // Horizontal Scroll to Today in Week View - Manual Calculation to avoid vertical conflict
      if (currentView === 'timeGridWeek' && containerRef.current) {
        const scroller = containerRef.current.parentElement;
        const todayCol = containerRef.current.querySelector('.fc-timegrid-col.fc-day-today') as HTMLElement;
        
        if (scroller && todayCol) {
          // Calculate the center position
          const targetX = todayCol.offsetLeft + (todayCol.offsetWidth / 2) - (scroller.offsetWidth / 2);
          scroller.scrollTo({
            left: targetX,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [calendarRef, containerRef, currentView]);

  const changeView = useCallback((view: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      // 1. Update our state first so the container starts its width transition
      setCurrentView(view);
      
      // 2. Tell FullCalendar to change view. 
      // Using requestAnimationFrame ensures this happens after the state update has propagated to the DOM
      requestAnimationFrame(() => {
        calendarApi.changeView(view);
        calendarApi.updateSize();
      });
    }
  }, [calendarRef]);

  return {
    currentView,
    navigate,
    changeView,
  };
};
