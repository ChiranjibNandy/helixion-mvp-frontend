import { IconShield, IconLock, IconZap } from '@/components/ui/Icons'

// ─────────────────────────────────────────────
//  TrustBadges — SOC2 / TLS / Uptime
// ─────────────────────────────────────────────

const BADGES = [
  { Icon: IconShield, label: 'SOC 2 Type II' },
  { Icon: IconLock,   label: '256-bit TLS'   },
  { Icon: IconZap,    label: '99.9% Uptime'  },
]

export default function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-5 mt-6">
      {BADGES.map(({ Icon, label }, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Icon size={12} color="#3a4d63" />
          <span style={{ fontSize: 11.5, color: '#3a4d63', fontWeight: 500 }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
