import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Columns3, Clock, Wand2 } from 'lucide-react';

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
    <div className="h-full flex items-center justify-between px-4">
      {/* Week View */}
      <button 
        onClick={() => {
          onPageChange('calendar');
          onViewChange('timeGridWeek');
        }}
        className={`transition-all ${
          activePage === 'calendar' && currentView === 'timeGridWeek' 
            ? 'text-brand-primary scale-110' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
        title="Week View"
      >
        <Columns3 className="w-5 h-5" />
      </button>

      {/* Day View */}
      <button 
        onClick={() => {
          onPageChange('calendar');
          onViewChange('timeGridDay');
        }}
        className={`transition-all ${
          activePage === 'calendar' && currentView === 'timeGridDay' 
            ? 'text-brand-primary scale-110' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
        title="Day View"
      >
        <CalendarIcon className="w-5 h-5" />
      </button>

      {/* Navigation Controls - Prev */}
      <button 
        onClick={() => onNavigate('prev')}
        className="text-gray-400 hover:text-gray-200 transition-colors"
        title="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Today */}
      <button 
        onClick={() => onNavigate('today')}
        className="text-gray-400 hover:text-gray-200 transition-colors"
        title="Today"
      >
        <Clock className="w-5 h-5" />
      </button>

      {/* Navigation Controls - Next */}
      <button 
        onClick={() => onNavigate('next')}
        className="text-gray-400 hover:text-gray-200 transition-colors"
        title="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Settings (Activity) */}
      <button 
        onClick={() => onPageChange('settings')}
        className={`transition-all ${
          activePage === 'settings' 
            ? 'text-brand-primary scale-110' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
        title="Settings"
      >
        <Wand2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default BottomNavigation;
