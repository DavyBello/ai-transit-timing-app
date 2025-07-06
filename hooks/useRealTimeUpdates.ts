'use client';

import { useEffect, useRef, useCallback } from 'react';
import { differenceInMinutes } from 'date-fns';

interface UseRealTimeUpdatesProps {
  enabled: boolean;
  onUpdate: () => void;
  nextDepartureTime?: Date;
  baseInterval?: number; // Base interval in seconds
}

export function useRealTimeUpdates({
  enabled,
  onUpdate,
  nextDepartureTime,
  baseInterval = 60, // Default: 60 seconds
}: UseRealTimeUpdatesProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(enabled);

  // Calculate dynamic interval based on next departure time
  const calculateInterval = useCallback(() => {
    if (!nextDepartureTime) {
      return baseInterval * 1000; // Convert to milliseconds
    }

    const minutesUntilDeparture = differenceInMinutes(nextDepartureTime, new Date());

    // More frequent updates as departure approaches
    if (minutesUntilDeparture <= 5) {
      return 30 * 1000; // 30 seconds
    } else if (minutesUntilDeparture <= 15) {
      return 45 * 1000; // 45 seconds
    } else if (minutesUntilDeparture <= 30) {
      return 60 * 1000; // 1 minute
    } else {
      return 120 * 1000; // 2 minutes
    }
  }, [nextDepartureTime, baseInterval]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!isActiveRef.current) {
      return;
    }

    const interval = calculateInterval();
    
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        try {
          onUpdate();
        } catch (error) {
          console.error('Error during real-time update:', error);
        }
      }
    }, interval);
  }, [calculateInterval, onUpdate]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Update active state and restart polling when enabled changes
  useEffect(() => {
    isActiveRef.current = enabled;

    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [enabled, startPolling, stopPolling]);

  // Restart polling when next departure time changes (interval might change)
  useEffect(() => {
    if (enabled) {
      startPolling();
    }
  }, [nextDepartureTime, enabled, startPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    startPolling,
    stopPolling,
    currentInterval: calculateInterval(),
  };
}