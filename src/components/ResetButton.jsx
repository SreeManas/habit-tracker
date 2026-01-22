import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { resetAllUserData } from '../services/resetService';

export const ResetButton = () => {
  const { user } = useAuth();
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [resetting, setResetting] = useState(false);

  const confirmationMessages = [
    {
      title: '⚠️ First Warning',
      message: 'Are you absolutely sure you want to reset everything? This will delete ALL your habits, daily logs, XP, levels, and stats.',
      buttonText: 'Yes, I want to reset',
      buttonColor: 'var(--warning)'
    },
    {
      title: '⚠️⚠️ Second Warning',
      message: 'This action CANNOT be undone. All your progress, habits, streaks, and data will be permanently deleted.',
      buttonText: 'Yes, delete everything',
      buttonColor: 'var(--danger)'
    },
    {
      title: '⚠️⚠️⚠️ Final Warning',
      message: 'LAST CHANCE! Clicking confirm will permanently delete ALL your data. There is no way to recover it.',
      buttonText: 'CONFIRM RESET - DELETE EVERYTHING',
      buttonColor: 'var(--danger)'
    }
  ];

  const handleResetClick = () => {
    if (confirmationStep < confirmationMessages.length - 1) {
      setConfirmationStep(confirmationStep + 1);
    } else {
      // Final confirmation - proceed with reset
      performReset();
    }
  };

  const handleCancel = () => {
    setConfirmationStep(0);
  };

  const performReset = async () => {
    if (!user) return;

    setResetting(true);
    try {
      await resetAllUserData(user.uid);
      alert('All data has been reset successfully. The page will reload.');
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error resetting data:', error);
      alert('Error resetting data. Please try again or check the console for details.');
      setResetting(false);
      setConfirmationStep(0);
    }
  };

  if (confirmationStep === 0) {
    return (
      <div className="reset-section">
        <h3>Danger Zone</h3>
        <p className="reset-description">
          Reset all your data including habits, daily logs, XP, levels, and stats.
          This action requires 3 confirmations and cannot be undone.
        </p>
        <button
          className="btn-reset"
          onClick={handleResetClick}
          disabled={resetting}
        >
          {resetting ? 'Resetting...' : 'Reset Everything'}
        </button>
      </div>
    );
  }

  const currentConfirmation = confirmationMessages[confirmationStep - 1];

  return (
    <div className="reset-confirmation-overlay">
      <div className="reset-confirmation-modal">
        <h2>{currentConfirmation.title}</h2>
        <p className="reset-confirmation-message">
          {currentConfirmation.message}
        </p>
        <div className="reset-confirmation-steps">
          <span>Confirmation {confirmationStep} of {confirmationMessages.length}</span>
        </div>
        <div className="reset-confirmation-actions">
          <button
            className="btn-confirm-reset"
            onClick={handleResetClick}
            disabled={resetting}
            style={{ backgroundColor: currentConfirmation.buttonColor }}
          >
            {resetting ? 'Resetting...' : currentConfirmation.buttonText}
          </button>
          <button
            className="btn-cancel-reset"
            onClick={handleCancel}
            disabled={resetting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
