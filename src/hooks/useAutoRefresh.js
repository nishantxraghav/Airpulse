import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Runs a callback on an interval and exposes countdown + controls.
 * @param {Function} callback - Function to call on each tick
 * @param {number} intervalMs - Interval in milliseconds
 * @param {boolean} enabled - Whether the auto-refresh is active
 */
export function useAutoRefresh(callback, intervalMs, enabled = true) {
  const callbackRef = useRef(callback);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(Math.floor(intervalMs / 1000));
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Keep callback ref up to date without restarting interval
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const startTimers = useCallback(() => {
    const totalSeconds = Math.floor(intervalMs / 1000);
    setSecondsUntilRefresh(totalSeconds);

    // Main interval: fires callback
    intervalRef.current = setInterval(() => {
      callbackRef.current();
      setSecondsUntilRefresh(totalSeconds);
    }, intervalMs);

    // Countdown interval: ticks every second
    countdownRef.current = setInterval(() => {
      setSecondsUntilRefresh((prev) => Math.max(0, prev - 1));
    }, 1000);
  }, [intervalMs]);

  useEffect(() => {
    if (enabled && !isPaused) {
      startTimers();
    }
    return clearTimers;
  }, [enabled, isPaused, startTimers, clearTimers, intervalMs]);

  const refresh = useCallback(() => {
    callbackRef.current();
    clearTimers();
    if (enabled && !isPaused) startTimers();
  }, [clearTimers, startTimers, enabled, isPaused]);

  const pause = useCallback(() => {
    setIsPaused(true);
    clearTimers();
  }, [clearTimers]);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  return { secondsUntilRefresh, refresh, pause, resume, isPaused };
}
