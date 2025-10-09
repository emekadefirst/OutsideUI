import { useEffect } from 'react';
import { useEventsStore } from '../stores';

export const useAutoRefresh = (intervalMinutes = 3) => {
  const { refreshEvents, isStale } = useEventsStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isStale()) {
        refreshEvents();
      }
    }, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshEvents, isStale, intervalMinutes]);
};