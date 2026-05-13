import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Columns3, Clock, Wand2 } from 'lucide-react';

interface BottomNavigationProps {
  currentView: 'timeGridDay' | 'timeGridWeek';
  activePage: 'calendar' | 'settings';
  onViewChange: (view: 'timeGridDay' | 'timeGridWeek') => void;
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
    <div className="h-full flex items-center justify-between gap-1">
      {/* View Toggles Group - Takes 2/3 of available space */}
      <div className="flex items-center gap-1 flex-[2]">
        <button 
          onClick={() => {
            onPageChange('calendar');
            onViewChange('timeGridWeek');
          }}
          className={`flex-1 h-14 flex flex-col items-center justify-center rounded-xl transition-all ${
            activePage === 'calendar' && currentView === 'timeGridWeek' 
              ? 'bg-indigo-500/10 text-indigo-400' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
          }`}
          title="Week View"
        >
          <Columns3 className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Week</span>
        </button>

        <button 
          onClick={() => {
            onPageChange('calendar');
            onViewChange('timeGridDay');
          }}
          className={`flex-1 h-14 flex flex-col items-center justify-center rounded-xl transition-all ${
            activePage === 'calendar' && currentView === 'timeGridDay' 
              ? 'bg-indigo-500/10 text-indigo-400' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
          }`}
          title="Day View"
        >
          <CalendarIcon className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Day</span>
        </button>
      </div>

      {/* Navigation Controls - Centered Group */}
      <div className="flex items-center gap-1 px-1 border-x border-white/5">
        <button 
          onClick={() => onNavigate('prev')}
          className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-full transition-all"
          title="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={() => onNavigate('today')}
          className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-full transition-all"
          title="Today"
        >
          <Clock className="w-5 h-5" />
        </button>

        <button 
          onClick={() => onNavigate('next')}
          className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-full transition-all"
          title="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Settings Group - Takes 1/3 of available space */}
      <div className="flex items-center flex-1">
        <button 
          onClick={() => onPageChange('settings')}
          className={`flex-1 h-14 flex flex-col items-center justify-center rounded-xl transition-all ${
            activePage === 'settings' 
              ? 'bg-indigo-500/10 text-indigo-400' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
          }`}
          title="Settings"
        >
          <Wand2 className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Tools</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
