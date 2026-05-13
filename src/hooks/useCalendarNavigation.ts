import { useCallback } from 'react';
import type { RefObject } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useAppContext } from './useAppContext';

export const useCalendarNavigation = (
  calendarRef: RefObject<FullCalendar | null>,
  containerRef: RefObject<HTMLDivElement | null>
) => {
  const { currentView, setCurrentView } = useAppContext();

  const scrollToNow = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const now = new Date();
    // Look back 1 hour for context, but clamp to 00:00 if it's currently before 01:00
    let hours = now.getHours() - 1;
    let minutes = now.getMinutes();
    
    if (hours < 0) {
      hours = 0;
      minutes = 0;
    }

    calendarApi.scrollToTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);

    // Horizontal Scroll to Today in Week View
    if (currentView === 'timeGridWeek' && containerRef.current) {
      const scroller = containerRef.current.parentElement;
      const todayCol = containerRef.current.querySelector('.fc-timegrid-col.fc-day-today') as HTMLElement;
      
      if (scroller && todayCol) {
        const targetX = todayCol.offsetLeft + (todayCol.offsetWidth / 2) - (scroller.offsetWidth / 2);
        scroller.scrollTo({
          left: targetX,
          behavior: 'smooth'
        });
      }
    }
  }, [calendarRef, containerRef, currentView]);

  const navigate = useCallback((action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    
    calendarApi[action]();
    
    if (action === 'today') {
      scrollToNow();
    }
  }, [calendarRef, scrollToNow]);

  const changeView = useCallback((view: 'timeGridDay' | 'timeGridWeek') => {
    // Always update the state regardless of whether the calendar API is ready
    // This ensures that when the calendar mounts (e.g., after switching from Settings),
    // it uses the correct view.
    setCurrentView(view);

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const date = calendarApi.getDate();
      const today = new Date();
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();

      requestAnimationFrame(() => {
        calendarApi.changeView(view);
        calendarApi.updateSize();
        
        if (isToday) {
          scrollToNow();
        }
      });
    }
  }, [calendarRef, scrollToNow, setCurrentView]);

  return {
    currentView,
    navigate,
    changeView,
    scrollToNow,
  };
};
