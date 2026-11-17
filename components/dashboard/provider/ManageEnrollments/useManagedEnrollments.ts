'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { providerService, ManagedEnrollment } from '@/services/provider.service';
import { DraftProgram } from '@/types';

export function useManagedEnrollments(programId: string) {
  const [program, setProgram] = useState<DraftProgram | null>(null);
  const [enrollments, setEnrollments] = useState<ManagedEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [programData, enrollmentData] = await Promise.all([
        providerService.getDraftById(programId),
        providerService.getProgramEnrollments(programId),
      ]);
      setProgram(programData);
      setEnrollments(enrollmentData);
    } catch {
      toast.error('Could not load enrollment data for this program.');
    } finally {
      setLoading(false);
    }
  }, [programId]);

  useEffect(() => {
    if (programId) reload();
  }, [programId, reload]);

  return { program, enrollments, loading, reload };
}
