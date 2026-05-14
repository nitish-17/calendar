import React, { useState } from 'react';
import { X, Trash2, ChevronRight, Sparkles, Check, Save } from 'lucide-react';
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
    if (!color) return { r: 99, g: 102, b: 241, a: 0.75 }; // Default Indigo

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

    return { r: 99, g: 102, b: 241, a: 0.75 };
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
    { r: 99, g: 102, b: 241, a: 0.75, label: 'Log' },
    { r: 168, g: 85, b: 247, a: 0.75, label: 'TBD' },
    { r: 34, g: 197, b: 94, a: 0.75, label: 'Easy' },
    { r: 234, g: 179, b: 8, a: 0.75, label: 'Mod.' },
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
    <div className="fixed inset-0 z-[1000] flex items-end justify-center p-0 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md flex flex-col max-h-[92vh] rounded-t-[2.5rem] bg-slate-900 shadow-2xl shadow-black/50 border-t border-white/[0.05] animate-in slide-in-from-bottom duration-500 ease-out">
        {/* Handle bar for bottom sheet look */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/50" />
        </div>

        <div className="flex-shrink-0 flex items-center justify-between px-6 py-2">
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            {modalTitle}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar pb-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-indigo-400 uppercase tracking-widest">
                My Efforts
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowActivities(!showActivities)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider ${
                    showActivities
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/[0.03]'
                  }`}
                >
                  <Sparkles size={14} />
                  Presets
                </button>
                <button
                  onClick={handleSaveActivityPreset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-amber-400 hover:text-amber-300 text-[11px] font-bold border border-white/[0.03] transition-all uppercase tracking-wider"
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            </div>

            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe your effort..."
              rows={2}
              className="w-full rounded-2xl bg-slate-800/50 border border-white/[0.05] p-4 text-[15px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all resize-none font-medium leading-relaxed"
              autoComplete="off"
            />

            {showActivities && activities.length > 0 && (
              <div className="absolute z-20 mt-1 w-[calc(100%-3rem)] left-6 overflow-hidden rounded-2xl border border-white/[0.05] bg-slate-800 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="max-h-56 overflow-y-auto p-2">
                  {activities.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleActivitySelect(r)}
                      className="w-full rounded-xl px-4 py-3 text-left hover:bg-white/[0.03] transition-colors flex flex-col gap-1 border-b border-white/[0.03] last:border-none"
                    >
                      <div className="text-sm font-bold text-slate-100 uppercase tracking-tight">{r.title}</div>
                      <div className="text-xs text-slate-500 font-medium truncate">{r.description || `${r.duration} MIN`}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-[13px] font-bold text-indigo-400 uppercase tracking-widest">
              Duration (Min)
            </label>
            <div className="flex flex-wrap gap-4">
              {[15, 30, 60, 90, 120, 150].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border text-xs font-bold transition-all ${
                    duration === d
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-800/50 border-white/[0.05] text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-indigo-400 uppercase tracking-widest">
                Mountain
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMountains(!showMountains)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider ${
                    showMountains
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/[0.03]'
                  }`}
                >
                  <Sparkles size={14} />
                  Presets
                </button>
                <button
                  onClick={handleSaveMountainPreset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-amber-400 hover:text-amber-300 text-[11px] font-bold border border-white/[0.03] transition-all uppercase tracking-wider"
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Your vision or guiding principle"
              rows={2}
              className="w-full rounded-2xl bg-slate-800/50 border border-white/[0.05] p-4 text-[15px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all resize-none font-medium leading-relaxed"
              autoComplete="off"
            />

            {showMountains && mountains.length > 0 && (
              <div className="absolute z-20 mt-1 w-[calc(100%-3rem)] left-6 bottom-32 overflow-hidden rounded-2xl border border-white/[0.05] bg-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="max-h-56 overflow-y-auto p-2">
                  {mountains.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setDescription(v.text);
                        setShowMountains(false);
                      }}
                      className="w-full rounded-xl px-4 py-3.5 text-left hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] last:border-none"
                    >
                      <div className="text-sm text-slate-200 font-medium line-clamp-2">{v.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-[13px] font-bold text-indigo-400 uppercase tracking-widest">
                Style Preset
              </label>
              <div className="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-white/[0.05]">
                {COLOR_PRESETS.map((p, idx) => {
                  const cssColor = rgbaToCss(p);
                  const glassColor = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a * 0.5})`;
                  const isSelected = rgba.r === p.r && rgba.g === p.g && rgba.b === p.b;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2.5">
                      <button
                        onClick={() => setRgba(p)}
                        className={`w-10 h-10 rounded-full solo-glass solo-aura transition-all duration-300 relative ${
                          isSelected ? 'scale-110 shadow-xl' : 'hover:scale-105 opacity-60'
                        }`}
                        style={{
                          '--event-bg-glass': glassColor,
                          '--event-glow': cssColor
                        } as React.CSSProperties}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check size={18} className="text-white drop-shadow-md" />
                          </div>
                        )}
                      </button>
                      <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`}>
                        {p.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="flex items-center justify-between w-full text-[13px] font-bold text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-widest"
              >
                <span>Advanced Color</span>
                <ChevronRight size={18} className={`transition-transform duration-300 ${isColorPickerOpen ? 'rotate-90' : ''}`} />
              </button>

              {isColorPickerOpen && (
                <div className="flex flex-col gap-5 p-5 rounded-2xl border border-white/[0.05] bg-slate-800/30 animate-in slide-in-from-top-4 duration-400 ease-out">
                  <div className="w-full custom-color-picker flex justify-center">
                    <RgbaColorPicker color={rgba} onChange={setRgba} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-between px-6 py-6 bg-slate-950/30 border-t border-white/[0.05]">
          {modalState.type === 'edit' ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
            >
              <Trash2 size={18} />
              Delete
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-200 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-10 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 active:scale-95 shadow-xl shadow-indigo-500/30 transition-all uppercase tracking-wider"
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
