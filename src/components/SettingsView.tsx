import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, ChevronDown, ChevronUp, BookOpen, Plus, Trash2, Edit2, Check, X, Download, Upload, RefreshCw, Wand2, FileText, Scroll } from 'lucide-react';
import { useMountain } from '../hooks/useMountain';
import { useActivity } from '../hooks/useActivity';
import { useEvents } from '../hooks/useEvents';
import { useAppContext } from '../hooks/useAppContext';
import { db, type Mountain, type UnscheduledTask } from '../db/db';
import { exportDB, importInto } from 'dexie-export-import';
import { parseMountains } from '../utils/mountainParser';
import { notify } from '../utils/notifications';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-brand-primary">{icon}</div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const SettingsView: React.FC = () => {
  const { mountains, addMountain, bulkAddMountains, updateMountain, deleteMountain } = useMountain();
  const { activities, reorderActivities } = useActivity();
  const { addEvent } = useEvents();
  const { setModalState } = useAppContext();
  const dbImportRef = useRef<HTMLInputElement>(null);
  const mountainsImportRef = useRef<HTMLInputElement>(null);

  // Activity Section State
  const [selectedActivityIds, setSelectedActivityIds] = useState<Set<number>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedActivities, setDraggedActivities] = useState<UnscheduledTask[] | null>(null);

  const displayActivities = draggedActivities || activities;

  // Mountain Section State
  const [isAddingMountain, setIsAddingMountain] = useState(false);
  const [editingMountainId, setEditingMountainId] = useState<number | null>(null);
  const [newMountainLabel, setNewMountainLabel] = useState('');
  const [newMountainText, setNewMountainText] = useState('');
  const [editMountainLabel, setEditMountainLabel] = useState('');
  const [editMountainText, setEditMountainText] = useState('');

  const handleAddMountain = async () => {
    if (newMountainLabel && newMountainText) {
      await addMountain({ label: newMountainLabel, text: newMountainText });
      setNewMountainLabel('');
      setNewMountainText('');
      setIsAddingMountain(false);
    }
  };

  const handleStartEditMountain = (v: Mountain) => {
    setEditingMountainId(v.id!);
    setEditMountainLabel(v.label);
    setEditMountainText(v.text);
  };

  const handleSaveEditMountain = async (id: number) => {
    if (editMountainLabel && editMountainText) {
      await updateMountain(id, { label: editMountainLabel, text: editMountainText });
      setEditingMountainId(null);
    }
  };

  const handleMountainsImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content) return;

      const parsed = parseMountains(content);
      if (parsed.length > 0) {
        await bulkAddMountains(parsed);
        notify.success(`Successfully imported ${parsed.length} mountain items!`);
      } else {
        notify.error('No valid mountain items found in the file. Please check the format.');
      }

      // Reset input
      if (mountainsImportRef.current) mountainsImportRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Data Management Handlers
  const handleExport = async () => {
    try {
      const blob = await exportDB(db);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      notify.error('Failed to export data.');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importInto(db, file, { overwriteValues: true });
      notify.success('Data imported successfully! The page will reload.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Import failed:', error);
      notify.error('Failed to import data. Please ensure the file is a valid backup.');
    }
  };

  const handlePurge = async () => {
    const result = await notify.confirm(
      'Are you absolutely sure?',
      'This will delete ALL activities, and mountains. This action cannot be undone.'
    );

    if (result.isConfirmed) {
      try {
        await Promise.all([
          db.events.clear(),
          db.mountains.clear(),
          db.activities.clear()
        ]);
        notify.success('All data has been purged.');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error('Purge failed:', error);
        notify.error('Failed to purge data.');
      }
    }
  };

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

    const now = new Date();
    // 15m precision
    const startOfNextSlot = new Date(now);
    const minutes = startOfNextSlot.getMinutes();
    const nextSlotMinutes = Math.ceil((minutes + 1) / 15) * 15;
    startOfNextSlot.setMinutes(nextSlotMinutes, 0, 0);

    let currentTime = startOfNextSlot.getTime();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    for (const activity of selectedActivities) {
      const startTime = new Date(currentTime);
      const endTime = new Date(currentTime + activity.duration * 60 * 1000);

      if (endTime.getTime() <= endOfDay.getTime()) {
        await addEvent({
          title: activity.title,
          description: activity.description,
          start: startTime,
          end: endTime,
          color: activity.color,
        });
        // Update currentTime for next activity: end of current + 15m gap
        currentTime = endTime.getTime() + 15 * 60 * 1000;
      } else {
        console.warn(`Activity "${activity.title}" skipped: falls outside current day.`);
      }
    }

    setSelectedActivityIds(new Set());
    notify.success('Activities scheduled successfully!');
  };

  // Drag and Drop Handlers
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
    <div className="h-full w-full overflow-y-auto p-4 space-y-6 pb-16">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary">
          <SettingsIcon size={24} />
        </div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="space-y-4">
        {/* Guide Section */}
        <CollapsibleSection title="Guide" icon={<Scroll size={20} />} defaultOpen={false}>
          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <div>
              <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Effort over Result</h3>
              <p>Focus on the effort, which is entirely within your control, rather than the result, which often is not. Define success by the integrity of your effort, regardless of the final result.</p>
            </div>

            <div>
              <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Effort over Planning</h3>
              <p>Effort builds momentum and leads to clarity, whereas planning often leads to disappointment or paralysis.</p>
            </div>

            <div>
              <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Consistent & Sustainable Effort</h3>
              <p>Focus on tiny, consistent efforts, which are manageable, rather than occasional massive efforts, which are not sustainable.</p>
            </div>

            <div>
              <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Validation in Effort</h3>
              <p>Find validation in your own effort, which is yours to maintain, rather than in the opinions of others, which you cannot dictate.</p>
            </div>

            <div>
              <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Effort in the Present</h3>
              <p>Live in the present, which is the only place where your effort has power, rather than in the past or future, which you cannot influence.</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Activity Section */}
        <CollapsibleSection title="Activity" icon={<Wand2 size={20} />} defaultOpen={false}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddActivity}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20"
              >
                <Plus size={18} />
                Add
              </button>

              <button
                onClick={handleAutoSchedule}
                disabled={selectedActivityIds.size === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
              >
                <RefreshCw size={18} className={selectedActivityIds.size > 0 ? "animate-spin-slow" : ""} />
                Schedule
              </button>
            </div>

            <div className="grid gap-2">
              {displayActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  onClick={() => handleEditActivity(activity)}
                  className={`group flex items-center rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/[0.07] transition-all cursor-pointer min-w-0 ${draggedIndex === index ? 'opacity-20 border-brand-primary scale-[0.98]' : ''}`}
                >
                  {/* Left Side: Checkbox */}
                  <div className="flex items-center flex-shrink-0 mr-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleActivitySelection(activity.id!); }}
                      onDragStart={(e) => e.stopPropagation()}
                      className="relative flex items-center justify-center transition-all"
                    >
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedActivityIds.has(activity.id!)
                          ? 'bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/40'
                          : 'border-white/20 bg-white/5 group-hover:border-white/40'
                      }`}>
                        {selectedActivityIds.has(activity.id!) && <Check size={14} className="text-white stroke-[3]" />}
                      </div>
                    </button>
                  </div>

                  {/* Title: Takes remaining space */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-white block truncate">
                      {activity.title}
                    </span>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="py-8 text-center space-y-2 border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-gray-500 text-sm">No activities to schedule yet.</p>
                  <button onClick={handleAddActivity} className="text-brand-primary text-sm hover:underline">Add your first activity</button>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Mountain Section */}
        <CollapsibleSection title="Mountain" icon={<BookOpen size={20} />} defaultOpen={false}>
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <button
                onClick={() => mountainsImportRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all"
              >
                <FileText size={18} />
                Import
              </button>
              <button
                onClick={() => setIsAddingMountain(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all"
              >
                <Plus size={18} />
                Add
              </button>
              <input
                type="file"
                ref={mountainsImportRef}
                onChange={handleMountainsImport}
                accept=".txt,.md"
                className="hidden"
              />
            </div>

            {isAddingMountain && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4 animate-in fade-in zoom-in duration-200">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={newMountainLabel}
                    onChange={(e) => setNewMountainLabel(e.target.value)}
                    placeholder="e.g., Focus"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Mountain</label>
                  <textarea
                    value={newMountainText}
                    onChange={(e) => setNewMountainText(e.target.value)}
                    placeholder="Describe your mountain..."
                    rows={3}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary/50 transition-colors resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddingMountain(false)}
                    className="px-4 py-2 rounded-lg text-gray-400 text-sm font-medium hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMountain}
                    className="px-6 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:brightness-110 active:scale-95 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {mountains.map((v) => (
                <div key={v.id} className="group relative p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all">
                  {editingMountainId === v.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editMountainLabel}
                        onChange={(e) => setEditMountainLabel(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-brand-primary"
                      />
                      <textarea
                        value={editMountainText}
                        onChange={(e) => setEditMountainText(e.target.value)}
                        rows={3}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingMountainId(null)} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
                        <button onClick={() => handleSaveEditMountain(v.id!)} className="p-2 text-brand-primary hover:text-brand-primary/80 transition-colors"><Check size={18} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-brand-primary font-bold uppercase tracking-wider text-sm">{v.label}</h4>
                        <div className="flex gap-1">
                          <button onClick={() => handleStartEditMountain(v)} className="p-2 text-gray-400 hover:text-brand-primary active:bg-brand-primary/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => deleteMountain(v.id!)} className="p-2 text-gray-400 hover:text-red-400 active:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{v.text}</p>
                    </>
                  )}
                </div>
              ))}

              {mountains.length === 0 && !isAddingMountain && (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-gray-500 text-sm">No mountain items defined yet.</p>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Data Management Section */}
        <CollapsibleSection title="Data Management" icon={<RefreshCw size={20} />} defaultOpen={false}>
          <div className="space-y-6 py-2">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300">Import / Export</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Backup your data to a JSON file or restore it from a previous backup.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 active:scale-95 transition-all"
                >
                  <Upload size={16} />
                  Export JSON
                </button>
                <button
                  onClick={() => dbImportRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 active:scale-95 transition-all"
                >
                  <Download size={16} />
                  Import JSON
                </button>
                <input
                  type="file"
                  ref={dbImportRef}
                  onChange={handleImport}
                  accept=".json"
                  className="hidden"
                />
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Clear all data from the application. This will permanently delete all your activities, and mountains.
              </p>
              <button
                onClick={handlePurge}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <Trash2 size={16} />
                Purge All Data
              </button>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default SettingsView;
