'use client';

import { t } from "@/lib/i18n";

interface Props {
    name: string;
    email: string;
}

export function RejectModalContent({
    name,
    email,
}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-white/5 border border-white/8 px-4 py-3">
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="text-xs text-white/40 mt-0.5">{email}</p>
            </div>
            <p>{t("admin.rejectUser.warning")}</p>
        </div>
    );
}