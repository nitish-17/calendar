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
    </div>
  );
};

export default SettingsView;
