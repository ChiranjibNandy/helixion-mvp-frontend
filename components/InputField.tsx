'use client';

import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  error?: string;
  autoComplete?: string;
}

export default function InputField({
  label,
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  showToggle = false,
  error,
  autoComplete,
}: InputFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputType = showToggle ? (visible ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: '#9ca3af' }}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {/* Left icon */}
        <span
          className="absolute left-3.5 flex items-center pointer-events-none"
          style={{ color: '#4b5563' }}
        >
          {icon}
        </span>

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full rounded-lg text-sm pl-10 pr-${showToggle ? '10' : '4'} py-3
            outline-none transition-all duration-200
            placeholder-[#4b5563] text-white
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            ${error ? 'ring-2 ring-red-500/60' : ''}
          `}
          style={{
            backgroundColor: '#111827',
            border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : '#1f2937'}`,
            paddingRight: showToggle ? '2.5rem' : '1rem',
          }}
        />

        {/* Eye toggle */}
        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 flex items-center transition-colors"
            style={{ color: '#4b5563' }}
            tabIndex={-1}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}
