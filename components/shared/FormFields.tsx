'use client';

export function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold tracking-widest uppercase text-white/35 mb-1.5">
        {label}
        {required && <span className="text-accentRed ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white
                   placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary
                   disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export function Checkbox({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex items-center gap-2 text-sm text-white/70 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded border-white/20 bg-black/30 accent-primary"
      />
      {label}
    </label>
  );
}
