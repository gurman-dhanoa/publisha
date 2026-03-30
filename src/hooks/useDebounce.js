import { useState, useEffect } from "react";

/**
 * A hook that delays updating a value until after a specified delay has passed.
 * Great for search inputs to prevent excessive API calls or heavy filtering.
 * * @param {any} value - The value to debounce (usually a search string)
 * @param {number} delay - The delay in milliseconds (e.g., 500)
 * @returns {any} - The debounced value
 */
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed.
    // This is the core "debouncing" mechanism: it resets the timer on every keystroke.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
}