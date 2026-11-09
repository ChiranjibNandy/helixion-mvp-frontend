'use client';

import { useEffect, useState } from 'react';
import { providerService, ProgramCancellationReason } from '@/services/provider.service';
import ModalShell from './ModalShell';
import ReasonStep from './ReasonStep';
import ConfirmStep from './ConfirmStep';
import SuccessStep from './SuccessStep';
import { getReasonOptions } from './reasons';

interface CancelProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId: string;
  programTitle: string;
  activeEnrollmentCount: number;
  minParticipants?: number;
  maxParticipants?: number;
  onCancelled: () => void;
  onViewDetails?: () => void;
}

type Step = 'reason' | 'confirm' | 'success';

export default function CancelProgramModal({
  isOpen,
  onClose,
  programId,
  programTitle,
  activeEnrollmentCount,
  minParticipants,
  maxParticipants,
  onCancelled,
  onViewDetails,
}: CancelProgramModalProps) {
  const belowMinimum = minParticipants != null && activeEnrollmentCount < minParticipants;
  const reasonOptions = getReasonOptions(belowMinimum);

  const [step, setStep] = useState<Step>('reason');
  const [reason, setReason] = useState<ProgramCancellationReason>(reasonOptions[0].value);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setStep('reason');
    setReason(reasonOptions[0].value);
    setNote('');
    setError(null);
    
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return; 
    onClose();
  };

  const handleProceedToConfirm = () => {
    if (reason === 'other' && note.trim().length === 0) {
      setError('Please describe the reason for cancellation.');
      return;
    }
    setError(null);
    setStep('confirm');
  };

  const handleCancelProgram = async () => {
    setLoading(true);
    setError(null);
    try {
      await providerService.cancelProgram(programId, reason, note.trim() || undefined);
      setStep('success');
      onCancelled();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not cancel the program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalShell isOpen={isOpen} onOverlayClose={step === 'confirm' ? () => setStep('reason') : handleClose}>
      {step === 'reason' && (
        <ReasonStep
          belowMinimum={belowMinimum}
          activeEnrollmentCount={activeEnrollmentCount}
          minParticipants={minParticipants}
          maxParticipants={maxParticipants}
          reasonOptions={reasonOptions}
          reason={reason}
          note={note}
          error={error}
          onReasonChange={setReason}
          onNoteChange={setNote}
          onClose={handleClose}
          onProceed={handleProceedToConfirm}
        />
      )}
      {step === 'confirm' && (
        <ConfirmStep
          belowMinimum={belowMinimum}
          activeEnrollmentCount={activeEnrollmentCount}
          minParticipants={minParticipants}
          maxParticipants={maxParticipants}
          loading={loading}
          error={error}
          onBack={() => setStep('reason')}
          onConfirm={handleCancelProgram}
        />
      )}
      {step === 'success' && (
        <SuccessStep programTitle={programTitle} onClose={handleClose} onViewDetails={onViewDetails} />
      )}
    </ModalShell>
  );
}
