import MobileLayout from './layout/MobileLayout';
import BottomNavigation from './layout/BottomNavigation';
import CalendarCore from './calendar/CalendarCore';
import EventModal from './calendar/EventModal';
import { useCalendar } from '../hooks/useCalendar';
import { useAppContext } from '../hooks/useAppContext';

const CalendarView = () => {
  const { modalState } = useAppContext();
  const {
    calendarRef,
    containerRef,
    currentView,
    navigate,
    changeView,
    calendarEvents,
    editableEventId,
    handlers,
  } = useCalendar();

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
          containerRef={containerRef}
          currentView={currentView}
          events={calendarEvents}
          editableEventId={editableEventId}
          {...handlers}
        />
      </div>
      {modalState.isOpen && <EventModal />}
    </MobileLayout>
  );
};

export default CalendarView;
