// Shared by the Org Policy Setup page (create + self-navigated edit) and
// EditOrganizationModal (edit from the Organizations list) — kept in one
// place so the policy-block shape and its defaults never drift between the
// two entry points into the same form.

export const POLICY_BLOCKS = [
  { key: 'managerApproval', label: 'Manager Approval', description: 'First review in the chain', defaultAssignmentMode: 'assigned' },
  { key: 'trainingDeptApproval', label: 'Training Dept Approval', description: 'Policy gate for training validation', defaultAssignmentMode: 'pool' },
  { key: 'osdReview', label: 'OSD Review', description: 'Operational scheduling and booking review', defaultAssignmentMode: 'pool' },
  { key: 'tourForm', label: 'Tour Form', description: 'Travel request approval stage', defaultAssignmentMode: 'assigned' },
] as const;

// Reimbursement is deliberately NOT configurable in this form (not part of
// this stage's scope) — it's still submitted with a sensible default, since
// the backend's create schema requires the full policy object regardless.
export const REIMBURSEMENT_DEFAULT = { enabled: true, levels: 1, minLevelToApprove: 1, assignmentMode: 'pool' as const };

export type PolicyBlockKey = typeof POLICY_BLOCKS[number]['key'];

export interface PolicyBlockState {
  enabled: boolean;
  minLevelToApprove: string;
  assignmentMode: 'assigned' | 'pool';
}

export const emptyBlock = (mode: 'assigned' | 'pool'): PolicyBlockState => ({
  enabled: true,
  minLevelToApprove: '1',
  assignmentMode: mode,
});

export const INITIAL_POLICY: Record<PolicyBlockKey, PolicyBlockState> = POLICY_BLOCKS.reduce((acc, block) => {
  acc[block.key] = emptyBlock(block.defaultAssignmentMode);
  return acc;
}, {} as Record<PolicyBlockKey, PolicyBlockState>);

export const blockStateFromPolicy = (policyBlock: any, fallbackMode: 'assigned' | 'pool'): PolicyBlockState => ({
  enabled: policyBlock?.enabled ?? true,
  minLevelToApprove: String(policyBlock?.minLevelToApprove ?? 1),
  assignmentMode: policyBlock?.assignmentMode ?? fallbackMode,
});

export const policyStateFromOrganization = (policy: any): Record<PolicyBlockKey, PolicyBlockState> => ({
  managerApproval: blockStateFromPolicy(policy?.managerApproval, 'assigned'),
  trainingDeptApproval: blockStateFromPolicy(policy?.trainingDeptApproval, 'pool'),
  osdReview: blockStateFromPolicy(policy?.osdReview, 'pool'),
  tourForm: blockStateFromPolicy(policy?.tourForm, 'assigned'),
});

// Builds the full policy object the backend expects (create schema requires
// every stage, including the non-editable reimbursement default + the two
// fixed tour/reimbursement approval flags).
export const buildPolicyPayload = (policy: Record<PolicyBlockKey, PolicyBlockState>) => ({
  reimbursement: REIMBURSEMENT_DEFAULT,
  ...Object.fromEntries(
    POLICY_BLOCKS.map((block) => [
      block.key,
      {
        enabled: policy[block.key].enabled,
        // "Total No. of Levels" was removed from the UI — actual chain depth
        // comes from each employee's own manager hierarchy, not an org-wide
        // number. The backend schema still requires levels >= 1, so a
        // constant is sent; nothing reads this value.
        levels: 1,
        minLevelToApprove: Number(policy[block.key].minLevelToApprove) || 1,
        assignmentMode: policy[block.key].assignmentMode,
      },
    ])
  ),
  tourApproval: { managerApprovalRequired: true, ctdApprovalRequired: false },
  reimbursementApproval: { managerApprovalRequired: true, osdApprovalRequired: true },
});
