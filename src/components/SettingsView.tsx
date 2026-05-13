import React from 'react';
import { ActivitySection } from './settings/ActivitySection';
import { MountainSection } from './settings/MountainSection';
import { DataManagement } from './settings/DataManagement';
import { GuideSection } from './settings/GuideSection';

const SettingsView: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto p-4 space-y-4 pb-16">
      <div className="space-y-4">
        <ActivitySection />
        <GuideSection />
        <MountainSection />
        <DataManagement />
      </div>
    </div>
  );
};

export default SettingsView;
