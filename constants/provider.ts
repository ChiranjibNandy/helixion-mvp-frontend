import { NavSection } from "@/types/employee";
import { ROUTES } from "./navigation";

export const PROVIDER_NAV_SECTIONS: NavSection[] = [
  {
    category: 'Workspace',
    items: [
      {
        label: 'Dashboard',
        key: 'dashboard',
        href: ROUTES.PROVIDER.DASHBOARD,
        icon: 'layout-dashboard',
      },
      {
        label: 'Profile',
        key: 'profile',
        href: '/dashboard/profile',
        icon: 'user-circle',
      },
    ],
  },
  {
    category: 'Programs',
    items: [
      {
        label: 'Create New Program',
        key: 'create-program',
        href: ROUTES.PROVIDER.PROGRAMS.CREATE,
        icon: 'plus-circle',
      },
      {
        label: 'Bulk Upload',
        key: 'bulk-upload',
        href: ROUTES.PROVIDER.PROGRAMS.BULK,
        icon: 'upload-cloud',
      },
      {
        label: 'View Drafts',
        key: 'drafts',
        href: ROUTES.PROVIDER.PROGRAMS.DRAFTS,
        icon: 'file-text',
      },
    ],
  },
  {
    category: 'Operations',
    items: [
      {
        label: 'Download Enrolment Data',
        key: 'enrolments',
        href: '/dashboard/operations/enrolments',
        icon: 'download',
      },
      {
        label: 'Update Attendance',
        key: 'attendance',
        href: ROUTES.PROVIDER.ATTENDANCE,
        icon: 'clipboard-check',
      },
      {
        label: 'View Reports',
        key: 'reports',
        href: '/dashboard/operations/reports',
        icon: 'bar-chart',
      },
    ],
  },
];

/** Expected CSV column headers for bulk program upload — mirrors the backend Zod schema (bulkProgramRowSchema) */
export const PROGRAM_CSV_COLUMNS = [
  'title', 'startDate', 'endDate', 'venue', 'city', 'state', 'isResidential', 'stayType',
  'singleOccupancyFee', 'twinSharingFee', 'nonResidentialFee',
  'brochureUrl', 'minParticipants', 'maxParticipants', 'status',
] as const;

/** Columns that are optional even though listed above — excluded from the "required" checks in BulkProgramUpload.tsx */
export const OPTIONAL_CSV_COLUMNS = ['brochureUrl', 'state'] as const;

export const SAMPLE_CSV_ROW = 'Leadership Workshop,2026-06-01,2026-06-03,Taj Lands End,Mumbai,Maharashtra,true,single_occupancy,15000,12000,8000,,10,50,draft';
