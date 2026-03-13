import { IconCheckCircle } from '@/components/ui/Icons'

// ─────────────────────────────────────────────
//  Stats data
// ─────────────────────────────────────────────
const STATS = [
  { value: '2.4', suffix: 'M+', label: 'Active learners',    color: '#3b6fe0' },
  { value: '98',  suffix: '%',  label: 'Completion rate',    color: '#3b82f6' },
  { value: '500', suffix: '+',  label: 'Enterprise clients', color: '#60a5fa' },
]

// ─────────────────────────────────────────────
//  LeftPanel Component
// ─────────────────────────────────────────────
export default function LeftPanel() {
  return (
    <div
      className="hx-left-panel dot-grid flex flex-col relative overflow-hidden"
      style={{
        flex:       '0 0 44%',
        maxWidth:   '44%',
        background: 'linear-gradient(158deg, #071022 0%, #07122a 45%, #060d1c 100%)',
        padding:    '36px 48px',
        borderRight:'1px solid #0c1b30',
      }}
    >
      {/* Radial glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '12%', left: '18%',
          width: 400, height: 300,
          background: 'radial-gradient(circle, rgba(22,62,140,0.3) 0%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '8%', left: '-8%',
          width: 320, height: 240,
          background: 'radial-gradient(circle, rgba(14,45,100,0.22) 0%, transparent 70%)',
        }}
      />

      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 relative z-10">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #2554c7 0%, #1e40af 100%)',
            boxShadow:  '0 4px 16px rgba(37,84,199,0.45)',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '-0.5px' }}>
            Hx
          </span>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.3px' }}>
          Helix<span style={{ color: '#3b6fe0' }}>i</span>on
        </span>
      </div>

      {/* ── Tag line ── */}
      <div className="flex items-center gap-2 relative z-10" style={{ marginTop: 'auto', paddingTop: 120 }}>
        <div
          className="rounded-sm"
          style={{
            width: 28, height: 2,
            background: 'linear-gradient(90deg, transparent, #3b6fe0)',
          }}
        />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#6b7d96' }}>
          OPTION B · ROLE SELECTOR
        </span>
        <span style={{ fontSize: 11, color: '#f59e0b' }}>★</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#6b7d96' }}>
          RECOMMENDED
        </span>
      </div>

      {/* ── Headline ── */}
      <div className="relative z-10 mt-4 mb-7">
        <h1
          style={{
            fontSize:      44,
            fontWeight:    800,
            lineHeight:    1.1,
            letterSpacing: '-1.5px',
            marginBottom:  16,
          }}
        >
          One platform.
          <br />
          <span style={{ color: '#3b6fe0' }}>Three</span>
          <span style={{ color: '#e8edf5' }}> workspaces.</span>
        </h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#7a8faa', maxWidth: 360, fontWeight: 400 }}>
          Training Admins, Corporate Employees, and Reporting
          Managers — each with a purpose-built dashboard,
          accessed through one unified login.
        </p>
      </div>

      {/* ── Divider ── */}
      <div
        className="relative z-10 mb-7"
        style={{
          height:     1,
          background: 'linear-gradient(90deg, rgba(59,111,224,0.35), rgba(255,255,255,0.05) 60%, transparent)',
        }}
      />

      {/* ── Stats ── */}
      <div className="flex gap-10 relative z-10">
        {STATS.map(({ value, suffix, label, color }, i) => (
          <div key={i}>
            <div
              style={{
                fontSize:      30,
                fontWeight:    800,
                letterSpacing: '-1px',
                lineHeight:    1,
                color:         '#e8edf5',
                marginBottom:  4,
              }}
            >
              {value}
              <span style={{ color, fontWeight: 800 }}>{suffix}</span>
            </div>
            <div style={{ fontSize: 12, color: '#4a5a72', fontWeight: 500 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Best practice badge ── */}
      <div
        className="flex items-center gap-2 relative z-10"
        style={{ marginTop: 'auto', paddingTop: 32 }}
      >
        <IconCheckCircle size={13} color="#3b82f6" />
        <span style={{ fontSize: 12.5, fontStyle: 'italic', color: '#3b82f6', fontWeight: 500 }}>
          Best practice for enterprise multi-role SaaS platforms
        </span>
      </div>
    </div>
  )
}
