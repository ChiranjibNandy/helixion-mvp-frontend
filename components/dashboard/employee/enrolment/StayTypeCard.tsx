"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StayTypeCardProps {
    label: string;
    fee: number | null;
    selected: boolean;
    onSelect: () => void;
}

export function StayTypeCard({ label, fee, selected, onSelect }: StayTypeCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "flex items-center gap-3 rounded-xl border p-4 transition-all text-left",
                selected
                    ? "border-primary bg-primary/10"
                    : "border-borderCard bg-bgStatCard hover:border-white/20"
            )}
        >
            <div
                className={cn(
                    "size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                    selected ? "border-primary" : "border-textSidebarMuted"
                )}
            >
                {selected && <div className="size-2.5 rounded-full bg-primary" />}
            </div>
            <span
                className={cn(
                    "text-sm font-medium flex-1",
                    selected ? "text-white" : "text-textSidebarMuted"
                )}
            >
                {label}
            </span>
            <span
                className={cn(
                    "text-sm font-semibold whitespace-nowrap",
                    selected ? "text-white" : "text-textSidebarMuted"
                )}
            >
                {fee != null ? `₹${fee.toLocaleString()}/-` : "N/A"}
            </span>
        </button>
    );
}
