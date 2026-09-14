'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { userService, BulkUploadJob } from '@/services/userService';

const POLL_INTERVAL_MS = 2_000;
const MAX_CONSECUTIVE_FAILURES = 5;
export const isTerminal = (status: BulkUploadJob['status']) => status === 'completed' || status === 'failed';

export function useBulkUploadJobPolling(jobId: string | null) {
  const [job, setJob] = useState<BulkUploadJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(false);
  const statusRef = useRef<BulkUploadJob['status'] | null>(null);
  const inFlightRef = useRef(false);
  const requestSeqRef = useRef(0);
  const consecutiveFailuresRef = useRef(0);

  const fetchStatus = useCallback(async (id: string) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    const seq = ++requestSeqRef.current;

    try {
      const data = await userService.getBatchUploadJobStatus(id);
   
      if (!isMountedRef.current || seq !== requestSeqRef.current) return;
      consecutiveFailuresRef.current = 0;
      statusRef.current = data.status;
      setJob(data);
      setError(null);
    } catch (err: any) {
      if (!isMountedRef.current || seq !== requestSeqRef.current) return;
      console.error('Failed to fetch bulk upload job status', err);
      consecutiveFailuresRef.current += 1;

      const unrecoverable = err?.response?.status === 404 || consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES;
      if (unrecoverable) {
        statusRef.current = 'failed';
        setJob({
          jobId: id,
          status: 'failed',
          totalRows: 0,
          processedRows: 0,
          progress: 0,
          createdCount: 0,
          updatedCount: 0,
          skippedCount: 0,
          skippedEmails: [],
          error: err?.response?.status === 404
            ? 'Upload job not found.'
            : 'Lost connection while checking upload progress.',
        });
      }
      setError('Failed to check upload progress');
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      setError(null);
      statusRef.current = null;
      return;
    }

    isMountedRef.current = true;
    statusRef.current = null;
    consecutiveFailuresRef.current = 0;
    fetchStatus(jobId);

    const interval = setInterval(() => {
      if (statusRef.current && isTerminal(statusRef.current)) {
        clearInterval(interval);
        return;
      }
      fetchStatus(jobId);
    }, POLL_INTERVAL_MS);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [jobId, fetchStatus]);

  return { job, error };
}

