import { IconPin } from '@/components/ui/Icons'

// ─────────────────────────────────────────────
//  RoleChip — shows the currently selected role
// ─────────────────────────────────────────────

const ROLE_LABELS = {
  admin:    'Training Admin',
  employee: 'Corporate Employee',
  manager:  'Reporting Manager / HoD',
}

export default function RoleChip({ role }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-1"
      style={{
        background:   'rgba(59,111,224,0.1)',
        border:       '1px solid rgba(59,111,224,0.28)',
        color:        '#7aabff',
      }}
    >
      <IconPin size={11} color="#7aabff" />
      <span style={{ fontSize: 12, fontWeight: 600 }}>
        {ROLE_LABELS[role]}
      </span>
    </div>
  )
}
