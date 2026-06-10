// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  userId: string;
  name: string;
  email: string;
  location: string;
  role: string;
}

// ─── Enrollment ──────────────────────────────────────────────────────────────
export interface EnrollmentProgramSnapshot {
  title:               string;
  startDate?:          string;
  endDate?:            string;
  venue?:              string;
  training_providerId: string;
}

export interface Enrollment {
  _id:             string;
  userId:          string;
  programId:       string;
  status:          "pending" | "active" | "completed" | "cancelled";
  stayType:        "single_occupancy" | "twin_sharing" | "non_residential";
  feeAmount:       number;
  currency:        string;
  programSnapshot: EnrollmentProgramSnapshot;
  approvalStatus:  "pending_approval" | "approved" | "rejected" | "not_required";
  source:          "web" | "mobile" | "api" | "admin";
  notes?:          string;
  createdAt:       string;
  updatedAt:       string;
  // Legacy field — kept for backward compat with existing dashboard components
  programDetails?: Programme;
}

// ─── Programme ───────────────────────────────────────────────────────────────
export interface Programme {
  _id: string;
  title: string;
  duration: number;
  venue: string;
  start_date:Date,
  end_date:Date
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
  venue?: string;
  singleOccupancyFee?: number;
  twinSharingFee?: number;
  nonResidentialFee?: number;
  brochureUrl?: string;
  brochurePublicId?: string;
  minParticipants?: number;
  maxParticipants?: number;
  status: 'draft' | 'published';
  training_providerId: string;
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
  venue: string;
  city?: string;
  singleOccupancyFee?: number;
  twinSharingFee?: number;
  nonResidentialFee?: number;
  brochureUrl?: string;
  minParticipants?: number;
  maxParticipants?: number;
  status: string;
  training_providerId: string | { _id: string; username: string; description?: string };
  providerName?: string;
}

// ─── Stay Type Key ────────────────────────────────────────────────────────────
export type StayTypeKey = 'single_occupancy' | 'twin_sharing' | 'non_residential';

// ─── Travel & Stay ────────────────────────────────────────────────────────────
export interface BookingRow {
    from: string;
    to: string;
    refNo: string;
    departureTime: string;
    travelDate: string;
    travelClass: string;
}

export interface TravelDetailsFormProps {
    placeOfTour: string;
    setPlaceOfTour: (val: string) => void;
    frequentFlyerNo: string;
    setFrequentFlyerNo: (val: string) => void;
    modeOfTravel: string;
    setModeOfTravel: (val: string) => void;
    purpose: string;
    setPurpose: (val: string) => void;
    bookingDetails: BookingRow[];
    addBookingRow: () => void;
    removeBookingRow: (index: number) => void;
    updateBookingField: (index: number, field: keyof BookingRow, value: string) => void;
    advancePaymentRequired: number;
    setAdvancePaymentRequired: (val: number) => void;
    validationError: string | null;
    submitting: boolean;
    onBack: () => void;
    onSubmit: () => void;
}