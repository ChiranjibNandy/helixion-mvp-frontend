'use client'

import {
  IconTrainingAdmin,
  IconCorporateEmployee,
  IconReportingManager,
} from '@/components/ui/Icons'

// ─────────────────────────────────────────────
//  Role configuration
// ─────────────────────────────────────────────
const ROLES = [
  {
    id:     'admin',
    line1:  'Training',
    line2:  'Admin',
    Icon:   IconTrainingAdmin,
  },
  {
    id:     'employee',
    line1:  'Corporate',
    line2:  'Employee',
    Icon:   IconCorporateEmployee,
  },
  {
    id:     'manager',
    line1:  'Reporting',
    line2:  'Manager',
    Icon:   IconReportingManager,
  },
]

// ─────────────────────────────────────────────
//  RoleSelector Component
// ─────────────────────────────────────────────
export default function RoleSelector({ activeRole, onRoleChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {ROLES.map(({ id, line1, line2, Icon }) => {
        const isActive = activeRole === id

        return (
          <button
            key={id}
            type="button"
            onClick={() => onRoleChange(id)}
            className={`role-btn flex flex-col items-center justify-center gap-2 py-3.5 px-2 rounded-xl border cursor-pointer
              ${isActive
                ? 'role-active'
                : ''
              }`}
            style={{
              background: isActive
                ? 'rgba(30,60,120,0.35)'
                : 'rgba(255,255,255,0.02)',
              borderColor: isActive
                ? 'rgba(59,111,224,0.55)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: isActive
                ? '0 0 0 1px rgba(59,111,224,0.15), inset 0 1px 0 rgba(255,255,255,0.03)'
                : 'none',
            }}
          >
            <Icon active={isActive} />
            <span
              className="text-center leading-snug"
              style={{
                fontSize: 12,
                color: isActive ? '#e0e8f5' : '#6b7d96',
                fontWeight: 500,
              }}
            >
              {line1}
              <br />
              <strong style={{ fontWeight: 700 }}>{line2}</strong>
            </span>
          </button>
        )
      })}
    </div>
  )
}
