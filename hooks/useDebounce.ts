import { useState, useEffect } from "react";

/**
 * Delays updating a value until `delay` ms have passed without a new value.
 *
 * WHY a hook instead of inline useEffect:
 *   - The pattern was duplicated in RegistrationsTable (and would be again in
 *     any future search input). Extracting it makes the intent readable and
 *     removes the cognitive overhead of the timer plumbing from the consumer.
 *
 * @param value - The rapidly-changing value (e.g. a controlled input string).
 * @param delay - Debounce delay in milliseconds. Defaults to 300ms.
 * @returns The debounced value, stable until `delay` ms after the last change.
 *
 * @example
 * const debouncedSearch = useDebounce(search, 300);
 * // Use debouncedSearch in query keys — it only changes after the user pauses.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
