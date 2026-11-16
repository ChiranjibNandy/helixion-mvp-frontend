'use client';

interface CapacityRingProps {
  value: number;
  max: number;
  status: 'ok' | 'warning' | 'danger';
  size?: number;
  theme?: 'dark' | 'light';
}

const STATUS_COLOR: Record<CapacityRingProps['status'], string> = {
  ok: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
};

export default function CapacityRing({ value, max, status, size = 64, theme = 'dark' }: CapacityRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - pct);
  const color = STATUS_COLOR[status];
  const trackColor = theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={6} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={6}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-semibold leading-none ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{value}</span>
        <span className={`text-[10px] leading-none mt-0.5 ${theme === 'light' ? 'text-gray-400' : 'text-white/40'}`}>/ {max}</span>
      </div>
    </div>
  );
}
