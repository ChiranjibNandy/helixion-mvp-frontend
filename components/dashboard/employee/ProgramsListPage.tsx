'use client';

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Download, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getAvailablePrograms, enrollInProgram } from '@/services/employeeService';
import type { AvailableProgram, StayTypeKey } from '@/types';


const PAGE_SIZE    = 10;
const COLUMN_COUNT = 5;


function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function toDisplayDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

function getProviderName(program: AvailableProgram): string {
  if (program.providerName) return program.providerName;
  if (typeof program.training_providerId === 'object' && program.training_providerId?.username) {
    return program.training_providerId.username;
  }
  return '—';
}

// types

interface StayOption { key: StayTypeKey; label: string; fee: number; }
interface Filters    { title: string; venue: string; fromDate: string; toDate: string; }

const EMPTY_FILTERS: Filters = { title: '', venue: '', fromDate: '', toDate: '' };

function buildStayOptions(program: AvailableProgram): StayOption[] {
  return ([
    { key: 'single_occupancy' as StayTypeKey, label: 'Single Occupancy', fee: program.singleOccupancyFee },
    { key: 'twin_sharing'     as StayTypeKey, label: 'Twin Sharing',     fee: program.twinSharingFee },
    { key: 'non_residential'  as StayTypeKey, label: 'Non-Residential',  fee: program.nonResidentialFee },
  ] as { key: StayTypeKey; label: string; fee: number | undefined }[])
    .filter((o): o is StayOption => o.fee !== undefined && o.fee !== null);
}


interface DetailPanelProps {
  program:   AvailableProgram;
  onEnrol:   (stayType: StayTypeKey) => void;
  enrolling: boolean;
  enrolled:  boolean;
  error:     string | null;
}

