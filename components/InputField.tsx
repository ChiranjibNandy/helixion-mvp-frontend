import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

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
}: any) {
  const [visible, setVisible] = useState(false);
  const inputType = showToggle ? (visible ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-textMuted">
        {label}
      </label>

      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-gray-600">{icon}</span>

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full rounded-lg text-sm pl-10 py-3
            ${showToggle ? 'pr-10' : 'pr-4'}
            outline-none transition-all duration-200
            placeholder-[#4b5563] text-white
            focus:ring-2 focus:ring-blue-500
            bg-inputBg border
            ${error ? 'border-red-500/60 ring-2 ring-red-500/60' : 'border-borderDark'}
          `}
        />

        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            className="absolute right-3.5 text-gray-600"
            tabIndex={-1}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}