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

  return (
    <CollapsibleSection title="Data Management" icon={<RefreshCw size={18} />} defaultOpen={false}>
      <div className="space-y-4 py-1">
        <div className="space-y-2.5">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Import / Export</h3>
          <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
            Backup your data to a JSON file or restore it from a previous backup.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-bold hover:bg-white/10 active:scale-95 transition-all"
            >
              <Upload size={14} />
              EXPORT JSON
            </button>
            <button
              onClick={() => dbImportRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-bold hover:bg-white/10 active:scale-95 transition-all"
            >
              <Download size={14} />
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

        <div className="h-[1px] bg-white/5" />

        <div className="space-y-2.5">
          <h3 className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Danger Zone</h3>
          <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
            Clear all data from the application. This action cannot be undone.
          </p>
          <button
            onClick={handlePurge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold hover:bg-red-500/20 active:scale-95 transition-all"
          >
            <Trash2 size={14} />
            PURGE ALL DATA
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};
