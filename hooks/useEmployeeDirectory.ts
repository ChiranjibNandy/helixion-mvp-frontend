'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEmployeeDirectoryAPI } from '@/services/adminService';

interface Person {
  name: string;
  email: string;
}

export interface DirectoryEmployee {
  id: string;
  name: string;
  email: string;
  employeeCode: string | null;
  department: string | null;
  designation: string | null;
  placeOfPosting: string | null;
  role: string;
  status: string;
  reportingManager: Person | null;
  skipLevel1Manager: Person | null;
  skipLevel2Manager: Person | null;
}

export interface DirectoryApprover {
  name: string;
  email: string;
  role: string;
}

export function useEmployeeDirectory() {
  const [employees, setEmployees] = useState<DirectoryEmployee[]>([]);
  const [approvers, setApprovers] = useState<{ trainingDept: DirectoryApprover[]; osd: DirectoryApprover[] }>({
    trainingDept: [],
    osd: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEmployeeDirectoryAPI();
      const body = res.data;
      setEmployees(body.employees || []);
      setApprovers(body.approvers || { trainingDept: [], osd: [] });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load directory');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { employees, approvers, loading, error, refresh: fetch };
}
