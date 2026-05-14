import React, { useRef } from 'react';
import { RefreshCw, Download, Upload, Trash2 } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { db } from '../../db/db';
import { exportDB, importInto } from 'dexie-export-import';
import { notify } from '../../utils/notifications';
import { dbExportSchema } from '../../utils/validation';

export const DataManagement: React.FC = () => {
  const dbImportRef = useRef<HTMLInputElement>(null);

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
      const text = await file.text();
      const jsonData = JSON.parse(text);

      // Validate schema
      const validation = dbExportSchema.safeParse(jsonData);

      if (!validation.success) {
        throw new Error('Invalid backup format. Please use a valid TimeLog backup file.');
      }

      await importInto(db, file, { overwriteValues: true });
      notify.success('Data imported successfully! The page will reload.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Import failed:', error);
      notify.error(error instanceof Error ? error.message : 'Failed to import data.');
    }
  };

  const handlePurge = async () => {
    const result = await notify.confirm(
      'Are you absolutely sure?',
      'This will delete ALL activities, and mountains. This action cannot be undone.',
      'warning',
      '#f87171' // Red warning icon
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

  return (
    <CollapsibleSection title="Data Management" icon={<RefreshCw size={18} />} defaultOpen={false}>
      <div className="space-y-6 py-2">
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-[14px] font-bold text-slate-300 uppercase tracking-widest">Import / Export</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
              Backup your data to a JSON file or restore it from a previous backup.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-100 text-sm font-bold hover:bg-slate-700 active:scale-95 transition-all border border-white/[0.05]"
            >
              <Upload size={16} />
              EXPORT JSON
            </button>
            <button
              onClick={() => dbImportRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-100 text-sm font-bold hover:bg-slate-700 active:scale-95 transition-all border border-white/[0.05]"
            >
              <Download size={16} />
              IMPORT JSON
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

        <div className="h-[1px] bg-white/[0.05]" />

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-[14px] font-bold text-red-500/80 uppercase tracking-widest">Danger Zone</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
              Clear all data from the application. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={handlePurge}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 active:scale-95 transition-all"
          >
            <Trash2 size={16} />
            PURGE ALL DATA
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};
