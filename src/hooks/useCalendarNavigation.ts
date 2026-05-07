import { useState, useCallback } from 'react';
import type { RefObject } from 'react';
import FullCalendar from '@fullcalendar/react';

export const useCalendarNavigation = (calendarRef: RefObject<FullCalendar | null>) => {
  const [currentView, setCurrentView] = useState('timeGridDay');

  const navigate = useCallback((action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    
    calendarApi[action]();
    
    if (action === 'today') {
      const now = new Date();
      const scrollTime = new Date(now.getTime() - 60 * 60 * 1000);
      calendarApi.scrollToTime(`${String(scrollTime.getHours()).padStart(2, '0')}:${String(scrollTime.getMinutes()).padStart(2, '0')}:00`);
    }
  }, [calendarRef]);

  const changeView = useCallback((view: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
      setCurrentView(view);
    }
  }, [calendarRef]);

  return {
    currentView,
    navigate,
    changeView,
  };
};
