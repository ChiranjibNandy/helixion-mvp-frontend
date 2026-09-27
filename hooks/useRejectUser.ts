'use client';

import { useState } from 'react';
import { rejectUserAPI } from '@/services/adminService';
import { parseApiError } from '@/utils/parseError';

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
            const parsed = parseApiError(err);
            setError(parsed.message);
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