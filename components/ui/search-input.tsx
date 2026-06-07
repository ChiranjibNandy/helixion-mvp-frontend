'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode, KeyboardEvent } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
}

export default function SearchInput({ value, onChange, placeholder, className, onKeyDown, icon }: Props) {
  return (
    <div className={cn('relative', className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center text-white/30">
        {icon ?? <Search className="w-3.5 h-3.5" />}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search...'}
        onKeyDown={onKeyDown}
        className="w-full pl-9 h-9 rounded-lg border border-[#1e2d40] bg-[#111827] text-white placeholder:text-white/25 text-[12px] outline-none focus:border-blue-500"
      />
    </div>
  );
}
