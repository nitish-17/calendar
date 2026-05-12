import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, ChevronDown, ChevronUp, BookOpen, Plus, Trash2, Edit2, Check, X, Download, Upload, RefreshCw, Wand2, FileText, Scroll } from 'lucide-react';
import { useVision } from '../hooks/useVision';
import { useRoutine } from '../hooks/useRoutine';
import { useEvents } from '../hooks/useEvents';
import { useAppContext } from '../hooks/useAppContext';
import { db, type Vision, type UnscheduledTask } from '../db/db';
import { exportDB, importInto } from 'dexie-export-import';
import { parseVisions } from '../utils/visionParser';
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
  const { visions, addVision, bulkAddVisions, updateVision, deleteVision } = useVision();
  const { routines, reorderRoutines } = useRoutine();
  const { addEvent } = useEvents();
  const { setModalState } = useAppContext();
  const dbImportRef = useRef<HTMLInputElement>(null);
  const visionsImportRef = useRef<HTMLInputElement>(null);

  // Routine Section State
  const [selectedRoutineIds, setSelectedRoutineIds] = useState<Set<number>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedRoutines, setDraggedRoutines] = useState<UnscheduledTask[] | null>(null);

  const displayRoutines = draggedRoutines || routines;

  // Vision Section State
  const [isAddingVision, setIsAddingVision] = useState(false);
  const [editingVisionId, setEditingVisionId] = useState<number | null>(null);
  const [newVisionLabel, setNewVisionLabel] = useState('');
  const [newVisionText, setNewVisionText] = useState('');
  const [editVisionLabel, setEditVisionLabel] = useState('');
  const [editVisionText, setEditVisionText] = useState('');

  const handleAddVision = async () => {
    if (newVisionLabel && newVisionText) {
      await addVision({ label: newVisionLabel, text: newVisionText });
      setNewVisionLabel('');
      setNewVisionText('');
      setIsAddingVision(false);
    }
  };

  const handleStartEditVision = (v: Vision) => {
    setEditingVisionId(v.id!);
    setEditVisionLabel(v.label);
    setEditVisionText(v.text);
  };

  const handleSaveEditVision = async (id: number) => {
    if (editVisionLabel && editVisionText) {
      await updateVision(id, { label: editVisionLabel, text: editVisionText });
      setEditingVisionId(null);
    }
  };

  const handleVisionsImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content) return;

      const parsed = parseVisions(content);
      if (parsed.length > 0) {
        await bulkAddVisions(parsed);
        notify.success(`Successfully imported ${parsed.length} vision items!`);
      } else {
        notify.error('No valid vision items found in the file. Please check the format.');
      }

      // Reset input
      if (visionsImportRef.current) visionsImportRef.current.value = '';
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
      'This will delete ALL activities, routines, and visions. This action cannot be undone.'
    );

    if (result.isConfirmed) {
      try {
        await Promise.all([
          db.events.clear(),
          db.visions.clear(),
          db.routines.clear()
        ]);
        notify.success('All data has been purged.');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error('Purge failed:', error);
        notify.error('Failed to purge data.');
      }
    }
  };

  const handleAddRoutine = () => {
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

  const handleEditRoutine = (task: UnscheduledTask) => {
    setModalState({
      isOpen: true,
      type: 'edit',
      mode: 'task',
      task
    });
  };

  const toggleRoutineSelection = (id: number) => {
    const newSelected = new Set(selectedRoutineIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRoutineIds(newSelected);
  };

  const handleAutoSchedule = async () => {
    const selectedRoutines = routines.filter(r => selectedRoutineIds.has(r.id!));
    if (selectedRoutines.length === 0) return;

    const now = new Date();
    // 15m precision
    const startOfNextSlot = new Date(now);
    const minutes = startOfNextSlot.getMinutes();
    const nextSlotMinutes = Math.ceil((minutes + 1) / 15) * 15;
    startOfNextSlot.setMinutes(nextSlotMinutes, 0, 0);

    let currentTime = startOfNextSlot.getTime();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    for (const routine of selectedRoutines) {
      const startTime = new Date(currentTime);
      const endTime = new Date(currentTime + routine.duration * 60 * 1000);

      if (endTime.getTime() <= endOfDay.getTime()) {
        await addEvent({
          title: routine.title,
          description: routine.description,
          start: startTime,
          end: endTime,
          color: routine.color,
        });
        // Update currentTime for next routine: end of current + 15m gap
        currentTime = endTime.getTime() + 15 * 60 * 1000;
      } else {
        console.warn(`Routine "${routine.title}" skipped: falls outside current day.`);
      }
    }

    setSelectedRoutineIds(new Set());
    notify.success('Routine items scheduled successfully!');
  };

  // Drag and Drop Handlers
  const onDragStart = (index: number) => {
    setDraggedIndex(index);
    setDraggedRoutines([...routines]);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || !draggedRoutines) return;

    const newRoutines = [...draggedRoutines];
    const draggedItem = newRoutines[draggedIndex];
    newRoutines.splice(draggedIndex, 1);
    newRoutines.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setDraggedRoutines(newRoutines);
  };

  const onDragEnd = () => {
    if (draggedRoutines) {
      reorderRoutines(draggedRoutines);
    }
    setDraggedIndex(null);
    setDraggedRoutines(null);
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

        {/* Routine Section */}
        <CollapsibleSection title="Routine" icon={<Wand2 size={20} />} defaultOpen={false}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddRoutine}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20"
              >
                <Plus size={18} />
                Add
              </button>

              <button
                onClick={handleAutoSchedule}
                disabled={selectedRoutineIds.size === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
              >
                <RefreshCw size={18} className={selectedRoutineIds.size > 0 ? "animate-spin-slow" : ""} />
                Schedule
              </button>
            </div>

            <div className="grid gap-2">
              {displayRoutines.map((routine, index) => (
                <div
                  key={routine.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  onClick={() => handleEditRoutine(routine)}
                  className={`group flex items-center rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/[0.07] transition-all cursor-pointer min-w-0 ${draggedIndex === index ? 'opacity-20 border-brand-primary scale-[0.98]' : ''}`}
                >
                  {/* Left Side: Checkbox */}
                  <div className="flex items-center flex-shrink-0 mr-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleRoutineSelection(routine.id!); }}
                      onDragStart={(e) => e.stopPropagation()}
                      className="relative flex items-center justify-center transition-all"
                    >
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedRoutineIds.has(routine.id!)
                          ? 'bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/40'
                          : 'border-white/20 bg-white/5 group-hover:border-white/40'
                      }`}>
                        {selectedRoutineIds.has(routine.id!) && <Check size={14} className="text-white stroke-[3]" />}
                      </div>
                    </button>
                  </div>

                  {/* Title: Takes remaining space */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-white block truncate">
                      {routine.title}
                    </span>
                  </div>
                </div>
              ))}
              {routines.length === 0 && (
                <div className="py-8 text-center space-y-2 border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-gray-500 text-sm">No activities to schedule yet.</p>
                  <button onClick={handleAddRoutine} className="text-brand-primary text-sm hover:underline">Add your first activity</button>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Vision Section */}
        <CollapsibleSection title="Vision" icon={<BookOpen size={20} />} defaultOpen={false}>
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <button
                onClick={() => visionsImportRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all"
              >
                <FileText size={18} />
                Import
              </button>
              <button
                onClick={() => setIsAddingVision(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all"
              >
                <Plus size={18} />
                Add
              </button>
              <input
                type="file"
                ref={visionsImportRef}
                onChange={handleVisionsImport}
                accept=".txt,.md"
                className="hidden"
              />
            </div>

            {isAddingVision && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4 animate-in fade-in zoom-in duration-200">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={newVisionLabel}
                    onChange={(e) => setNewVisionLabel(e.target.value)}
                    placeholder="e.g., Focus"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Vision</label>
                  <textarea
                    value={newVisionText}
                    onChange={(e) => setNewVisionText(e.target.value)}
                    placeholder="Describe your vision..."
                    rows={3}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary/50 transition-colors resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddingVision(false)}
                    className="px-4 py-2 rounded-lg text-gray-400 text-sm font-medium hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddVision}
                    className="px-6 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:brightness-110 active:scale-95 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {visions.map((v) => (
                <div key={v.id} className="group relative p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all">
                  {editingVisionId === v.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editVisionLabel}
                        onChange={(e) => setEditVisionLabel(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-brand-primary"
                      />
                      <textarea
                        value={editVisionText}
                        onChange={(e) => setEditVisionText(e.target.value)}
                        rows={3}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingVisionId(null)} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
                        <button onClick={() => handleSaveEditVision(v.id!)} className="p-2 text-brand-primary hover:text-brand-primary/80 transition-colors"><Check size={18} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-brand-primary font-bold uppercase tracking-wider text-sm">{v.label}</h4>
                        <div className="flex gap-1">
                          <button onClick={() => handleStartEditVision(v)} className="p-2 text-gray-400 hover:text-brand-primary active:bg-brand-primary/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => deleteVision(v.id!)} className="p-2 text-gray-400 hover:text-red-400 active:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{v.text}</p>
                    </>
                  )}
                </div>
              ))}

              {visions.length === 0 && !isAddingVision && (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-gray-500 text-sm">No vision items defined yet.</p>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Data Management Section */}
        <CollapsibleSection title="Data Management" icon={<Download size={20} />} defaultOpen={false}>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex items-center gap-3">
                <Download size={20} className="text-green-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Export Backup</div>
                  <div className="text-xs text-gray-500">Save your data as a JSON file</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => dbImportRef.current?.click()}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex items-center gap-3">
                <Upload size={20} className="text-blue-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Import Backup</div>
                  <div className="text-xs text-gray-500">Restore data from a JSON file</div>
                </div>
              </div>
              <input
                type="file"
                ref={dbImportRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
            </button>

            <button
              onClick={handlePurge}
              className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={20} className="text-red-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Purge All Data</div>
                  <div className="text-xs text-gray-500">Delete everything permanently</div>
                </div>
              </div>
            </button>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default SettingsView;
