// ─── permissions ────────────────────────────────────────────────────────────────────
export interface Permissions {
  canEnroll: boolean,
  canRecommend: boolean,
  canApproveEnrollment: boolean,
  canReviewTrainingDept: boolean,
  canApproveTrainingDept: boolean,
  canApproveTourCtd: boolean,
  canReviewOsd: boolean,
  canApproveOsd: boolean
}
// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  userId: string;
  name: string;
  email: string;
  location: string;
  role: string;
  permissions: Permissions;
  hierarchyLevel?: number;
}

// ─── Enrollment ──────────────────────────────────────────────────────────────
export interface EnrollmentProgramSnapshot {
  title: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  training_providerId: string;
}

export interface Enrollment {
  _id: string;
  userId: string;
  programId: string;
  status: "pending" | "active" | "completed" | "cancelled";
  stayType: "single_occupancy" | "twin_sharing" | "non_residential";
  feeAmount: number;
  currency: string;
  programSnapshot: EnrollmentProgramSnapshot;
  approvalStatus: "pending_approval" | "approved" | "rejected" | "not_required";
  source: "web" | "mobile" | "api" | "admin";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Legacy field — kept for backward compat with existing dashboard components
  programDetails?: Programme;
}

// ─── Programme ───────────────────────────────────────────────────────────────
export interface Programme {
  _id: string;
  title: string;
  duration: number;
  venue: string;
  start_date: Date,
  end_date: Date
  name: string;
  description: string;
  mode: string;
  location: string;
  status: string;
  fee: number;
}

// ─── Draft Program (Training Provider) ───────────────────────────────────────
export interface DraftProgram {
  _id: string;
  title: string;
  startDate: string;
  endDate?: string;
  venueName?: string;
  city?: string;
  state?: string;
  stayOptions?: { type: string; price: number }[];
  brochureUrl?: string;
  brochurePublicId?: string;
  minParticipants?: number;
  maxParticipants?: number;
  status: 'draft' | 'published';
  createdBy: string;
  batchId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Draft Programs Paginated Response ───────────────────────────────────────
export interface DraftProgramsResponse {
  programs: DraftProgram[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Nav Item ────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  key: string;
  href?: string;
  icon: string;
  badge?: number;
  disabled?: boolean;
  disabledReason?: string;
}

// stay Options in stay type of program creation
export interface StayOption {
  id: string;
  label: string;
  price: string;
}


//_____Stay Type in program creation_______________________________________
export interface StayType {
  id: string;
  label: string;
  enabled: boolean;
  options: StayOption[];
}

//program saved status

export enum PROGRAM_SAVED_STATUS {
  DRAFT = "draft",
  PUBLISHED = "published",
}

// ─── Available Program (Employee Browse View) ─────────────────────────────────
export interface AvailableProgram {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  venueName: string;
  city?: string;
  state?: string;
  stayOptions?: { type: string; price: number }[];
  brochureUrl?: string;
  minParticipants?: number;
  maxParticipants?: number;
  status: string;
  createdBy: string | { _id: string; name: string; description?: string };
  providerName?: string;
}

// ─── Stay Type Key ────────────────────────────────────────────────────────────
export type StayTypeKey = 'single_occupancy' | 'twin_sharing' | 'non_residential';

// ─── Travel & Stay ────────────────────────────────────────────────────────────
export type TRAVEL_TYPE = "company_assisted" | "self_travel";

export interface TourFormState {
  travelType: TRAVEL_TYPE;
  placeOfTour: string;
  frequentFlyerNo: string;
  modeOfTravel: string;
  purpose: string;
  advancePaymentRequired: number;
  bookingDetails: BookingRow[];
}
export interface BookingRow {
  id: string;
  from: string;
  to: string;
  refNo: string;
  departureTime: string;
  travelDate: string;
  travelClass: string;
}

export interface StepperStep {
  number: number;
  labelKey: string;
}

export interface TravelDetailsFormProps {
  tourForm: TourFormState;
  setTourForm: React.Dispatch<React.SetStateAction<TourFormState>>;
  addBookingRow: () => void;
  removeBookingRow: (id: string) => void;
  validationError: string | null;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}