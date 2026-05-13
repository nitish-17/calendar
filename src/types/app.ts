import type { CalendarEvent, UnscheduledTask } from '../db/db';

export interface ModalState {
  isOpen: boolean;
  type: 'add' | 'edit';
  mode: 'event' | 'task';
  event?: Partial<CalendarEvent>;
  task?: Partial<UnscheduledTask>;
}

export interface AppContextType {
  selectedDate: Date | null;
  currentView: 'timeGridDay' | 'timeGridWeek';
  editingEventId: string | null;
  modalState: ModalState;
  activePage: 'calendar' | 'settings';
  setSelectedDate: (date: Date) => void;
  setCurrentView: (view: 'timeGridDay' | 'timeGridWeek') => void;
  setEditingEventId: (id: string | null) => void;
  setModalState: (state: ModalState) => void;
  setActivePage: (page: 'calendar' | 'settings') => void;
}
