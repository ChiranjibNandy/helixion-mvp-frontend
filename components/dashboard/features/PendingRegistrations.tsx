'use client';

import { ArrowRight } from 'lucide-react';
import { PendingRegistrationsProps } from '@/types/admin';
import { ICON_EMOJIS, ICON_BACKGROUNDS } from '@/constants/admin';
import RegistrationRow from '../ui/RegistrationRow';

/**
 * Pending registrations table section with approve/deny actions
 */
export default function PendingRegistrations({ registrations }: PendingRegistrationsProps) {
  return (
    <div className="bg-[#0f1629] rounded-lg border border-[#1a2235]">
      <div className="flex items-center justify-between p-6 border-b border-[#1a2235]">
        <h2 className="text-white text-base font-semibold">Pending registrations</h2>
        <button className="flex items-center gap-2 text-primary text-sm font-medium hover:text-primaryDark transition-colors">
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
