/* A library used to show toast messages */

import { toast, Toaster } from 'react-hot-toast';

export function showSuccessToast(message: string): void {
  toast.success(message, {
    position: 'top-right',      // Position at top-right corner
    duration: 5000,            // Auto close after 5 seconds
    style: {
      backgroundColor: '#2f343a', // Dark theme background
      color: '#ffffff', // Dark theme text color
    },
  });
}

export function showErrorToast(message: string): void {
  toast.error(message, {
    position: 'top-right',      // Position at top-right corner
    duration: 5000,            // Auto close after 5 seconds
    style: {
      backgroundColor: '#2f343a', // Dark theme background
      color: '#ffffff', // Dark theme text color
    },
  });
}

export { Toaster };