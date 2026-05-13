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
    <CollapsibleSection title="Mountain" icon={<BookOpen size={20} />} defaultOpen={false}>
      <div className="space-y-6">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsAddingMountain(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        {isAddingMountain && (
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Mountain</label>
              <textarea
                value={newMountainText}
                onChange={(e) => setNewMountainText(e.target.value)}
                placeholder="Describe your mountain..."
                rows={3}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary/50 transition-colors resize-none"
                autoFocus
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

        <div className="grid gap-3">
          {mountains.map((v) => (
            <div 
              key={v.id} 
              onClick={() => editingMountainId !== v.id && handleStartEditMountain(v)}
              className={`group relative p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all cursor-pointer ${editingMountainId === v.id ? 'border-brand-primary/50 bg-white/[0.08]' : ''}`}
            >
              {editingMountainId === v.id ? (
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={editMountainText}
                    onChange={(e) => setEditMountainText(e.target.value)}
                    rows={3}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary resize-none"
                    autoFocus
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => deleteMountain(v.id!)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 text-sm font-medium hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingMountainId(null)} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                      <button onClick={() => handleSaveEditMountain(v.id!)} className="p-2 text-brand-primary hover:text-brand-primary/80 transition-colors"><Check size={20} /></button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{v.text}</p>
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
  );
};
