'use client';

import { ArrowRight } from 'lucide-react';
import { PendingRegistrationsProps } from '@/types/admin';
import { COLOR_CLASSES, UI_MESSAGES, ICON_EMOJIS, ICON_BACKGROUNDS } from '@/constants/admin';
import RegistrationRow from '../ui/RegistrationRow';

/**
 * Pending registrations table section with approve/deny actions
 */
export default function PendingRegistrations({ registrations }: PendingRegistrationsProps) {
  return (
    <div className={`${COLOR_CLASSES.BG_CARD} rounded-lg border ${COLOR_CLASSES.BORDER}`}>
      <div className={`flex items-center justify-between p-6 border-b ${COLOR_CLASSES.BORDER}`}>
        <h2 className="text-white text-base font-semibold">Pending registrations</h2>
        <button className={`flex items-center gap-2 ${COLOR_CLASSES.PRIMARY} text-sm font-medium hover:text-primaryDark transition-colors`}>
          See all
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="p-6">
        {registrations.map((registration, index) => (
          <RegistrationRow
            key={registration.id}
            name={registration.name}
            email={registration.email}
            date={registration.date}
            icon={ICON_EMOJIS[index % ICON_EMOJIS.length]}
            iconBg={ICON_BACKGROUNDS[index % ICON_BACKGROUNDS.length]}
          />
        ))}
      </div>
    </div>
  );
}
