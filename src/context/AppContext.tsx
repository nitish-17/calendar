// src/context/AppContext.tsx

import React, { useState, useCallback } from 'react';
import type { AppContextType, ModalState } from '../types/app';
import { AppContext } from './context';

// 3. Create the Provider Component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Initial State Values ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Default to today
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week'); // Default to week view
  const [editingEventId, setEditingEventId] = useState<string | null>(null); // Null means no event is being edited/moved
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: 'add' });

  // --- State Handlers ---
  
  // Date selection handler (used by calendar header/nav)
  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    // When the date changes, we should ideally reset the editing state.
    if (editingEventId) {
        setEditingEventId(null);
    }
  }, [editingEventId]);

  // View change handler
  const handleViewChange = useCallback((view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
  }, []);

  // Editing state handler
  const handleSetEditingEventId = useCallback((id: string | null) => {
    setEditingEventId(id);
  }, []);

  const handleSetModalState = useCallback((state: ModalState) => {
    setModalState(state);
  }, []);


  const contextValue: AppContextType = {
    selectedDate,
    currentView,
    editingEventId,
    modalState,
    setSelectedDate: handleSelectDate,
    setCurrentView: handleViewChange,
    setEditingEventId: handleSetEditingEventId,
    setModalState: handleSetModalState,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
    );
    };