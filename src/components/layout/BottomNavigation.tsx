import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Columns, Target } from 'lucide-react';

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
    <div className="h-full flex items-center justify-between px-4">
      {/* View Toggles */}
      <div className="flex items-center gap-1 p-1 bg-brand-surface/50 rounded-xl border border-glass-border">
        <button 
          onClick={() => onViewChange('timeGridDay')}
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
          onClick={() => onViewChange('timeGridWeek')}
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

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onNavigate('prev')}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
          title="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => onNavigate('today')}
          className="p-2 rounded-lg bg-brand-surface border border-glass-border text-brand-primary hover:bg-white/10 transition-colors"
          title="Today"
        >
          <Target className="w-6 h-6" />
        </button>
        <button 
          onClick={() => onNavigate('next')}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
          title="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
