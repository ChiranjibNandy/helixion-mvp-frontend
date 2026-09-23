'use client';

import { useState } from 'react';
import { rejectUserAPI } from '@/services/adminService';

type UseRejectUserParams = {
    userId: string;
    onSuccess?: () => void;
};

export function useRejectUser({ userId, onSuccess }: UseRejectUserParams) {
    const [isOpen, setIsOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openModal = () => {
        setIsOpen(true);
        setError(null);
    };

    const closeModal = () => {
        setIsOpen(false);
        setError(null);
    };

    const closeSuccess = () => {
        setSuccessOpen(false);
        onSuccess?.();
    };

    const rejectUser = async () => {

        setLoading(true);
        setError(null);

        try {
            await rejectUserAPI({
                userId,
            });

            setIsOpen(false);
            setSuccessOpen(true);
        } catch (err: any) {
            //  Zod validation error
            if (err?.errors && Array.isArray(err.errors)) {
                setError(err.errors[0]?.message);
                return;
            }

            // API response error
            if (Array.isArray(err?.response?.data)) {
                setError(err.response.data[0]?.message);
                return;
            }

            // backend string message
            if (typeof err?.response?.data?.message === 'string') {
                setError(err.response.data.message);
                return;
            }

            // fallback
            setError(err?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return {
        isOpen,
        successOpen,
        loading,
        error,
        openModal,
        closeModal,
        rejectUser,
        closeSuccess,
    };
}