'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppModal from '@/components/ui/app-modal';
import FileDropzone from '@/components/shared/FileDropzone';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';

// Mirrors createOrganizationSchema's policy shape (helixion-mvp-backend
// src/validators/organization.validator.ts) — one row per approval type,
// each needing enabled/levels/minLevelToApprove/assignmentMode. Descriptions
// are display-only, not sent to the backend.
//
// Reimbursement is deliberately NOT configurable here for now (not part of
// this stage's scope) — it still gets submitted with a sensible default
// below (buildFormPayload), since the backend schema requires the full
// policy object regardless.
const POLICY_BLOCKS = [
  { key: 'managerApproval', label: 'Manager Approval', description: 'First review in the chain', defaultAssignmentMode: 'assigned' },
  { key: 'trainingDeptApproval', label: 'Training Dept Approval', description: 'Policy gate for training validation', defaultAssignmentMode: 'pool' },
  { key: 'osdReview', label: 'OSD Review', description: 'Operational scheduling and booking review', defaultAssignmentMode: 'pool' },
  { key: 'tourForm', label: 'Tour Form', description: 'Travel request approval stage', defaultAssignmentMode: 'assigned' },
] as const;

const REIMBURSEMENT_DEFAULT = { enabled: true, levels: 1, minLevelToApprove: 1, assignmentMode: 'pool' as const };

type PolicyBlockKey = typeof POLICY_BLOCKS[number]['key'];

interface PolicyBlockState {
  enabled: boolean;
  levels: string;
  minLevelToApprove: string;
  assignmentMode: 'assigned' | 'pool';
}

const emptyBlock = (mode: 'assigned' | 'pool'): PolicyBlockState => ({
  enabled: true,
  levels: '1',
  minLevelToApprove: '1',
  assignmentMode: mode,
});

const INITIAL_POLICY = POLICY_BLOCKS.reduce((acc, block) => {
  acc[block.key] = emptyBlock(block.defaultAssignmentMode);
  return acc;
}, {} as Record<PolicyBlockKey, PolicyBlockState>);

const JSON_TEMPLATE = JSON.stringify(
  {
    name: 'Acme Corp',
    slug: 'acme-corp',
    orgType: 'corporate',
    policy: {
      managerApproval: { enabled: true, levels: 3, minLevelToApprove: 1, assignmentMode: 'assigned' },
      trainingDeptApproval: { enabled: true, levels: 4, minLevelToApprove: 2, assignmentMode: 'pool' },
      osdReview: { enabled: true, levels: 2, minLevelToApprove: 1, assignmentMode: 'pool' },
      tourForm: { enabled: true, levels: 2, minLevelToApprove: 1, assignmentMode: 'assigned' },
      reimbursement: { enabled: true, levels: 2, minLevelToApprove: 1, assignmentMode: 'pool' },
      tourApproval: { managerApprovalRequired: true, ctdApprovalRequired: true },
      reimbursementApproval: { managerApprovalRequired: true, osdApprovalRequired: true },
    },
    policyAssignments: { trainingDeptChain: [], osdChain: [] },
  },
  null,
  2
);

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

