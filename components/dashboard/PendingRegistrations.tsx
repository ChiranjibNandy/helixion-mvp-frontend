'use client';

import { ArrowRight } from 'lucide-react';
import { PendingRegistrationsProps } from '@/types/admin';
import { AVATAR_BACKGROUNDS } from '@/constants/admin';
import { ADMIN_CONTENT } from '@/constants/content';
import RegistrationRow from '../ui/registration-row';


function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Pending registrations table section with approve/deny actions
 */
export default function PendingRegistrations({ registrations }: PendingRegistrationsProps) {
  const { SECTIONS } = ADMIN_CONTENT.DASHBOARD;

  return (
    <div className="bg-bgStatCard rounded-lg border border-borderCard">
      <div className="flex items-center justify-between p-6 border-b border-borderCard">
        <h2 className="text-white text-base font-semibold">{SECTIONS.PENDING_REGISTRATIONS}</h2>
        <button className="flex items-center gap-2 text-primary text-sm font-medium hover:text-primaryDark transition-colors">
          {SECTIONS.SEE_ALL}
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
            icon={
              <span className="text-white text-sm font-semibold">
                {getInitials(registration.name)}
              </span>
            }
            iconBg={AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length]}
          />
        ))}
      </div>
    </div>
  );
}
