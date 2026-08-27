'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import AppModal from '@/components/ui/app-modal';
import OrganizationPolicyFields from '@/components/admin/OrganizationPolicyFields';
import { t } from '@/lib/i18n';
import { useOrganizationDetails } from '@/hooks/useOrganizationDetails';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';
import {
  INITIAL_POLICY,
  PolicyBlockKey,
  PolicyBlockState,
  buildPolicyPayload,
  policyStateFromOrganization,
} from '@/utils/organizationPolicyForm';

interface EditOrganizationModalProps {
  organizationId: string;
  onClose: () => void;
  /** Called after a successful save so the caller can refresh its list. */
  onSaved: (name: string) => void;
}

export default function EditOrganizationModal({ organizationId, onClose, onSaved }: EditOrganizationModalProps) {
  const { organization, loading: fetchLoading, error: fetchError } = useOrganizationDetails(organizationId);
  const { updateOrganization, updateOrganizationPolicy, loading: saving, error: saveError } = useCreateOrganization();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [orgType, setOrgType] = useState<'corporate' | 'training_provider' | 'osd_internal'>('corporate');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [policy, setPolicy] = useState<Record<PolicyBlockKey, PolicyBlockState>>(INITIAL_POLICY);
  // Preserved as-is on save — this modal never edits assignment chains, and
  // shouldn't silently wipe one out from under a future feature that does.
  const [policyAssignments, setPolicyAssignments] = useState<{ trainingDeptChain: unknown[]; osdChain: unknown[] }>({
    trainingDeptChain: [],
    osdChain: [],
  });

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

  const canSubmit = name.trim().length >= 2 && slug.trim().length >= 2 && !saving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const detailsOk = await updateOrganization(organizationId, {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      orgType,
      status,
    });
    const policyOk = detailsOk
      ? await updateOrganizationPolicy(organizationId, {
          policy: buildPolicyPayload(policy),
          policyAssignments,
        })
      : false;

    if (detailsOk && policyOk) {
      toast.success(`${name} was updated successfully.`);
      onSaved(name);
    }
  };

  return (
    <AppModal isOpen onClose={onClose} className="max-w-5xl" title={organization ? `Edit ${organization.name}` : 'Edit organization'}>
      {fetchLoading ? (
        <div className="py-10 text-center text-sm text-white/40">Loading organization...</div>
      ) : fetchError || !organization ? (
        <div className="flex items-start gap-3 py-6">
          <AlertCircle className="text-accentRed flex-shrink-0 mt-0.5" size={16} />
          <p className="text-sm text-accentRed">{fetchError || 'Organization not found.'}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {saveError && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accentRed/10 border border-accentRed/20">
              <AlertCircle className="text-accentRed flex-shrink-0 mt-0.5" size={14} />
              <p className="text-sm text-accentRed">{saveError}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-white/35">
              <span className="text-white/50">{t('admin.organizations.assignedLabel')}</span> — {t('admin.organizations.assignedHint')}{' '}
              <span className="text-white/50">{t('admin.organizations.poolLabel')}</span> — {t('admin.organizations.poolHint')}
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm text-white/70 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primaryDark
                           transition-all duration-200 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Save changes
              </button>
            </div>
          </div>
        </form>
      )}
    </AppModal>
  );
}
