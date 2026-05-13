import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  navigation: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, navigation }) => {
  return (
    <div className="fixed inset-0 flex flex-col bg-brand-bg overflow-hidden select-none">
      {/* 
        The key to preventing collapse on mobile is:
        1. 'fixed inset-0' to lock to the actual viewport.
        2. 'h-full' for children.
        3. Avoiding scroll on the root container.
      */}
      <main className="flex-1 relative overflow-hidden h-full">
        {children}
      </main>
      
      <footer className="relative z-50 shrink-0 h-14 min-h-[3.5rem] bg-black border-t border-white/10 safe-area-bottom">
        {navigation}
      </footer>
    </div>
  );
};

export default MobileLayout;
