import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Columns, Target } from 'lucide-react';

const CalendarView = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState('timeGridDay');
  const events = useLiveQuery(() => db.events.toArray());

  // Fix: Use ResizeObserver to keep FullCalendar in sync with its container's size
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    const container = calendarContainerRef.current;
    
    if (!calendarApi || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      calendarApi.updateSize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleDateSelect = async (selectInfo: any) => {
    const title = prompt('Enter event title:');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      await db.events.add({
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = async (clickInfo: any) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      const id = parseInt(clickInfo.event.id);
      await db.events.delete(id);
    }
  };

  const navigate = (action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi[action]();
      
      if (action === 'today') {
        // Scroll to current time minus 1 hour for context
        const now = new Date();
        const scrollTime = new Date(now.getTime() - 60 * 60 * 1000);
        const hours = String(scrollTime.getHours()).padStart(2, '0');
        const minutes = String(scrollTime.getMinutes()).padStart(2, '0');
        const seconds = String(scrollTime.getSeconds()).padStart(2, '0');
        
        calendarApi.scrollToTime(`${hours}:${minutes}:${seconds}`);
      }
    }
  };

  const changeView = (view: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
      setCurrentView(view);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-brand-bg relative pb-16">
      <div className="flex-1 p-2 overflow-hidden">
        <div className={`glass rounded-xl glow h-full ${currentView === 'timeGridWeek' ? 'overflow-x-auto' : 'overflow-hidden'}`}>
          <div 
            ref={calendarContainerRef}
            className="h-full transition-all duration-300" 
            style={{ width: currentView === 'timeGridWeek' ? '150%' : '100%' }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              headerToolbar={false}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={events?.map(e => ({
                id: e.id?.toString(),
                title: e.title,
                start: e.start,
                end: e.end,
                allDay: e.allDay,
                backgroundColor: e.color || '#a855f7',
                borderColor: 'transparent'
              }))}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="100%"
              nowIndicator={true}
              slotDuration="00:15:00"
              snapDuration="00:15:00"
              slotLabelInterval="01:00:00"
            />
          </div>
        </div>
      </div>


      {/* Refined Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 glass border-t border-glass-border flex items-center justify-between px-4 z-50">
        {/* Toggle Left */}
        <div className="flex items-center gap-1 p-1 bg-brand-surface/50 rounded-xl border border-glass-border">
          <button 
            onClick={() => changeView('timeGridDay')}
            className={`p-2 rounded-lg transition-all ${
              currentView === 'timeGridDay' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Day View"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => changeView('timeGridWeek')}
            className={`p-2 rounded-lg transition-all ${
              currentView === 'timeGridWeek' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Week View"
          >
            <Columns className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Right */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('prev')}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigate('today')}
            className="p-2 rounded-lg bg-brand-surface border border-glass-border text-brand-primary hover:bg-white/10 transition-colors"
            title="Today"
          >
            <Target className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigate('next')}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
