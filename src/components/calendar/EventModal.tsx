import React, { useState } from 'react';
import { X, Trash2, ChevronDown, ChevronRight, Sparkles, Check } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { useEvents } from '../../hooks/useEvents';
import { useActivity } from '../../hooks/useActivity';
import { useMountain } from '../../hooks/useMountain';
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
  const { addActivity, updateActivity, deleteActivity, activities } = useActivity();
  const { mountains } = useMountain();

  const isEventMode = modalState.mode === 'event';
  const item = isEventMode ? modalState.event : modalState.task;

  const parseInitialColor = (color?: string): RGBA => {
    if (!color) return { r: 168, g: 85, b: 247, a: 0.75 }; // Default Violet

    if (color.startsWith('rgba')) {
      const parts = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (parts) {
        return {
          r: parseInt(parts[1]),
          g: parseInt(parts[2]),
          b: parseInt(parts[3]),
          a: parts[4] ? parseFloat(parts[4]) : 0.75
        };
      }
    } else if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b, a: 0.75 };
    }

    return { r: 168, g: 85, b: 247, a: 0.75 };
  };

  const getInitialDuration = () => {
    if (isEventMode && modalState.event?.start && modalState.event?.end) {
      return Math.round((modalState.event.end.getTime() - modalState.event.start.getTime()) / (60 * 1000));
    }
    if (!isEventMode && modalState.task?.duration) {
      return modalState.task.duration;
    }
    return CALENDAR_CONFIG.DEFAULT_EVENT_DURATION_MINS;
  };

  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [rgba, setRgba] = useState<RGBA>(parseInitialColor(item?.color));
  const [duration, setDuration] = useState(getInitialDuration());
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showMountains, setShowMountains] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  const COLOR_PRESETS: RGBA[] = [
    { r: 168, g: 85, b: 247, a: 0.75 }, // Purple (Primary)
    { r: 59, g: 130, b: 246, a: 0.75 }, // Blue
    { r: 34, g: 197, b: 94, a: 0.75 },  // Green
    { r: 234, g: 179, b: 8, a: 0.75 },  // Yellow
    { r: 249, g: 115, b: 22, a: 0.75 }, // Orange
    { r: 239, g: 68, b: 68, a: 0.75 },  // Red
  ];

  const handleClose = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const rgbaToCss = (color: RGBA) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

  const handleActivitySelect = (activity: any) => {
    setTitle(activity.title);
    if (activity.description) setDescription(activity.description);
    setDuration(activity.duration);
    if (activity.color) setRgba(parseInitialColor(activity.color));
    setShowActivities(false);
  };

  const handleSave = async () => {
    const colorStr = rgbaToCss(rgba);

    if (isEventMode) {
      if (modalState.type === 'add' && modalState.event) {
        const start = modalState.event.start!;
        const end = new Date(start.getTime() + duration * 60 * 1000);
        await addEvent({
          ...modalState.event,
          title: title || 'New Effort',
          description: description,
          color: colorStr,
          start,
          end,
        } as CalendarEvent);
      } else if (modalState.type === 'edit' && modalState.event?.id) {
        const updates: Partial<CalendarEvent> = {
          title: title,
          description: description,
          color: colorStr,
        };
        if (modalState.event.start) {
          updates.end = new Date(modalState.event.start.getTime() + duration * 60 * 1000);
        }
        await updateEvent(modalState.event.id, updates);
      }
    } else {
      // Activity (Task) Mode
      if (modalState.type === 'add') {
        await addActivity({
          title: title || 'New Activity',
          description: description,
          duration,
          color: colorStr,
          order: activities.length,
        });
      } else if (modalState.type === 'edit' && modalState.task?.id) {
        await updateActivity(modalState.task.id, {
          title,
          description,
          duration,
          color: colorStr,
        });
      }
    }
    handleClose();
  };

  const handleDelete = async () => {
    if (isEventMode) {
      if (modalState.event?.id) {
        await deleteEvent(modalState.event.id);
      }
    } else {
      if (modalState.task?.id) {
        await deleteActivity(modalState.task.id);
      }
    }
    handleClose();
  };

  const modalTitle = modalState.type === 'add'
    ? (isEventMode ? 'New Effort' : 'New Activity')
    : (isEventMode ? 'Edit Effort' : 'Edit Activity');

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md flex flex-col max-h-[90vh] rounded-2xl border border-white/10 bg-brand-surface shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex-shrink-0 flex items-center justify-between border-b border-white/5 p-3 px-4">
          <h2 className="text-base font-semibold text-white">
            {modalTitle}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 py-3 space-y-3 custom-scrollbar">
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                My efforts
              </label>
              <button
                onClick={() => setShowActivities(!showActivities)}
                className="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium text-gray-400 hover:bg-white/10 hover:text-brand-primary transition-colors"
              >
                <Sparkles size={12} />
                Presets
              </button>
            </div>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe your efforts..."
              rows={2}
              className="w-full rounded-lg bg-white/5 border border-white/10 p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all resize-none overflow-y-auto"
              autoComplete="off"
            />

            {showActivities && activities.length > 0 && (
              <div className="absolute z-10 top-full mt-1 w-full overflow-hidden rounded-lg border border-white/10 bg-brand-surface shadow-xl animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="max-h-40 overflow-y-auto p-1">
                  {activities.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleActivitySelect(r)}
                      className="w-full rounded-md px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <div className="font-medium text-xs">{r.title}</div>
                      <div className="text-[10px] text-gray-500 truncate">{r.description || `${r.duration} mins`}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">
              duration
            </label>
            <div className="flex gap-2">
              {[15, 30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    duration === d
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
              <span className="text-[10px] text-gray-500 self-center ml-1">min</span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                mountain
              </label>
              <button
                onClick={() => setShowMountains(!showMountains)}
                className="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium text-gray-400 hover:bg-white/10 hover:text-brand-primary transition-colors"
              >
                <Sparkles size={12} />
                Presets
              </button>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sometimes, you must ensure you are climbing the right mountain."
              rows={2}
              className="w-full rounded-lg bg-white/5 border border-white/10 p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all resize-none overflow-y-auto"
              autoComplete="off"
            />

            {showMountains && mountains.length > 0 && (
              <div className="absolute z-10 bottom-full mb-1 w-full overflow-hidden rounded-lg border border-white/10 bg-brand-surface shadow-xl animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="max-h-40 overflow-y-auto p-1">
                  {mountains.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setDescription(v.text);
                        setShowMountains(false);
                      }}
                      className="w-full rounded-md px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <div className="text-[10px] text-gray-400 line-clamp-2">{v.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Color Presets
              </label>
              <div className="flex justify-between items-center px-1">
                {COLOR_PRESETS.map((p, idx) => {
                  const cssColor = rgbaToCss(p);
                  const glassColor = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a * 0.5})`;
                  const isSelected = rgba.r === p.r && rgba.g === p.g && rgba.b === p.b;

                  return (
                    <button
                      key={idx}
                      onClick={() => setRgba(p)}
                      className={`w-9 h-9 rounded-full solo-glass solo-aura transition-all duration-300 relative ${
                        isSelected ? 'scale-110 ring-2 ring-white/50' : 'hover:scale-105'
                      }`}
                      style={{
                        '--event-bg-glass': glassColor,
                        '--event-glow': cssColor
                      } as React.CSSProperties}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="flex items-center justify-between w-full text-[10px] font-medium text-gray-400 uppercase tracking-wider"
              >
                <span>Custom Color & Transparency</span>
                {isColorPickerOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isColorPickerOpen && (
                <div className="flex flex-col gap-4 py-1 animate-in slide-in-from-top-2 duration-200">
                  <div className="w-full custom-color-picker flex justify-center">
                    <RgbaColorPicker color={rgba} onChange={setRgba} />
                  </div>
                  <div className="w-full h-7 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-mono text-gray-400" style={{ backgroundColor: rgbaToCss(rgba) }}>
                    {rgbaToCss(rgba)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-between border-t border-white/5 bg-white/[0.02] p-3 px-4">
          {modalState.type === 'edit' ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-brand-primary px-5 py-1.5 text-xs font-medium text-white shadow-lg shadow-brand-primary/20 hover:brightness-110 active:scale-95 transition-all"
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
