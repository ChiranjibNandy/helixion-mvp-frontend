import RegisterForm  from '@/components/auth/RegisterForm'
import TrustBadges   from '@/components/auth/TrustBadges'

// ─────────────────────────────────────────────
//  RegisterRightPanel — right side of register page
// ─────────────────────────────────────────────
export default function RegisterRightPanel() {
  return (
    <div
      className="flex-1 flex items-center justify-center"
      style={{
        background: '#08101e',
        padding:    '40px 24px',
        overflowY:  'auto',
      }}
    >
      {/* Card */}
      <div
        className="hx-fade-up w-full"
        style={{ maxWidth: 460 }}
      >

        {/* ── Header ── */}
        <div className="mb-7">

          {/* Step pill */}
          

          <h2
            style={{
              fontSize:      28,
              fontWeight:    800,
              color:         '#e8edf5',
              letterSpacing: '-0.8px',
              marginBottom:  6,
            }}
          >
            Create your account
          </h2>
          
        </div>

        {/* ── Register Form ── */}
        <RegisterForm />

        {/* ── Trust Badges ── */}
        <TrustBadges />

      </div>
    </div>
  )
}
