import React from 'react';
import { Scroll } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';

export const GuideSection: React.FC = () => {
  return (
    <CollapsibleSection title="Guide" icon={<Scroll size={18} />} defaultOpen={false}>
      <div className="space-y-6 py-2">
        {[
          {
            title: 'Effort over Result',
            text: 'Focus on the effort, which is entirely within your control, rather than the result, which often is not. Define success by the integrity of your effort, regardless of the final result.'
          },
          {
            title: 'Effort over Planning',
            text: 'Effort builds momentum and leads to clarity, whereas planning often leads to disappointment or paralysis.'
          },
          {
            title: 'Consistent & Sustainable Effort',
            text: 'Focus on tiny, consistent efforts, which are manageable, rather than occasional massive efforts, which are not sustainable.'
          },
          {
            title: 'Validation in Effort',
            text: 'Find validation in your own effort, which is yours to maintain, rather than in the opinions of others, which you cannot dictate.'
          },
          {
            title: 'Effort in the Present',
            text: 'Live in the present, which is the only place where your effort has power, rather than in the past or future, which you cannot influence.'
          }
        ].map((item, i) => (
          <div key={i} className="space-y-1.5">
            <h3 className="text-[14px] font-bold text-indigo-400 uppercase tracking-widest">{item.title}</h3>
            <p className="text-[18px] text-slate-400 leading-relaxed font-medium">{item.text}</p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};