function DetailPanel({ program, onEnrol, enrolling, enrolled, error }: DetailPanelProps) {
  const stayOptions = buildStayOptions(program);
  const defaultKey  = stayOptions.find((o) => o.key === 'twin_sharing')?.key ?? stayOptions[0]?.key ?? 'twin_sharing';
  const [selectedStay, setSelectedStay] = useState<StayTypeKey>(defaultKey as StayTypeKey);

  return (
    <div className="bg-[#0d1527] px-6 py-5">
      <div className="flex justify-between gap-12">
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-1">Venue</p>
            <p className="text-[13px] text-white">{program.venue}</p>
          </div>
          {stayOptions.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-2">Stay Type</p>
              <div role="radiogroup" aria-label="Stay type" className="flex flex-col gap-1.5">
                {stayOptions.map((opt) => {
                  const active = selectedStay === opt.key;
                  return (
                    <div
                      key={opt.key}
                      role="radio"
                      aria-checked={active}
                      tabIndex={enrolled ? -1 : 0}
                      className="flex items-center cursor-pointer"
                      onClick={() => !enrolled && setSelectedStay(opt.key)}
                      onKeyDown={(e) => {
                        if (!enrolled && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          setSelectedStay(opt.key);
                        }
                      }}
                    >
                      <span className="w-5 flex-shrink-0 flex items-center">
                        {active && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      </span>
                      <span className={`text-[13px] flex-1 ${active ? 'font-semibold text-white' : 'font-normal text-white/55'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[13px] text-white/50 ml-10">
                        ₹{opt.fee.toLocaleString('en-IN')}/-
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-start gap-3 flex-shrink-0">
          {program.brochureUrl && (
            <a href={program.brochureUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-white/55 hover:text-white/80 transition-colors">
              <Download className="w-4 h-4" />
              Download Brochure
            </a>
          )}
          {enrolled ? (
            <span className="flex items-center gap-1.5 text-[13px] text-green-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Enrolled
            </span>
          ) : (
            <Button
              onClick={() => onEnrol(selectedStay)}
              disabled={enrolling}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] px-5 h-9 font-medium disabled:opacity-70"
            >
              {enrolling ? 'Enrolling...' : 'Enrol in Program'}
              {!enrolling && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          )}
          {error && <p className="text-[11px] text-red-400 max-w-[180px] text-right">{error}</p>}
        </div>
      </div>
    </div>
  );
}



function DateInput({ value, placeholder, onChange }: {
  value: string; placeholder: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative flex-1 min-w-[155px]">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none z-10" />
      <input
        type={focused ? 'date' : 'text'}
        placeholder={placeholder}
        value={focused ? value : toDisplayDate(value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-2 h-9 rounded-md border border-[#1e2d40] bg-[#111827] text-white/70 placeholder:text-white/30 text-[12px] outline-none focus:border-blue-500 [color-scheme:dark]"
      />
    </div>
  );
}


export function ProgramsListPage() {
  const [programs,     setPrograms]     = useState<AvailableProgram[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [draft,        setDraft]        = useState<Filters>(EMPTY_FILTERS);
  const [applied,      setApplied]      = useState<Filters>(EMPTY_FILTERS);
  const [enrollingId,  setEnrollingId]  = useState<string | null>(null);
  const [enrolledIds,  setEnrolledIds]  = useState<Set<string>>(new Set());
  const [enrollErrors, setEnrollErrors] = useState<Record<string, string>>({});

  const seqRef = useRef(0);

  const load = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    try {
      const data = await getAvailablePrograms({
        page,
        limit:    PAGE_SIZE,
        search:   applied.title    || undefined,
        venue:    applied.venue    || undefined,
        fromDate: applied.fromDate || undefined,
        toDate:   applied.toDate   || undefined,
      });
      if (seq !== seqRef.current) return;
      setPrograms(data.programs);
      setTotal(data.total);
    } catch {
      if (seq !== seqRef.current) return;
      setPrograms([]);
      setTotal(0);
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => { load(); }, [load]);

  function handleApply() {
    setPage(1);
    setApplied({ ...draft });
  }

  function handleClear() {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  }

  async function handleEnrol(programId: string, stayType: StayTypeKey) {
    setEnrollingId(programId);
    setEnrollErrors((prev) => { const next = { ...prev }; delete next[programId]; return next; });
    try {
      await enrollInProgram(programId, stayType);
      setEnrolledIds((prev) => new Set(prev).add(programId));
      setSelectedId(null);
    } catch (err: unknown) {
      const raw = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
      const msg = Array.isArray(raw) ? raw.join(', ') : (typeof raw === 'string' ? raw : 'Enrollment failed. Please try again.');
      setEnrollErrors((prev) => ({ ...prev, [programId]: msg }));
    } finally {
      setEnrollingId(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div className="flex flex-col h-full space-y-4">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white">Listed Training Programs</h1>
          <p className="text-[12px] text-white/40 mt-0.5">Select a program to view details and enroll</p>
        </div>

        <div className="relative flex-shrink-0 mt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none z-10" />
          <input
            placeholder="Search programs..."
            value={draft.title}
            onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className="pl-9 w-56 h-9 rounded-lg border border-[#1e2d40] bg-[#111827] text-white placeholder:text-white/25 text-[12px] outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#1e2d40] bg-[#0d1526] px-5 py-4">
        <div className="flex items-end gap-4 flex-wrap">

          <div className="flex-1 min-w-[160px]">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-1.5">Program Title</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none z-10" />
              <input
                placeholder="Search by title..."
                value={draft.title}
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                className="w-full pl-9 h-9 rounded-md border border-[#1e2d40] bg-[#111827] text-white placeholder:text-white/20 text-[12px] outline-none focus:border-blue-500"
              />
            </div>
          </div>


          <div className="flex-1 min-w-[160px]">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-1.5">Venue</p>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none z-10" />
              <input
                placeholder="Search by venue..."
                value={draft.venue}
                onChange={(e) => setDraft((p) => ({ ...p, venue: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                className="w-full pl-9 h-9 rounded-md border border-[#1e2d40] bg-[#111827] text-white placeholder:text-white/20 text-[12px] outline-none focus:border-blue-500"
              />
            </div>
          </div>

      
          <div className="flex-1 min-w-[360px]">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-1.5">Date Range</p>
            <div className="flex items-center gap-2">
              <DateInput
                value={draft.fromDate}
                placeholder="From"
                onChange={(v) => setDraft((p) => ({ ...p, fromDate: v }))}
              />
              <span className="text-white/25 text-[12px] flex-shrink-0">—</span>
              <DateInput
                value={draft.toDate}
                placeholder="To"
                onChange={(v) => setDraft((p) => ({ ...p, toDate: v }))}
              />
            </div>
          </div>

        
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleClear}
              className="border-[#1e2d40] text-white/50 hover:text-white bg-transparent text-[12px] h-9 px-4"
            >
              Clear Filters
            </Button>
            <Button
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-9 px-5 font-medium"
            >
              Apply
            </Button>
          </div>

        </div>
      </div>

   
      <div className="rounded-md border border-[#1e2d40] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1e2d40] hover:bg-transparent bg-[#0d1526]">
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Program Title</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-white/30">From Date</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-white/30">To Date</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Venue</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Training Provider</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} className="text-center py-12 text-white/30 text-[13px]">
                  Loading programs...
                </TableCell>
              </TableRow>
            ) : programs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} className="text-center py-12 text-white/30 text-[13px]">
                  No programs found.
                </TableCell>
              </TableRow>
            ) : (
              programs.map((prog) => {
                const isSelected = selectedId === prog._id;
                const isEnrolled = enrolledIds.has(prog._id);
                return (
                  <Fragment key={prog._id}>
                    <TableRow
                      tabIndex={0}
                      aria-expanded={isSelected}
                      className={`border-[#1e2d40] cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#0d1e33] border-l-2 border-l-blue-500' : 'hover:bg-[#111827]'
                      }`}
                      onClick={() => setSelectedId((prev) => (prev === prog._id ? null : prog._id))}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedId((prev) => (prev === prog._id ? null : prog._id))}
                    >
                      <TableCell className="font-semibold text-white text-[13px] max-w-[220px]">{prog.title}</TableCell>
                      <TableCell className="text-white/60 text-[13px]">{formatDate(prog.startDate)}</TableCell>
                      <TableCell className="text-white/60 text-[13px]">{formatDate(prog.endDate)}</TableCell>
                      <TableCell className="text-white/60 text-[13px]">{prog.venue}</TableCell>
                      <TableCell className="text-white/60 text-[13px] max-w-[180px]">{getProviderName(prog)}</TableCell>
                    </TableRow>

                    {isSelected && (
                      <TableRow className="border-[#1e2d40]">
                        <TableCell colSpan={COLUMN_COUNT} className="p-0">
                          <DetailPanel
                            program={prog}
                            onEnrol={(stayType) => handleEnrol(prog._id, stayType)}
                            enrolling={enrollingId === prog._id}
                            enrolled={isEnrolled}
                            error={enrollErrors[prog._id] ?? null}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-[11px] border-[#1e2d40] text-white/50 hover:text-white bg-transparent h-7 px-3">
            Previous
          </Button>
          <span className="text-[11px] text-white/30">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-[11px] border-[#1e2d40] text-white/50 hover:text-white bg-transparent h-7 px-3">
            Next
          </Button>
        </div>
      )}

    </div>
  );
}
