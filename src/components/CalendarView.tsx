import { useRef, useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useEvents } from '../hooks/useEvents';
import { CALENDAR_CONFIG, COLORS } from '../constants/calendar';
import MobileLayout from './layout/MobileLayout';
import BottomNavigation from './layout/BottomNavigation';
import CalendarCore from './calendar/CalendarCore';

const CalendarView = () => {
  // Refs
  const calendarRef = useRef<FullCalendar>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [currentView, setCurrentView] = useState('timeGridDay');
  const [editableEventId, setEditableEventId] = useState<string | null>(null);
  const [lastDateClick, setLastDateClick] = useState<{ date: Date, time: number } | null>(null);
  const [clickTimer, setClickTimer] = useState<any>(null);

  // Data
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  // Resize Handling
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    const container = calendarContainerRef.current;
    if (!calendarApi || !container) return;

    const resizeObserver = new ResizeObserver(() => calendarApi.updateSize());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Handlers - Interaction
  const handleDateClick = useCallback(async (arg: any) => {
    if (editableEventId) {
      setEditableEventId(null);
      return;
    }

    const now = Date.now();
    if (lastDateClick && now - lastDateClick.time < CALENDAR_CONFIG.DOUBLE_TAP_THRESHOLD_MS && lastDateClick.date.getTime() === arg.date.getTime()) {
      const title = prompt('New Event:');
      if (title) {
        await addEvent({
          title,
          start: arg.date,
          end: new Date(arg.date.getTime() + CALENDAR_CONFIG.DEFAULT_EVENT_DURATION_MINS * 60 * 1000),
          allDay: arg.allDay,
        });
      }
      setLastDateClick(null);
    } else {
      setLastDateClick({ date: arg.date, time: now });
    }
  }, [editableEventId, lastDateClick, addEvent]);

  const handleEventClick = useCallback((clickInfo: any) => {
    if (editableEventId && editableEventId !== clickInfo.event.id) {
      setEditableEventId(null);
      return;
    }

    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      if (confirm(`Delete '${clickInfo.event.title}'?`)) {
        deleteEvent(parseInt(clickInfo.event.id));
      }
    } else {
      const timer = setTimeout(async () => {
        setClickTimer(null);
        const newTitle = prompt('Edit title:', clickInfo.event.title);
        if (newTitle && newTitle !== clickInfo.event.title) {
          await updateEvent(parseInt(clickInfo.event.id), { title: newTitle });
        }
      }, CALENDAR_CONFIG.DOUBLE_TAP_THRESHOLD_MS);
      setClickTimer(timer);
    }
  }, [editableEventId, clickTimer, updateEvent, deleteEvent]);

  const handleEventDrop = useCallback(async (dropInfo: any) => {
    const { event } = dropInfo;
    await updateEvent(parseInt(event.id), {
      start: event.start!,
      end: event.end!,
      allDay: event.allDay
    });
  }, [updateEvent]);

  const handleEventResize = useCallback(async (resizeInfo: any) => {
    const { event } = resizeInfo;
    await updateEvent(parseInt(event.id), {
      start: event.start!,
      end: event.end!,
      allDay: event.allDay
    });
  }, [updateEvent]);

  const handleEventDidMount = useCallback((info: any) => {
    let longPressTimer: any;
    
    info.el.addEventListener('touchstart', () => {
      longPressTimer = setTimeout(() => setEditableEventId(info.event.id), CALENDAR_CONFIG.LONG_PRESS_THRESHOLD_MS);
    }, { passive: true });

    info.el.addEventListener('touchend', () => clearTimeout(longPressTimer));
    info.el.addEventListener('touchmove', () => clearTimeout(longPressTimer));
    
    if (editableEventId === info.event.id) {
      info.el.classList.add('ring-4', 'ring-brand-primary', 'ring-opacity-50', 'z-50', 'scale-[1.02]', 'transition-transform');
      const resizer = info.el.querySelector('.fc-event-resizer-bottom');
      if (resizer) {
        Object.assign(resizer.style, {
          height: '32px', width: '100%', left: '0', bottom: '0', display: 'block', zIndex: '999'
        });
      }
    }
  }, [editableEventId]);

  // Handlers - Navigation
  const navigate = useCallback((action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi[action]();
    if (action === 'today') {
      const now = new Date();
      const scrollTime = new Date(now.getTime() - 60 * 60 * 1000);
      calendarApi.scrollToTime(`${String(scrollTime.getHours()).padStart(2, '0')}:${String(scrollTime.getMinutes()).padStart(2, '0')}:00`);
    }
  }, []);

  const changeView = useCallback((view: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
      setCurrentView(view);
    }
  }, []);

  // Map events for FullCalendar
  const calendarEvents = events?.map(e => ({
    id: e.id?.toString(),
    title: e.title,
    start: e.start,
    end: e.end,
    allDay: e.allDay,
    backgroundColor: e.color || COLORS.PRIMARY,
    borderColor: 'transparent',
    startEditable: editableEventId === e.id?.toString(),
    durationEditable: editableEventId === e.id?.toString(),
  }));

  return (
    <MobileLayout 
      navigation={
        <BottomNavigation 
          currentView={currentView} 
          onViewChange={changeView} 
          onNavigate={navigate} 
        />
      }
    >
      <div className="h-full w-full p-2">
        <CalendarCore 
          calendarRef={calendarRef}
          containerRef={calendarContainerRef}
          currentView={currentView}
          events={calendarEvents || []}
          editableEventId={editableEventId}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          onEventDidMount={handleEventDidMount}
        />
      </div>
    </MobileLayout>
  );
};

export default CalendarView;
