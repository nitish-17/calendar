import React, { useState } from 'react';
import { X, Trash2, ChevronDown, ChevronRight, Sparkles, Check, Save } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { useEvents } from '../../hooks/useEvents';
import { useActivity } from '../../hooks/useActivity';
import { useMountain } from '../../hooks/useMountain';
import { CALENDAR_CONFIG } from '../../constants/calendar';
import type { CalendarEvent, UnscheduledTask } from '../../db/db';
import { RgbaColorPicker } from 'react-colorful';
import { notify } from '../../utils/notifications';

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

const EventModal: React.FC = React.memo(() => {
  const { modalState, setModalState } = useAppContext();
  const { addEvent, updateEvent, deleteEvent } = useEvents();
  const { addActivity, updateActivity, deleteActivity, activities } = useActivity();
  const { mountains, addMountain } = useMountain();

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

  const COLOR_PRESETS: (RGBA & { label: string })[] = [
    { r: 168, g: 85, b: 247, a: 0.75, label: 'Log' },
    { r: 59, g: 130, b: 246, a: 0.75, label: 'TBD' },
    { r: 34, g: 197, b: 94, a: 0.75, label: 'Easy' },
    { r: 234, g: 179, b: 8, a: 0.75, label: 'Moderate' },
    { r: 249, g: 115, b: 22, a: 0.75, label: 'Hard' },
    { r: 239, g: 68, b: 68, a: 0.75, label: 'Tough' },
  ];

  const handleClose = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const rgbaToCss = (color: RGBA) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

  const handleActivitySelect = (activity: UnscheduledTask) => {
    setTitle(activity.title);
    setDescription(activity.description || '');
    setDuration(activity.duration);
    if (activity.color) setRgba(parseInitialColor(activity.color));
    setShowActivities(false);
  };

  const handleSaveActivityPreset = async () => {
    if (!title.trim()) {
      notify.error('Please enter a title for the activity preset.');
      return;
    }
    await addActivity({
      title: title.trim(),
      description: description.trim(),
      duration,
      color: rgbaToCss(rgba),
      order: activities.length,
    });
    notify.success('Activity preset saved!');
  };

  const handleSaveMountainPreset = async () => {
    if (!description.trim()) {
      notify.error('Please enter text for the mountain preset.');
      return;
    }
    await addMountain({
      text: description.trim(),
    });
    notify.success('Mountain preset saved!');
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
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md flex flex-col max-h-[92vh] rounded-t-xl sm:rounded-xl border-x border-t sm:border border-white/10 bg-black animate-in slide-in-from-bottom duration-300">
        <div className="flex-shrink-0 flex items-center justify-between border-b border-white/5 p-3 px-4">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {modalTitle}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                My efforts
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowActivities(!showActivities)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/5 bg-white/[0.03] text-[9px] font-bold text-gray-400 hover:text-brand-primary transition-colors uppercase tracking-tight"
                >
                  <Sparkles size={10} />
                  PRESETS
                </button>
                <button
                  onClick={handleSaveActivityPreset}
                  className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/5 bg-white/[0.03] text-[9px] font-bold text-gray-400 hover:text-green-500 transition-colors uppercase tracking-tight"
                >
                  <Save size={10} />
                  SAVE
                </button>
              </div>
            </div>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe your efforts..."
              rows={2}
              className="w-full rounded-lg bg-white/[0.03] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary/50 transition-all resize-none font-medium"
              autoComplete="off"
            />

            {showActivities && activities.length > 0 && (
              <div className="absolute z-10 top-full mt-1 w-full overflow-hidden rounded-lg border border-white/10 bg-black animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="max-h-40 overflow-y-auto p-1">
                  {activities.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleActivitySelect(r)}
                      className="w-full rounded-md px-3 py-2 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                    >
                      <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">{r.title}</div>
                      <div className="text-[9px] text-gray-600 font-medium truncate">{r.description || `${r.duration} MIN`}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              duration (min)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-2 rounded-lg border text-[11px] font-bold transition-all ${
                    duration === d
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : 'bg-white/[0.03] border-white/10 text-gray-500 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                mountain
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowMountains(!showMountains)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/5 bg-white/[0.03] text-[9px] font-bold text-gray-400 hover:text-brand-primary transition-colors uppercase tracking-tight"
                >
                  <Sparkles size={10} />
                  PRESETS
                </button>
                <button
                  onClick={handleSaveMountainPreset}
                  className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/5 bg-white/[0.03] text-[9px] font-bold text-gray-400 hover:text-green-500 transition-colors uppercase tracking-tight"
                >
                  <Save size={10} />
                  SAVE
                </button>
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vision, Goal or Guiding Principle"
              rows={2}
              className="w-full rounded-lg bg-white/[0.03] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary/50 transition-all resize-none font-medium"
              autoComplete="off"
            />

            {showMountains && mountains.length > 0 && (
              <div className="absolute z-10 bottom-full mb-1 w-full overflow-hidden rounded-lg border border-white/10 bg-black animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="max-h-40 overflow-y-auto p-1">
                  {mountains.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setDescription(v.text);
                        setShowMountains(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                    >
                      <div className="text-[10px] text-gray-500 font-medium line-clamp-2">{v.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Style Preset
              </label>
              <div className="flex justify-between items-start bg-white/[0.02] p-2 py-3 rounded-xl border border-white/5">
                {COLOR_PRESETS.map((p, idx) => {
                  const cssColor = rgbaToCss(p);
                  const glassColor = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a * 0.5})`;
                  const isSelected = rgba.r === p.r && rgba.g === p.g && rgba.b === p.b;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                      <button
                        onClick={() => setRgba(p)}
                        className={`w-9 h-9 rounded-full solo-glass solo-aura transition-all duration-300 relative ${
                          isSelected ? 'scale-110' : 'hover:scale-105 opacity-60'
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
                      <span className={`text-[8px] font-bold uppercase tracking-tighter transition-colors ${isSelected ? 'text-brand-primary' : 'text-gray-600'}`}>
                        {p.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="flex items-center justify-between w-full text-[10px] font-bold text-gray-500 uppercase tracking-widest"
              >
                <span>Advanced Color</span>
                {isColorPickerOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isColorPickerOpen && (
                <div className="flex flex-col gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] animate-in slide-in-from-top-2 duration-200">
                  <div className="w-full custom-color-picker flex justify-center">
                    <RgbaColorPicker color={rgba} onChange={setRgba} />
                  </div>
                  <div className="w-full py-1 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-mono text-gray-500" style={{ backgroundColor: rgbaToCss(rgba) }}>
                    {rgbaToCss(rgba)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-between border-t border-white/5 bg-white/[0.01] p-4 pb-8 sm:pb-4">
          {modalState.type === 'edit' ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-red-500/80 hover:bg-red-500/10 transition-colors uppercase"
            >
              <Trash2 size={14} />
              Delete
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-[11px] font-bold text-gray-500 hover:text-white transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 rounded-lg bg-brand-primary text-white text-[11px] font-bold hover:brightness-110 active:scale-95 transition-all uppercase tracking-wider"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EventModal;
