"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Controlled & Simple Select Component
export const Select = ({ children, defaultValue, className, value, onValueChange }: any) => {
    const [localValue, setLocalValue] = React.useState(defaultValue);
    const activeValue = value !== undefined ? value : localValue;
    const activeSetValue = onValueChange !== undefined ? onValueChange : setLocalValue;
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { 
                        value: activeValue, 
                        setValue: (val: any) => {
                            activeSetValue(val);
                            setIsOpen(false);
                        },
                        isOpen,
                        setIsOpen
                    });
                }
                return child;
            })}
        </div>
    );
};

export const SelectTrigger = ({ children, className, value, isOpen, setIsOpen }: any) => (
    <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn("flex h-10 w-full items-center justify-between rounded-lg border border-borderCard bg-bgMain px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer select-none", className)}
    >
        <span className="capitalize">{value || children}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
);

export const SelectContent = ({ children, isOpen, setValue }: any) => isOpen ? (
    <div className="absolute left-0 right-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-borderCard bg-bgStatCard text-white shadow-md animate-in fade-in-80">
        {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, { setValue });
            }
            return child;
        })}
    </div>
) : null;

export const SelectItem = ({ children, value, setValue }: any) => (
    <div
        className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-4 text-sm outline-none hover:bg-white/10"
        onClick={() => setValue(value)}
    >
        {children}
    </div>
);

export const SelectValue = ({ placeholder, value }: any) => (
    <span className="block truncate capitalize">{value || placeholder}</span>
);

// Controlled RadioGroup Component
export const RadioGroup = ({ children, defaultValue, className, value, onValueChange }: any) => {
    const [localValue, setLocalValue] = React.useState(defaultValue);
    const activeValue = value !== undefined ? value : localValue;
    const activeSetValue = onValueChange !== undefined ? onValueChange : setLocalValue;
    return (
        <div className={cn("grid gap-2", className)}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { selectedValue: activeValue, setValue: activeSetValue });
                }
                return child;
            })}
        </div>
    );
};

export const RadioGroupItem = ({ value, id, selectedValue, setValue, className }: any) => (
    <div
        data-state={selectedValue === value ? "checked" : "unchecked"}
        className={cn(
            "aspect-square h-4 w-4 rounded-full border border-borderCard flex items-center justify-center cursor-pointer",
            selectedValue === value ? "border-primary" : "",
            className
        )}
        onClick={() => setValue(value)}
        id={id}
    >
        {selectedValue === value && <div className="h-2 w-2 rounded-full bg-primary" />}
    </div>
);
