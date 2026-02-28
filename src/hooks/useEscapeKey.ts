import { useEffect } from 'react';

/**
 * Custom hook to handle escape key press for closing modals
 * @param isOpen - Whether the modal/menu is currently open
 * @param onClose - Function to call when escape is pressed
 */
export const useEscapeKey = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
};
