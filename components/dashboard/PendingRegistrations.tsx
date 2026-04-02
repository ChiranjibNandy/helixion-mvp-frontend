'use client';

import { ArrowRight } from 'lucide-react';
import RegistrationRow from './RegistrationRow';

interface Registration {
  id: string;
  name: string;
  email: string;
  date: string;
}

interface PendingRegistrationsProps {
  registrations: Registration[];
}

const iconEmojis = ['👤', '👨', '👩', '🧑'];
const iconBgs = ['bg-[#1e3a8a]', 'bg-[#166534]', 'bg-[#7c2d12]', 'bg-[#713f12]'];

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
        {registrations.map((reg, index) => (
          <RegistrationRow
            key={reg.id}
            name={reg.name}
            email={reg.email}
            date={reg.date}
            icon={iconEmojis[index % iconEmojis.length]}
            iconBg={iconBgs[index % iconBgs.length]}
          />
        ))}
      </div>
    </div>
  );
}
