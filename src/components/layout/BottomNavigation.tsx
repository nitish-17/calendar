import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Columns, Clock, Settings } from 'lucide-react';

interface BottomNavigationProps {
  currentView: string;
  activePage: 'calendar' | 'settings';
  onViewChange: (view: string) => void;
  onNavigate: (action: 'prev' | 'next' | 'today') => void;
  onPageChange: (page: 'calendar' | 'settings') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  currentView, 
  activePage,
  onViewChange, 
  onNavigate,
  onPageChange
}) => {
  return (
    <div className="h-full flex items-center justify-around px-2">
      {/* Settings */}
      <button 
        onClick={() => onPageChange('settings')}
        className={`p-2 transition-all ${
          activePage === 'settings' 
            ? 'text-brand-primary scale-110' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Week View */}
      <button 
        onClick={() => {
          onPageChange('calendar');
          onViewChange('timeGridWeek');
        }}
        className={`p-2 transition-all ${
          activePage === 'calendar' && currentView === 'timeGridWeek' 
            ? 'text-brand-primary scale-110' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
        title="Week View"
      >
        <Columns className="w-6 h-6" />
      </button>

      {/* Day View */}
      <button 
        onClick={() => {
          onPageChange('calendar');
          onViewChange('timeGridDay');
        }}
        className={`p-2 transition-all ${
          activePage === 'calendar' && currentView === 'timeGridDay' 
            ? 'text-brand-primary scale-110' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
        title="Day View"
      >
        <CalendarIcon className="w-6 h-6" />
      </button>

      {/* Navigation Controls - Prev */}
      <button 
        onClick={() => onNavigate('prev')}
        className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
        title="Previous"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      {/* Today */}
      <button 
        onClick={() => onNavigate('today')}
        className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
        title="Today"
      >
        <Clock className="w-6 h-6" />
      </button>

      {/* Navigation Controls - Next */}
      <button 
        onClick={() => onNavigate('next')}
        className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
        title="Next"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
};

export default BottomNavigation;
