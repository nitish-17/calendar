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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddActivity}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-primary text-white text-[11px] font-bold hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus size={14} />
            ADD ACTIVITY
          </button>

          <button
            onClick={handleAutoSchedule}
            disabled={selectedActivityIds.size === 0}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-white text-[11px] font-bold hover:bg-white/10 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
          >
            <RefreshCw size={14} className={selectedActivityIds.size > 0 ? "animate-spin-slow" : ""} />
            SCHEDULE
          </button>
        </div>

        <div className="grid gap-1.5">
          {displayActivities.map((activity, index) => (
            <div
              key={activity.id}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              onClick={() => handleEditActivity(activity)}
              className={`group flex items-center rounded-lg border border-white/5 bg-white/[0.02] p-2.5 hover:bg-white/[0.05] transition-all cursor-pointer min-w-0 ${draggedIndex === index ? 'opacity-20 border-brand-primary scale-[0.98]' : ''}`}
            >
              <div className="flex items-center flex-shrink-0 mr-2.5">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleActivitySelection(activity.id!); }}
                  onDragStart={(e) => e.stopPropagation()}
                  className="relative flex items-center justify-center transition-all"
                >
                  <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                    selectedActivityIds.has(activity.id!)
                      ? 'bg-brand-primary border-brand-primary'
                      : 'border-white/20 bg-black group-hover:border-white/40'
                  }`}>
                    {selectedActivityIds.has(activity.id!) && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-gray-300 block truncate uppercase tracking-tight">
                  {activity.title}
                </span>
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">
                  {activity.duration} MIN
                </span>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
              <p className="text-gray-600 text-[11px] font-bold uppercase tracking-wider">No activities</p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};
