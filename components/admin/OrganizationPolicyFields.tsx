'use client';

import { POLICY_BLOCKS, PolicyBlockKey, PolicyBlockState } from '@/utils/organizationPolicyForm';

// Small "label above value" box — matches the Organization Name / Slug / Org
// Type fields and each table cell in the reference design.
function FieldBox({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 px-3.5 py-2.5">
      {label && (
        <div className="text-[10px] font-semibold tracking-widest uppercase text-white/35 mb-1.5">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

const fieldInputClass =
  'w-full bg-transparent text-sm text-white placeholder:text-white/25 outline-none';

interface OrganizationPolicyFieldsProps {
  name: string;
  onNameChange: (v: string) => void;
  slug: string;
  onSlugChange: (v: string) => void;
  orgType: 'corporate' | 'training_provider' | 'osd_internal';
  onOrgTypeChange: (v: 'corporate' | 'training_provider' | 'osd_internal') => void;
  status: 'active' | 'inactive';
  onStatusChange: (v: 'active' | 'inactive') => void;
  policy: Record<PolicyBlockKey, PolicyBlockState>;
  onPolicyBlockChange: <K extends keyof PolicyBlockState>(blockKey: PolicyBlockKey, field: K, value: PolicyBlockState[K]) => void;
}

/** Identity fields + approval-policy matrix — shared by the Org Policy Setup
 *  page (create / self-navigated edit) and EditOrganizationModal, so the two
 *  entry points into "edit an organization" never drift apart. */
export default function OrganizationPolicyFields({
  name,
  onNameChange,
  slug,
  onSlugChange,
  orgType,
  onOrgTypeChange,
  status,
  onStatusChange,
  policy,
  onPolicyBlockChange,
}: OrganizationPolicyFieldsProps) {
  return (
    <div className="space-y-5">
      {/* Identity fields */}
      <div className="grid grid-cols-4 gap-4">
        <FieldBox label="Organization Name">
          <input
            className={fieldInputClass}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Acme Corp"
          />
        </FieldBox>
        <FieldBox label="Slug">
          <input
            className={fieldInputClass}
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="acme-corp"
          />
        </FieldBox>
        <FieldBox label="Org Type">
          <select
            value={orgType}
            onChange={(e) => onOrgTypeChange(e.target.value as typeof orgType)}
            className={`${fieldInputClass} cursor-pointer [&>option]:bg-[#0d0f1a]`}
          >
            <option value="corporate">Corporate</option>
            <option value="training_provider">Training Provider</option>
            <option value="osd_internal">OSD Internal</option>
          </select>
        </FieldBox>
        <FieldBox label="Status">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as typeof status)}
            className={`${fieldInputClass} cursor-pointer [&>option]:bg-[#0d0f1a]`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FieldBox>
      </div>

      {/* Policy matrix */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_140px] gap-3 px-4 py-2.5 bg-white/[0.03] text-[10px] font-semibold tracking-widest uppercase text-white/35">
          <div>Approval Stage</div>
          <div>Min Level</div>
          <div>Assignment Mode</div>
        </div>

        <div className="divide-y divide-white/5">
          {POLICY_BLOCKS.map((block) => {
            const state = policy[block.key];
            return (
              <div
                key={block.key}
                className="grid grid-cols-[1fr_120px_140px] gap-3 px-4 py-3 items-center"
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => onPolicyBlockChange(block.key, 'enabled', !state.enabled)}
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                      state.enabled
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-white/20 text-transparent'
                    }`}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div>
                    <div className="text-sm font-medium text-white">{block.label}</div>
                    <div className="text-xs text-white/40">{block.description}</div>
                  </div>
                </div>

                <FieldBox label="">
                  <input
                    type="number"
                    min={1}
                    className={fieldInputClass}
                    value={state.minLevelToApprove}
                    onChange={(e) => onPolicyBlockChange(block.key, 'minLevelToApprove', e.target.value)}
                  />
                </FieldBox>

                <FieldBox label="">
                  <select
                    value={state.assignmentMode}
                    onChange={(e) => onPolicyBlockChange(block.key, 'assignmentMode', e.target.value as 'assigned' | 'pool')}
                    className={`${fieldInputClass} cursor-pointer [&>option]:bg-[#0d0f1a]`}
                  >
                    <option value="assigned">Assigned</option>
                    <option value="pool">Pool</option>
                  </select>
                </FieldBox>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
