import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Check, X } from 'lucide-react';
import { useMountain } from '../../hooks/useMountain';
import { CollapsibleSection } from './CollapsibleSection';
import type { Mountain } from '../../db/db';

export const MountainSection: React.FC = () => {
  const { mountains, addMountain, updateMountain, deleteMountain } = useMountain();

  const [isAddingMountain, setIsAddingMountain] = useState(false);
  const [editingMountainId, setEditingMountainId] = useState<number | null>(null);
  const [newMountainText, setNewMountainText] = useState('');
  const [editMountainText, setEditMountainText] = useState('');

  const handleAddMountain = async () => {
    if (newMountainText) {
      await addMountain({ text: newMountainText });
      setNewMountainText('');
      setIsAddingMountain(false);
    }
  };

  const handleStartEditMountain = (v: Mountain) => {
    setEditingMountainId(v.id!);
    setEditMountainText(v.text);
  };

  const handleSaveEditMountain = async (id: number) => {
    if (editMountainText) {
      await updateMountain(id, { text: editMountainText });
      setEditingMountainId(null);
    }
  };

  return (
    <CollapsibleSection title="Mountain" icon={<BookOpen size={18} />} defaultOpen={false}>
      <div className="space-y-5">
        <div className="flex justify-end">
          <button
            onClick={() => setIsAddingMountain(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-[14px] font-bold hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            ADD MOUNTAIN
          </button>
        </div>

        {isAddingMountain && (
          <div className="p-4 rounded-2xl border border-white/[0.05] bg-slate-800/50 backdrop-blur-sm space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">Vision, Goal or Guiding Principle</label>
              <textarea
                value={newMountainText}
                onChange={(e) => setNewMountainText(e.target.value)}
                placeholder="Describe your mountain..."
                rows={3}
                className="w-full bg-slate-900/50 border border-white/[0.05] rounded-xl px-3 py-2.5 text-slate-100 text-[15px] focus:outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder:text-slate-600"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddingMountain(false)}
                className="px-4 py-2 rounded-lg text-slate-400 text-sm font-bold hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddMountain}
                className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
              >
                SAVE
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {mountains.map((v) => (
            <div
              key={v.id}
              onClick={() => editingMountainId !== v.id && handleStartEditMountain(v)}
              className={`group relative p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer ${editingMountainId === v.id ? 'border-indigo-500/30 bg-indigo-500/[0.02]' : ''}`}
            >
              {editingMountainId === v.id ? (
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={editMountainText}
                    onChange={(e) => setEditMountainText(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900/80 border border-white/[0.1] rounded-xl px-3 py-2.5 text-slate-100 text-[15px] focus:outline-none focus:border-indigo-500 resize-none"
                    autoFocus
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => deleteMountain(v.id!)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 text-sm font-bold hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingMountainId(null)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"><X size={20} /></button>
                      <button onClick={() => handleSaveEditMountain(v.id!)} className="w-10 h-10 flex items-center justify-center text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-full transition-all"><Check size={20} /></button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{v.text}</p>
              )}
            </div>
          ))}

          {mountains.length === 0 && !isAddingMountain && (
            <div className="py-12 text-center border-2 border-dashed border-white/[0.03] rounded-2xl">
              <p className="text-slate-600 text-sm font-bold tracking-wider">No guiding principles added yet</p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};
