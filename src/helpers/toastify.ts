/* A library used to show toast messages */

import { toast } from 'react-toastify';

export function showSuccessToast(message: string): void{
    toast.success(message, {
      position: "top-right",      // Position at top-right corner
      autoClose: 5000,            // Auto close after 5 seconds
      hideProgressBar: true,      // Hide progress bar
      closeOnClick: true,         // Close on click
      pauseOnHover: true,         // Pause when hovered
      draggable: true,            // Allow dragging
      theme: "dark",              // Use dark theme for background
    });
}

export function showErrorToast(message: string): void{
    toast.error(message, {
      position: "top-right",      // Position at top-right corner
      autoClose: 5000,            // Auto close after 5 seconds
      hideProgressBar: true,      // Hide progress bar
      closeOnClick: true,         // Close on click
      pauseOnHover: true,         // Pause when hovered
      draggable: true,            // Allow dragging
      theme: "dark",              // Use dark theme for background
    });
}