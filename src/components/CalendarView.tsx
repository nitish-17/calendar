import MobileLayout from './layout/MobileLayout';
import BottomNavigation from './layout/BottomNavigation';
import CalendarCore from './calendar/CalendarCore';
import EventModal from './calendar/EventModal';
import SettingsView from './SettingsView';
import { useCalendar } from '../hooks/useCalendar';
import { useAppContext } from '../hooks/useAppContext';
import { useHardwareBack } from '../hooks/useHardwareBack';

const CalendarView = () => {
  const { modalState, activePage, setActivePage } = useAppContext();
  
  // Initialize hardware back button listener
  useHardwareBack();

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
          activePage={activePage}
          onViewChange={changeView} 
          onNavigate={navigate} 
          onPageChange={setActivePage}
        />
      }
    >
      <div className="h-full w-full">
        {activePage === 'calendar' ? (
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
        ) : (
          <SettingsView />
        )}
      </div>
      {modalState.isOpen && <EventModal />}
    </MobileLayout>
  );
};

export default CalendarView;
