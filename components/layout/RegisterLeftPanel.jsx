import { IconCheckCircle, IconSparkle } from '@/components/ui/Icons'

// ─────────────────────────────────────────────
//  Feature bullets shown on register left panel
// ─────────────────────────────────────────────
const FEATURES = [
  'Role-based dashboard tailored to your job',
  'Real-time training analytics & reports',
  'Enterprise SSO & team management',
  'SOC 2 compliant — your data stays safe',
]

// ─────────────────────────────────────────────
//  RegisterLeftPanel
// ─────────────────────────────────────────────
export default function RegisterLeftPanel() {
  return (
    <div
      className="hx-left-panel dot-grid flex flex-col relative overflow-hidden"
      style={{
        flex:        '0 0 44%',
        maxWidth:    '44%',
        background:  'linear-gradient(158deg, #071022 0%, #07122a 45%, #060d1c 100%)',
        padding:     '36px 48px',
        borderRight: '1px solid #0c1b30',
      }}
    >
      {/* Glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '15%',
          width: 420, height: 320,
          background: 'radial-gradient(circle, rgba(22,62,140,0.28) 0%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%', right: '-10%',
          width: 300, height: 240,
          background: 'radial-gradient(circle, rgba(14,55,120,0.18) 0%, transparent 70%)',
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
      <div
        className="flex items-center gap-2 relative z-10"
        style={{ marginTop: 'auto', paddingTop: 100 }}
      >
        <div
          className="rounded-sm"
          style={{ width: 28, height: 2, background: 'linear-gradient(90deg, transparent, #3b6fe0)' }}
        />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#6b7d96' }}>
          JOIN HELIXION · GET STARTED FREE
        </span>
        <span style={{ fontSize: 11, color: '#f59e0b' }}>★</span>
      </div>

      {/* ── Headline ── */}
      <div className="relative z-10 mt-4 mb-8">
        <h1
          style={{
            fontSize:      42,
            fontWeight:    800,
            lineHeight:    1.1,
            letterSpacing: '-1.5px',
            marginBottom:  16,
          }}
        >
          Your workspace,
          <br />
          <span style={{ color: '#3b6fe0' }}>ready</span>
          <span style={{ color: '#e8edf5' }}> in seconds.</span>
        </h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#7a8faa', maxWidth: 360, fontWeight: 400 }}>
          Sign up once and get immediate access to the
          dashboard built for your role — no setup required.
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

      {/* ── Feature bullets ── */}
      <div className="relative z-10 flex flex-col gap-3.5">
        {FEATURES.map((feat, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: 28, height: 28,
                background: 'rgba(59,111,224,0.12)',
                border:     '1px solid rgba(59,111,224,0.2)',
              }}
            >
              <IconCheckCircle size={12} color="#3b6fe0" />
            </div>
            <span style={{ fontSize: 13.5, color: '#8a9ab5', fontWeight: 500, lineHeight: 1.4 }}>
              {feat}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bottom badge ── */}
      <div
        className="flex items-center gap-2 relative z-10"
        style={{ marginTop: 'auto', paddingTop: 36 }}
      >
        <IconCheckCircle size={13} color="#3b82f6" />
        <span style={{ fontSize: 12.5, fontStyle: 'italic', color: '#3b82f6', fontWeight: 500 }}>
          Best practice for enterprise multi-role SaaS platforms
        </span>
      </div>
    </div>
  )
}
