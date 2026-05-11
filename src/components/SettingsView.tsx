import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, ChevronDown, ChevronUp, BookOpen, Plus, Trash2, Edit2, Check, X, Download, Upload, RefreshCw, Wand2, FileText, Scroll } from 'lucide-react';
import { useGuidingPrinciples } from '../hooks/useGuidingPrinciples';
import { useUnscheduledTasks } from '../hooks/useUnscheduledTasks';
import { useEvents } from '../hooks/useEvents';
import { useAppContext } from '../hooks/useAppContext';
import { db, type GuidingPrinciple, type UnscheduledTask } from '../db/db';
import { exportDB, importInto } from 'dexie-export-import';
import { parsePrinciples } from '../utils/principleParser';
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
  const { principles, addPrinciple, bulkAddPrinciples, updatePrinciple, deletePrinciple } = useGuidingPrinciples();
  const { tasks, reorderTasks } = useUnscheduledTasks();
  const { addEvent } = useEvents();
  const { setModalState } = useAppContext();
  const dbImportRef = useRef<HTMLInputElement>(null);
  const principlesImportRef = useRef<HTMLInputElement>(null);

  // Habits Section State
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedTasks, setDraggedTasks] = useState<UnscheduledTask[] | null>(null);

  const displayTasks = draggedTasks || tasks;

  // Notes Section State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newText, setNewText] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [editText, setEditText] = useState('');

  const handleAdd = async () => {
    if (newLabel && newText) {
      await addPrinciple({ label: newLabel, text: newText });
      setNewLabel('');
      setNewText('');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (p: GuidingPrinciple) => {
    setEditingId(p.id!);
    setEditLabel(p.label);
    setEditText(p.text);
  };

  const handleSaveEdit = async (id: number) => {
    if (editLabel && editText) {
      await updatePrinciple(id, { label: editLabel, text: editText });
      setEditingId(null);
    }
  };

  const handlePrinciplesImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content) return;

      const parsed = parsePrinciples(content);
      if (parsed.length > 0) {
        await bulkAddPrinciples(parsed);
        notify.success(`Successfully imported ${parsed.length} notes!`);
      } else {
        notify.error('No valid notes found in the file. Please check the format.');
      }

      // Reset input
      if (principlesImportRef.current) principlesImportRef.current.value = '';
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
      'This will delete ALL activities and notes. This action cannot be undone.'
    );

    if (result.isConfirmed) {
      try {
        await Promise.all([
          db.events.clear(),
          db.guidingPrinciples.clear(),
          db.unscheduledTasks.clear()
        ]);
        notify.success('All data has been purged.');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error('Purge failed:', error);
        notify.error('Failed to purge data.');
      }
    }
  };

  const handleAddTask = () => {
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

  const handleEditTask = (task: UnscheduledTask) => {
    setModalState({
      isOpen: true,
      type: 'edit',
      mode: 'task',
      task
    });
  };

  const toggleTaskSelection = (id: number) => {
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTaskIds(newSelected);
  };

  const handleAutoSchedule = async () => {
    const selectedTasks = tasks.filter(t => selectedTaskIds.has(t.id!));
    if (selectedTasks.length === 0) return;

    const now = new Date();
    // 15m precision
    const startOfNextSlot = new Date(now);
    const minutes = startOfNextSlot.getMinutes();
    const nextSlotMinutes = Math.ceil((minutes + 1) / 15) * 15;
    startOfNextSlot.setMinutes(nextSlotMinutes, 0, 0);

    let currentTime = startOfNextSlot.getTime();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    for (const task of selectedTasks) {
      const startTime = new Date(currentTime);
      const endTime = new Date(currentTime + task.duration * 60 * 1000);

      if (endTime.getTime() <= endOfDay.getTime()) {
        await addEvent({
          title: task.title,
          description: task.description,
          start: startTime,
          end: endTime,
          color: task.color,
        });
        // Update currentTime for next task: end of current + 15m gap
        currentTime = endTime.getTime() + 15 * 60 * 1000;
      } else {
        console.warn(`Task "${task.title}" skipped: falls outside current day.`);
      }
    }

    setSelectedTaskIds(new Set());
    notify.success('Tasks scheduled successfully!');
  };

  // Drag and Drop Handlers
  const onDragStart = (index: number) => {
    setDraggedIndex(index);
    setDraggedTasks([...tasks]);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || !draggedTasks) return;

    const newTasks = [...draggedTasks];
    const draggedItem = newTasks[draggedIndex];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setDraggedTasks(newTasks);
  };

  const onDragEnd = () => {
    if (draggedTasks) {
      reorderTasks(draggedTasks);
    }
    setDraggedIndex(null);
    setDraggedTasks(null);
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

        {/* Habits Section */}
        <CollapsibleSection title="Habits" icon={<Wand2 size={20} />} defaultOpen={false}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddTask}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20"
              >
                <Plus size={18} />
                Add
              </button>

              <button
                onClick={handleAutoSchedule}
                disabled={selectedTaskIds.size === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
              >
                <RefreshCw size={18} className={selectedTaskIds.size > 0 ? "animate-spin-slow" : ""} />
                Schedule
              </button>
            </div>

            <div className="grid gap-2">
              {displayTasks.map((task, index) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  onClick={() => handleEditTask(task)}
                  className={`group flex items-center rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/[0.07] transition-all cursor-pointer min-w-0 ${draggedIndex === index ? 'opacity-20 border-brand-primary scale-[0.98]' : ''}`}
                >
                  {/* Left Side: Checkbox */}
                  <div className="flex items-center flex-shrink-0 mr-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleTaskSelection(task.id!); }}
                      onDragStart={(e) => e.stopPropagation()}
                      className="relative flex items-center justify-center transition-all"
                    >
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedTaskIds.has(task.id!)
                          ? 'bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/40'
                          : 'border-white/20 bg-white/5 group-hover:border-white/40'
                      }`}>
                        {selectedTaskIds.has(task.id!) && <Check size={14} className="text-white stroke-[3]" />}
                      </div>
                    </button>
                  </div>

                  {/* Title: Takes remaining space */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-white block truncate">
                      {task.title}
                    </span>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="py-8 text-center space-y-2 border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-gray-500 text-sm">No activities to schedule yet.</p>
                  <button onClick={handleAddTask} className="text-brand-primary text-sm hover:underline">Add your first activity</button>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Notes Section */}
        <CollapsibleSection title="Notes" icon={<BookOpen size={20} />} defaultOpen={false}>
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <button
                onClick={() => principlesImportRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all"
              >
                <FileText size={18} />
                Import
              </button>
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all"
              >
                <Plus size={18} />
                Add
              </button>
              <input
                type="file"
                ref={principlesImportRef}
                onChange={handlePrinciplesImport}
                accept=".txt,.md"
                className="hidden"
              />
            </div>

            {isAdding && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4 animate-in fade-in zoom-in duration-200">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Focus"
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Note</label>
                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="What is the core idea?"
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all min-h-[100px] text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-6 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:brightness-110 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-3">
              {principles.map((p) => (
                <div key={p.id} className="group relative rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/[0.07] transition-all">
                  {editingId === p.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="w-full rounded-lg bg-white/10 border border-white/10 p-2 text-white text-sm font-bold focus:outline-none"
                      />
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full rounded-lg bg-white/10 border border-white/10 p-2 text-white text-sm focus:outline-none min-h-[80px]"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-white"><X size={18} /></button>
                        <button onClick={() => handleSaveEdit(p.id!)} className="p-2 text-brand-primary hover:text-brand-primary/80"><Check size={18} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-brand-primary text-sm uppercase tracking-widest">{p.label}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => handleStartEdit(p)} className="p-2 text-gray-400 hover:text-white active:bg-white/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => deletePrinciple(p.id!)} className="p-2 text-gray-400 hover:text-red-400 active:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{p.text}</p>
                    </>
                  )}
                </div>
              ))}
              {principles.length === 0 && !isAdding && (
                <div className="py-8 text-center space-y-3">
                  <p className="text-gray-500 text-sm">No notes defined yet.</p>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Data Management Section */}
        <CollapsibleSection title="Data Management" icon={<RefreshCw size={20} />}>
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
                  <Upload  size={16} />
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
                Clear all data from the application. This will permanently delete all your activities and presets.
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
