'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppModal from '@/components/ui/app-modal';
import FileDropzone from '@/components/shared/FileDropzone';
import OrganizationPolicyFields from '@/components/admin/OrganizationPolicyFields';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';
import { useOrganizationDetails } from '@/hooks/useOrganizationDetails';
import { getOrganizationStatusAPI } from '@/services/adminService';
import {
  INITIAL_POLICY,
  PolicyBlockKey,
  PolicyBlockState,
  buildPolicyPayload,
  policyStateFromOrganization,
} from '@/utils/organizationPolicyForm';

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
      tourApproval: { managerApprovalRequired: true, ctdApprovalRequired: false },
      reimbursementApproval: { managerApprovalRequired: true, osdApprovalRequired: true },
    },
    policyAssignments: { trainingDeptChain: [], osdChain: [] },
  },
  null,
  2
);

export default function OrgPolicySetupPage() {
  const router = useRouter();
  const { createOrganization, updateOrganization, updateOrganizationPolicy, loading: saving, error } = useCreateOrganization();

  // Step 0 — figure out whether this admin already has an org. Until this
  // resolves we don't know whether to render the Create or Edit form, so the
  // page shows a loading state rather than flashing Create then switching.
  const [orgId, setOrgId] = useState<string | null>(null);
  const [statusChecked, setStatusChecked] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrganizationStatusAPI()
      .then((res) => {
        if (cancelled) return;
        setOrgId(res.data?.data?.orgId ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        setStatusError(err?.response?.data?.message || 'Failed to check organization status');
      })
      .finally(() => {
        if (!cancelled) setStatusChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isEditing = !!orgId;
  const { organization, loading: orgLoading, error: orgError } = useOrganizationDetails(orgId);

  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [orgType, setOrgType] = useState<'corporate' | 'training_provider' | 'osd_internal'>('corporate');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [policy, setPolicy] = useState<Record<PolicyBlockKey, PolicyBlockState>>(INITIAL_POLICY);
  // Never edited from this form (nothing else in the app populates it
  // either), but preserved as-is on save so an edit never silently wipes an
  // existing chain out from under a future feature that does set it.
  const [policyAssignments, setPolicyAssignments] = useState<{ trainingDeptChain: unknown[]; osdChain: unknown[] }>({
    trainingDeptChain: [],
    osdChain: [],
  });

  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);
  const [jsonPayload, setJsonPayload] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // Prefill once the existing org's details load.
  useEffect(() => {
    if (!organization) return;
    setName(organization.name);
    setSlug(organization.slug);
    setOrgType(organization.orgType as typeof orgType);
    setStatus(organization.status as typeof status);
    setPolicy(policyStateFromOrganization(organization.policy));
    setPolicyAssignments(organization.policyAssignments ?? { trainingDeptChain: [], osdChain: [] });
  }, [organization]);

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
    status,
    policy: buildPolicyPayload(policy),
    policyAssignments,
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

    let ok: boolean;
    if (isEditing && orgId) {
      const detailsOk = await updateOrganization(orgId, {
        name: payload.name,
        slug: payload.slug,
        orgType: payload.orgType,
        status: payload.status ?? status,
      });
      const policyOk = detailsOk
        ? await updateOrganizationPolicy(orgId, {
            policy: payload.policy,
            policyAssignments: payload.policyAssignments ?? policyAssignments,
          })
        : false;
      ok = detailsOk && policyOk;
    } else {
      ok = await createOrganization(payload);
    }

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

  // Loading gate — avoid flashing the Create form before we know whether an
  // org already exists, and avoid flashing an empty Edit form before its
  // details arrive.
  if (!statusChecked || (isEditing && orgLoading && !organization)) {
    return (
      <div className="space-y-5">
        <div className="text-xs text-white/35">
          Workspace <span className="mx-1">›</span> Org Policy Setup
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d0f1a] p-6">
          <div className="py-10 text-center text-sm text-white/40">Loading organization…</div>
        </div>
      </div>
    );
  }

  if (statusError || (isEditing && orgError)) {
    return (
      <div className="space-y-5">
        <div className="text-xs text-white/35">
          Workspace <span className="mx-1">›</span> Org Policy Setup
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d0f1a] p-6">
          <p className="text-sm text-accentRed">{statusError || orgError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="text-xs text-white/35">
        Workspace <span className="mx-1">›</span> Org Policy Setup
      </div>

      {/* Header + mode toggle */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Organization' : 'Org Policy Setup'}
          </h1>
          <p className="text-sm text-white/50 mt-1 max-w-2xl">
            {isEditing
              ? 'Update your organization\'s details and approval policy schedule.'
              : 'Create or upload an organization and its approval policy schedule. Org-dependent screens like Bulk Import stay disabled until this is done.'}
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
              Set the minimum approver level and assignment mode for each stage in the workflow.
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

        {mode === 'form' ? (
          <OrganizationPolicyFields
            name={name}
            onNameChange={setName}
            slug={slug}
            onSlugChange={setSlug}
            orgType={orgType}
            onOrgTypeChange={setOrgType}
            status={status}
            onStatusChange={setStatus}
            policy={policy}
            onPolicyBlockChange={updateBlock}
          />
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
              isProcessing={false}
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
            {isEditing ? 'Changes apply immediately once saved.' : 'Bulk Import stays disabled until the org policy is saved.'}
          </p>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={mode === 'form' ? !canSubmitForm : !canSubmitJson}
          >
            {isEditing ? 'Save Changes' : 'Save Org Policy'}
          </Button>
        </div>
      </div>

      <AppModal
        isOpen={confirmOpen}
        type="confirm"
        title={isEditing ? 'Save organization changes?' : 'Save organization policy?'}
        description={
          isEditing
            ? `This will update "${name}" with the details and policy configured above.`
            : mode === 'form'
            ? `This will create "${name}" with the policy configured above.`
            : `This will create the organization defined in ${jsonFile?.name}.`
        }
        loading={saving}
        error={error}
        onConfirm={handleSubmit}
        onCancel={() => setConfirmOpen(false)}
      />

      <AppModal
        isOpen={successOpen}
        type="success"
        title="Saved"
        description={
          isEditing
            ? 'Organization details updated.'
            : 'Organization policy saved. Org-dependent screens are now unlocked.'
        }
        onDone={handleDone}
      />
    </div>
  );
}
