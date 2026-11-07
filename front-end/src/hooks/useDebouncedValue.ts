"use client";
import { useEffect, useState } from "react";
/** Debounce only remote filter queries; keep text inputs responsive. */
export function useDebouncedValue<T>(value: T, delayMs = 320): T {
  const [result, setResult] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setResult(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return result;
}
