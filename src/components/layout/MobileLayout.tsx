import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  navigation: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, navigation }) => {
  return (
    <div className="fixed inset-0 flex flex-col bg-brand-bg overflow-hidden select-none">
      <main className="flex-1 relative overflow-hidden h-full max-w-md mx-auto w-full border-x border-white/[0.02]">
        {children}
      </main>
      
      <footer className="relative z-50 shrink-0 h-20 bg-slate-900/80 backdrop-blur-xl border-t border-white/[0.05] safe-area-bottom">
        <div className="h-full max-w-md mx-auto w-full px-4">
          {navigation}
        </div>
      </footer>
    </div>
  );
};

export default MobileLayout;
