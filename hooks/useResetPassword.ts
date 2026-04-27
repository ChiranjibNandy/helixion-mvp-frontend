'use client';

import { useState } from 'react';
import { resetPasswordAPI } from '@/utils/authService';

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetPassword = async (data: {
    userId: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    setError('');

    try {
      await resetPasswordAPI(data);
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Something went wrong'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    loading,
    error,
  };
};