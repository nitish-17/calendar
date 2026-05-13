import React from 'react';
import { Scroll } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';

export const GuideSection: React.FC = () => {
  return (
    <CollapsibleSection title="Guide" icon={<Scroll size={20} />} defaultOpen={false}>
      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <div>
          <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Effort over Result</h3>
          <p>Focus on the effort, which is entirely within your control, rather than the result, which often is not. Define success by the integrity of your effort, regardless of the final result.</p>
        </div>

        <div>
          <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Effort over Planning</h3>
          <p>Effort builds momentum and leads to clarity, whereas planning often leads to disappointment or paralysis.</p>
        </div>

        <div>
          <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Consistent & Sustainable Effort</h3>
          <p>Focus on tiny, consistent efforts, which are manageable, rather than occasional massive efforts, which are not sustainable.</p>
        </div>

        <div>
          <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Validation in Effort</h3>
          <p>Find validation in your own effort, which is yours to maintain, rather than in the opinions of others, which you cannot dictate.</p>
        </div>

        <div>
          <h3 className="font-bold text-brand-primary uppercase tracking-widest mb-1">Effort in the Present</h3>
          <p>Live in the present, which is the only place where your effort has power, rather than in the past or future, which you cannot influence.</p>
        </div>
      </div>
    </CollapsibleSection>
  );
};
