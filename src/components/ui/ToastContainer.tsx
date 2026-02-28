import React from 'react';
import Toast from './Toast';
import { useToastStore } from '../../stores/toastStore';
import '../../styles/components/toast-card.css';

export const ToastContainer: React.FC = () => {
  const { currentToast, isVisible, clearToast } = useToastStore();

  // Only render if there's a toast and it's visible
  if (!currentToast || !isVisible) {
    return null;
  }

  return (
    <div aria-label="Notifications" role="region" className="toast-container">
      <Toast key={currentToast.id} toast={currentToast} onClose={clearToast} />
    </div>
  );
};
