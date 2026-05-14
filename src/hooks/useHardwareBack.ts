import { useEffect } from 'react';
import Swal from 'sweetalert2';

/**
 * Hook to handle hardware back button on Android and PWA standalone mode.
 * It uses the History API "dummy state" trick to intercept back button presses.
 * 
 * Simplified Version: Always asks for exit confirmation.
 */
export const useHardwareBack = () => {
  useEffect(() => {
    // 1. Initial push of the dummy state to intercept the next back press
    window.history.pushState({ noBack: true }, "");

    const onPopState = async () => {
      // Show exit confirmation regardless of app state
      const result = await Swal.fire({
        title: 'Exit App?',
        text: 'Are you sure you want to close the application?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Exit',
        cancelButtonText: 'No, Stay',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#475569',
        backdrop: `rgba(0,0,0,0.8)`
      });

      if (result.isConfirmed) {
        // Go back past our dummy state to exit
        window.history.go(-1);
      } else {
        // Re-push the dummy state to keep intercepting back buttons
        window.history.pushState({ noBack: true }, "");
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []); // Only run on mount
};