export default function OrgPolicySetupPage() {
  const router = useRouter();
  const { createOrganization, loading, error } = useCreateOrganization();

  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [orgType, setOrgType] = useState<'corporate' | 'training_provider' | 'osd_internal'>('corporate');
  const [policy, setPolicy] = useState(INITIAL_POLICY);

  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);
  const [jsonPayload, setJsonPayload] = useState<unknown>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const updateBlock = <K extends keyof PolicyBlockState>(
    blockKey: PolicyBlockKey,
    field: K,
    value: PolicyBlockState[K]
  ) => {
    setPolicy((prev) => ({
      ...prev,
      [blockKey]: { ...prev[blockKey], [field]: value },
    }));
  };

  const buildFormPayload = () => ({
    name: name.trim(),
    slug: slug.trim().toLowerCase(),
    orgType,
    policy: {
      reimbursement: REIMBURSEMENT_DEFAULT,
      ...Object.fromEntries(
        POLICY_BLOCKS.map((block) => [
          block.key,
          {
            enabled: policy[block.key].enabled,
            levels: Number(policy[block.key].levels) || 1,
            minLevelToApprove: Number(policy[block.key].minLevelToApprove) || 1,
            assignmentMode: policy[block.key].assignmentMode,
          },
        ])
      ),
      tourApproval: { managerApprovalRequired: true, ctdApprovalRequired: true },
      reimbursementApproval: { managerApprovalRequired: true, osdApprovalRequired: true },
    },
    policyAssignments: { trainingDeptChain: [], osdChain: [] },
  });

  const handleJsonFileSelected = async (file: File) => {
    setJsonFile(file);
    setJsonParseError(null);
    setJsonPayload(null);
    try {
      const text = await file.text();
      setJsonPayload(JSON.parse(text));
    } catch {
      setJsonParseError('That file isn’t valid JSON — check it against the template.');
    }
  };

  const canSubmitForm = name.trim().length >= 2 && slug.trim().length >= 2;
  const canSubmitJson = !!jsonPayload && !jsonParseError;

  const handleSubmit = async () => {
    const payload = mode === 'form' ? buildFormPayload() : jsonPayload;
    const ok = await createOrganization(payload);
    if (ok) {
      setConfirmOpen(false);
      setSuccessOpen(true);
    }
  };

  const handleDone = () => {
    setSuccessOpen(false);
    // Re-runs app/admin/layout.tsx (a server component), which re-fetches
    // organization status — org-dependent nav items (e.g. Bulk Import)
    // un-gray themselves automatically, no manual reload needed.
    router.refresh();
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="text-xs text-white/35">
        Workspace <span className="mx-1">›</span> Org Policy Setup
      </div>

      {/* Header + mode toggle */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Org Policy Setup</h1>
          <p className="text-sm text-white/50 mt-1 max-w-2xl">
            Create or upload an organization and its approval policy schedule. Org-dependent screens
            like Bulk Import stay disabled until this is done.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1 flex-shrink-0">
          <button
            onClick={() => setMode('form')}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              mode === 'form' ? 'bg-primary text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            Fill Form
          </button>
          <button
            onClick={() => setMode('json')}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              mode === 'json' ? 'bg-primary text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            Upload JSON
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0f1a] p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">Organization Policy Matrix</h2>
            <p className="text-xs text-white/40 mt-0.5">
              Define minimum and total approval levels for each stage in the workflow.
            </p>
          </div>
          <button
            onClick={() => {
              const blob = new Blob([JSON_TEMPLATE], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'org_policy_template.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 flex-shrink-0"
          >
            Download Template
          </button>
        </div>

        {/* Identity fields */}
        <div className="grid grid-cols-3 gap-4">
          <FieldBox label="Organization Name">
            <input
              className={fieldInputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Corp"
            />
          </FieldBox>
          <FieldBox label="Slug">
            <input
              className={fieldInputClass}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="acme-corp"
            />
          </FieldBox>
          <FieldBox label="Org Type">
            <select
              value={orgType}
              onChange={(e) => setOrgType(e.target.value as typeof orgType)}
              className={`${fieldInputClass} cursor-pointer [&>option]:bg-[#0d0f1a]`}
            >
              <option value="corporate">Corporate</option>
              <option value="training_provider">Training Provider</option>
              <option value="osd_internal">OSD Internal</option>
            </select>
          </FieldBox>
        </div>

        {mode === 'form' ? (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_120px_150px_140px] gap-3 px-4 py-2.5 bg-white/[0.03] text-[10px] font-semibold tracking-widest uppercase text-white/35">
              <div>Approval Stage</div>
              <div>Min Level</div>
              <div>Total No. of Levels</div>
              <div>Assignment Mode</div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-white/5">
              {POLICY_BLOCKS.map((block) => {
                const state = policy[block.key];
                return (
                  <div
                    key={block.key}
                    className="grid grid-cols-[1fr_120px_150px_140px] gap-3 px-4 py-3.5 items-center"
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => updateBlock(block.key, 'enabled', !state.enabled)}
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
                        onChange={(e) => updateBlock(block.key, 'minLevelToApprove', e.target.value)}
                      />
                    </FieldBox>

                    <FieldBox label="">
                      <input
                        type="number"
                        min={1}
                        className={fieldInputClass}
                        value={state.levels}
                        onChange={(e) => updateBlock(block.key, 'levels', e.target.value)}
                      />
                    </FieldBox>

                    <FieldBox label="">
                      <select
                        value={state.assignmentMode}
                        onChange={(e) => updateBlock(block.key, 'assignmentMode', e.target.value as 'assigned' | 'pool')}
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
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-white">Raw JSON Upload</h3>
            </div>
            <p className="text-xs text-white/40 -mt-2">
              Use JSON when you already have the policy structure exported from another system.
            </p>

            <FileDropzone
              accept=".json"
              isProcessing={loading}
              label={jsonFile ? jsonFile.name : 'Drop a JSON file here or click to browse'}
              hint="Supports nested approval levels, stage names, and assignment modes."
              fileInputRef={fileInputRef}
              onFileSelected={handleJsonFileSelected}
            />

            {jsonParseError && (
              <p className="text-xs text-accentRed">{jsonParseError}</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-white/35">
            Bulk Import stays disabled until the org policy is saved.
          </p>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={mode === 'form' ? !canSubmitForm : !canSubmitJson}
          >
            Save Org Policy
          </Button>
        </div>
      </div>

      <AppModal
        isOpen={confirmOpen}
        type="confirm"
        title="Save organization policy?"
        description={
          mode === 'form'
            ? `This will create "${name}" with the policy configured above.`
            : `This will create the organization defined in ${jsonFile?.name}.`
        }
        loading={loading}
        error={error}
        onConfirm={handleSubmit}
        onCancel={() => setConfirmOpen(false)}
      />

      <AppModal
        isOpen={successOpen}
        type="success"
        title="Saved"
        description="Organization policy saved. Org-dependent screens are now unlocked."
        onDone={handleDone}
      />
    </div>
  );
}
