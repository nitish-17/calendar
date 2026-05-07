import type { CalendarEvent } from '../db/db';

export interface ModalState {
  isOpen: boolean;
  type: 'add' | 'edit';
  event?: Partial<CalendarEvent>;
}

export interface AppContextType {
  selectedDate: Date | null;
  currentView: 'day' | 'week' | 'month';
  editingEventId: string | null;
  modalState: ModalState;
  setSelectedDate: (date: Date) => void;
  setCurrentView: (view: 'day' | 'week' | 'month') => void;
  setEditingEventId: (id: string | null) => void;
  setModalState: (state: ModalState) => void;
}
