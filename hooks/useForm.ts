'use client';

import { useState, useCallback } from 'react';
import { ValidationResult } from '@/utils/validators';

interface UseFormOptions<T> {
  initialValues: T;
  validate: (values: T) => ValidationResult;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  formError: string;
  loading: boolean;
  handleChange: (field: keyof T) => (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFormError: (error: string) => void;
}

/**
 * Reusable form hook for managing form state, validation, and submission
 * Extracts common form logic from components
 */
export function useForm<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (field: keyof T) => (value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');

      // Validate form
      const validation = validate(values);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Clear errors and submit
      setErrors({});
      setLoading(true);

      try {
        await onSubmit(values);
      } finally {
        setLoading(false);
      }
    },
    [values, validate, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setFormError('');
    setLoading(false);
  }, [initialValues]);

  return {
    values,
    errors,
    formError,
    loading,
    handleChange,
    handleSubmit,
    resetForm,
    setFormError,
  };
}
