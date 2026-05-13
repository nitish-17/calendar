import React from 'react';
import { Scroll } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';

export const GuideSection: React.FC = () => {
  return (
    <CollapsibleSection title="Guide" icon={<Scroll size={18} />} defaultOpen={false}>
      <div className="space-y-4 py-1">
        {[
          { title: 'Effort over Result', text: 'Focus on the effort, which is entirely within your control. Define success by integrity, regardless of the final result.' },
          { title: 'Effort over Planning', text: 'Effort builds momentum and leads to clarity, whereas planning often leads to disappointment or paralysis.' },
          { title: 'Consistent & Sustainable', text: 'Focus on tiny, consistent efforts rather than occasional massive bursts that are not sustainable.' },
          { title: 'Validation in Effort', text: 'Find validation in your own effort rather than in the opinions of others, which you cannot dictate.' },
          { title: 'Effort in the Present', text: 'Live in the present, where your effort has power, rather than in the past or future.' }
        ].map((item, i) => (
          <div key={i} className="space-y-1">
            <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{item.title}</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{item.text}</p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};
