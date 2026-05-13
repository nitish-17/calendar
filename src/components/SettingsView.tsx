import React from 'react';
import { ActivitySection } from './settings/ActivitySection';
import { MountainSection } from './settings/MountainSection';
import { DataManagement } from './settings/DataManagement';
import { GuideSection } from './settings/GuideSection';

const SettingsView: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto p-3 space-y-3 pb-20">
      <ActivitySection />
      <GuideSection />
      <MountainSection />
      <DataManagement />

      <div className="pt-4 pb-2 text-center">
        <span className="text-base font-bold text-gray-800 uppercase tracking-[0.2em]">
          TimeLog v2.0
        </span>
      </div>
    </div>
  );
};

export default SettingsView;
