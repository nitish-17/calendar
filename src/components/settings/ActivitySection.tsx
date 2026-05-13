import React, { useState } from 'react';
import { Plus, RefreshCw, Check, Wand2 } from 'lucide-react';
import { useActivity } from '../../hooks/useActivity';
import { useAppContext } from '../../hooks/useAppContext';
import { CollapsibleSection } from './CollapsibleSection';
import { notify } from '../../utils/notifications';
import { SchedulingService } from '../../services/schedulingService';
import type { UnscheduledTask } from '../../db/db';

export const ActivitySection: React.FC = () => {
  const { activities, reorderActivities } = useActivity();
  const { setModalState } = useAppContext();

  const [selectedActivityIds, setSelectedActivityIds] = useState<Set<number>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedActivities, setDraggedActivities] = useState<UnscheduledTask[] | null>(null);

  const displayActivities = draggedActivities || activities;

  const handleAddActivity = () => {
    setModalState({
      isOpen: true,
      type: 'add',
      mode: 'task',
      task: {
        title: '',
        duration: 15,
        color: 'rgba(168, 85, 247, 0.75)',
      }
    });
  };

  const handleEditActivity = (task: UnscheduledTask) => {
    setModalState({
      isOpen: true,
      type: 'edit',
      mode: 'task',
      task
    });
  };

  const toggleActivitySelection = (id: number) => {
    const newSelected = new Set(selectedActivityIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedActivityIds(newSelected);
  };

  const handleAutoSchedule = async () => {
    const selectedActivities = activities.filter(r => selectedActivityIds.has(r.id!));
    if (selectedActivities.length === 0) return;

    try {
      await SchedulingService.autoSchedule(selectedActivities);
      setSelectedActivityIds(new Set());
      notify.success('Activities scheduled successfully!');
    } catch (error) {
      console.error('Auto-scheduling failed:', error);
      notify.error('Failed to schedule activities.');
    }
  };

  const onDragStart = (index: number) => {
    setDraggedIndex(index);
    setDraggedActivities([...activities]);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || !draggedActivities) return;

    const newActivities = [...draggedActivities];
    const draggedItem = newActivities[draggedIndex];
    newActivities.splice(draggedIndex, 1);
    newActivities.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setDraggedActivities(newActivities);
  };

  const onDragEnd = () => {
    if (draggedActivities) {
      reorderActivities(draggedActivities);
    }
    setDraggedIndex(null);
    setDraggedActivities(null);
  };

  return (
    <CollapsibleSection title="Activity" icon={<Wand2 size={18} />} defaultOpen={true}>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddActivity}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-[14px] font-bold hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            ADD ACTIVITY
          </button>

          <button
            onClick={handleAutoSchedule}
            disabled={selectedActivityIds.size === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-slate-100 text-[14px] font-bold hover:bg-slate-700 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
          >
            <RefreshCw size={18} className={selectedActivityIds.size > 0 ? "animate-spin-slow" : ""} />
            SCHEDULE
          </button>
        </div>

        <div className="space-y-2">
          {displayActivities.map((activity, index) => (
            <div
              key={activity.id}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              onClick={() => handleEditActivity(activity)}
              className={`group flex items-center rounded-xl border border-white/[0.03] bg-white/[0.02] p-3 hover:bg-white/[0.05] transition-all cursor-pointer min-w-0 ${draggedIndex === index ? 'opacity-20 border-indigo-500 scale-[0.98]' : ''}`}
            >
              <div className="flex items-center flex-shrink-0 mr-3">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleActivitySelection(activity.id!); }}
                  onDragStart={(e) => e.stopPropagation()}
                  className="relative flex items-center justify-center transition-all"
                >
                  <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                    selectedActivityIds.has(activity.id!)
                      ? 'bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/30'
                      : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'
                  }`}>
                    {selectedActivityIds.has(activity.id!) && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-bold text-slate-200 block truncate uppercase tracking-tight">
                  {activity.title}
                </span>
                <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider mt-0.5">
                  {activity.duration} MIN
                </span>
              </div>

              <div className="ml-2 text-slate-700 group-hover:text-slate-500 cursor-grab active:cursor-grabbing p-1">
                <Plus size={16} className="rotate-45" /> {/* Placeholder for drag icon */}
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-white/[0.03] rounded-2xl">
              <p className="text-slate-600 text-sm font-bold tracking-wider">No activities added yet</p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};
