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
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => setIsAddingMountain(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-[11px] font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={14} />
            ADD MOUNTAIN
          </button>
        </div>

        {isAddingMountain && (
          <div className="p-3 rounded-lg border border-white/10 bg-black space-y-3 animate-in fade-in zoom-in duration-200">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vision, Goal or Guiding Principle</label>
              <textarea
                value={newMountainText}
                onChange={(e) => setNewMountainText(e.target.value)}
                placeholder="Describe your mountain..."
                rows={3}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-brand-primary/50 transition-colors resize-none"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingMountain(false)}
                className="px-3 py-1.5 rounded-lg text-gray-500 text-[11px] font-bold hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddMountain}
                className="px-5 py-1.5 rounded-lg bg-brand-primary text-white text-[11px] font-bold hover:brightness-110 active:scale-95 transition-all"
              >
                SAVE
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-2">
          {mountains.map((v) => (
            <div
              key={v.id}
              onClick={() => editingMountainId !== v.id && handleStartEditMountain(v)}
              className={`group relative p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer ${editingMountainId === v.id ? 'border-brand-primary/30 bg-white/[0.05]' : ''}`}
            >
              {editingMountainId === v.id ? (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={editMountainText}
                    onChange={(e) => setEditMountainText(e.target.value)}
                    rows={3}
                    className="w-full bg-black border border-white/20 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-brand-primary resize-none"
                    autoFocus
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => deleteMountain(v.id!)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-red-500/80 text-[10px] font-bold hover:bg-red-500/10 transition-colors uppercase"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingMountainId(null)} className="p-1.5 text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
                      <button onClick={() => handleSaveEditMountain(v.id!)} className="p-1.5 text-brand-primary hover:text-brand-primary/80 transition-colors"><Check size={18} /></button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap font-medium">{v.text}</p>
              )}
            </div>
          ))}

          {mountains.length === 0 && !isAddingMountain && (
            <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
              <p className="text-gray-600 text-[11px] font-bold tracking-wider">Add Vision, Goal or Guiding Principle</p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};
