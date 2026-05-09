import React, { useState } from 'react';
import { X, Trash2, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { useEvents } from '../../hooks/useEvents';
import { useGuidingPrinciples } from '../../hooks/useGuidingPrinciples';
import { CALENDAR_CONFIG } from '../../constants/calendar';
import type { CalendarEvent } from '../../db/db';
import { RgbaColorPicker } from 'react-colorful';

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

const EventModal: React.FC = () => {
  const { modalState, setModalState } = useAppContext();
  const { addEvent, updateEvent, deleteEvent } = useEvents();
  const { principles } = useGuidingPrinciples();

  const parseInitialColor = (eventColor?: string): RGBA => {
    if (!eventColor) return { r: 168, g: 85, b: 247, a: 0.75 }; // Default Violet
    
    if (eventColor.startsWith('rgba')) {
      const parts = eventColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (parts) {
        return {
          r: parseInt(parts[1]),
          g: parseInt(parts[2]),
          b: parseInt(parts[3]),
          a: parts[4] ? parseFloat(parts[4]) : 0.75
        };
      }
    } else if (eventColor.startsWith('#')) {
      const hex = eventColor.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b, a: 0.75 };
    }
    
    return { r: 168, g: 85, b: 247, a: 0.75 };
  };

  const [title, setTitle] = useState(modalState.event?.title || '');
  const [description, setDescription] = useState(modalState.event?.description || '');
  const [rgba, setRgba] = useState<RGBA>(parseInitialColor(modalState.event?.color));

  const handleClose = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const rgbaToCss = (color: RGBA) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

  const handleSave = async () => {
    const colorStr = rgbaToCss(rgba);
    if (modalState.type === 'add' && modalState.event) {
      await addEvent({
        ...modalState.event,
        title: title || 'New Activity',
        description: description,
        color: colorStr,
        start: modalState.event.start!,
        end: modalState.event.end || new Date(modalState.event.start!.getTime() + CALENDAR_CONFIG.DEFAULT_EVENT_DURATION_MINS * 60 * 1000),
      } as CalendarEvent);
    } else if (modalState.type === 'edit' && modalState.event?.id) {
      await updateEvent(modalState.event.id, {
        title: title,
        description: description,
        color: colorStr,
      });
    }
    handleClose();
  };

  const handleDelete = async () => {
    if (modalState.event?.id) {
      await deleteEvent(modalState.event.id);
    }
    handleClose();
  };

  const handleSelectPreset = (text: string) => {
    setDescription(text);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-brand-surface shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <h2 className="text-lg font-semibold text-white">
            {modalState.type === 'add' ? 'New Activity' : 'Edit Activity'}
          </h2>
          <button 
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Activity
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Activity name"
              className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              autoFocus
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Guiding Principle
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What guides this activity?"
              className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              autoComplete="off"
            />
            {principles.length > 0 && (
              <div className="relative mt-2">
                <select
                  onChange={(e) => handleSelectPreset(e.target.value)}
                  className="w-full appearance-none rounded-lg bg-white/5 border border-white/10 p-2 pl-3 pr-10 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all cursor-pointer"
                  value=""
                >
                  <option value="" disabled>Select from presets...</option>
                  {principles.map((p) => (
                    <option key={p.id} value={p.text}>{p.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Color & Transparency
            </label>
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-full custom-color-picker">
                <RgbaColorPicker color={rgba} onChange={setRgba} />
              </div>
              <div className="w-full h-8 rounded-lg border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400" style={{ backgroundColor: rgbaToCss(rgba) }}>
                {rgbaToCss(rgba)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] p-4">
          {modalState.type === 'edit' ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-brand-primary px-6 py-2 text-sm font-medium text-white shadow-lg shadow-brand-primary/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
