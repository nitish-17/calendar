import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Columns, Clock } from 'lucide-react';

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onNavigate: (action: 'prev' | 'next' | 'today') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  currentView, 
  onViewChange, 
  onNavigate 
}) => {
  return (
    <div className="h-full flex items-center justify-between px-6">
      {/* View Toggles */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onViewChange('timeGridDay')}
          className={`p-2 transition-all ${
            currentView === 'timeGridDay' 
              ? 'text-brand-primary scale-110' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Day View"
        >
          <CalendarIcon className="w-6 h-6" />
        </button>
        <button 
          onClick={() => onViewChange('timeGridWeek')}
          className={`p-2 transition-all ${
            currentView === 'timeGridWeek' 
              ? 'text-brand-primary scale-110' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Week View"
        >
          <Columns className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('prev')}
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
          title="Previous"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button 
          onClick={() => onNavigate('today')}
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
          title="Today"
        >
          <Clock className="w-6 h-6" />
        </button>
        <button 
          onClick={() => onNavigate('next')}
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
          title="Next"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
