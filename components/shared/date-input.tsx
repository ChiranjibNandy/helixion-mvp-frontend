'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toDisplayDate } from '@/utils/formatters';

interface DateInputProps {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  className?: string;
}

export function DateInput({ value, placeholder, onChange, className }: DateInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={cn('relative flex-1 min-w-[155px]', className)}>
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none z-10" />
      <input
        type={focused ? 'date' : 'text'}
        placeholder={placeholder}
        value={focused ? value : toDisplayDate(value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-2 h-9 rounded-md border border-[#1e2d40] bg-[#111827] text-white/70 placeholder:text-white/30 text-[12px] outline-none focus:border-blue-500 [color-scheme:dark]"
      />
    </div>
  );
}
