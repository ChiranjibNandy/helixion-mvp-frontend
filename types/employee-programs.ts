import type { AvailableProgram, StayTypeKey } from '@/types';

export interface StayOption {
  key: StayTypeKey;
  label: string;
  fee: number;
}

export interface Filters {
  title: string;
  venue: string;
  fromDate: string;
  toDate: string;
}

export interface DetailPanelProps {
  program: AvailableProgram;
  onEnrol: (stayType: StayTypeKey) => void;
  enrolling: boolean;
  enrolled: boolean;
  error: string | null;
}
