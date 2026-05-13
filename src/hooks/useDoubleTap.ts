import { useCallback, useRef } from 'react';
import { CALENDAR_CONFIG } from '../constants/calendar';

export const useDoubleTap = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = useCallback((onDoubleTap: () => void) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      onDoubleTap();
    } else {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
      }, CALENDAR_CONFIG.DOUBLE_TAP_THRESHOLD_MS);
    }
  }, []);

  return handleTap;
};
