import { useCallback, useRef } from "react";

/**
 * Custom hook for debouncing function calls
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function useDebounce<T extends (value: string) => void>(
  callback: T,
  delay: number
): (value: string) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [callback, delay]
  );
}
