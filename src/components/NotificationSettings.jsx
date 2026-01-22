import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationSettings = () => {
  const {
    permission,
    notificationSettings,
    loading,
    enableNotifications,
    disableNotifications,
    updateNotificationSettings
  } = useNotifications();

  const [localSettings, setLocalSettings] = useState(notificationSettings);
  const [saving, setSaving] = useState(false);

  const handleTimeChange = (index, newTime) => {
    const newTimes = [...localSettings.reminderTimes];
    newTimes[index] = newTime;
    setLocalSettings({ ...localSettings, reminderTimes: newTimes });
  };

  const addReminderTime = () => {
    setLocalSettings({
      ...localSettings,
      reminderTimes: [...localSettings.reminderTimes, '12:00']
    });
  };

  const removeReminderTime = (index) => {
    const newTimes = localSettings.reminderTimes.filter((_, i) => i !== index);
    setLocalSettings({ ...localSettings, reminderTimes: newTimes });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNotificationSettings(localSettings);
      alert('Notification settings saved!');
    } catch (error) {
      alert('Error saving settings. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="notification-settings">
      <h2>Notification Settings</h2>

      {permission === 'unsupported' && (
        <div className="alert alert-warning">
          Your browser does not support notifications.
        </div>
      )}

      {permission === 'denied' && (
        <div className="alert alert-error">
          Notifications are blocked. Please enable them in your browser settings.
        </div>
      )}

      {permission === 'default' && (
        <div className="alert alert-info">
          <p>Enable notifications to get reminders about your habits.</p>
          <button className="btn-primary" onClick={enableNotifications}>
            Enable Notifications
          </button>
        </div>
      )}

      {permission === 'granted' && (
        <>
          <div className="settings-section">
            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={localSettings.dailyReminders}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, dailyReminders: e.target.checked })
                  }
                />
                <span>Daily Reminders</span>
              </label>
              <p className="setting-description">
                Get reminders at scheduled times to mark your habits
              </p>
            </div>

            {localSettings.dailyReminders && (
              <div className="reminder-times">
                <h3>Reminder Times</h3>
                {localSettings.reminderTimes.map((time, index) => (
                  <div key={index} className="reminder-time-item">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                    />
                    <button
                      className="btn-delete-small"
                      onClick={() => removeReminderTime(index)}
                      disabled={localSettings.reminderTimes.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button className="btn-secondary" onClick={addReminderTime}>
                  + Add Time
                </button>
              </div>
            )}

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={localSettings.enabled}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, enabled: e.target.checked })
                  }
                />
                <span>Enable All Notifications</span>
              </label>
            </div>
          </div>

          <div className="settings-actions">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              className="btn-secondary"
              onClick={disableNotifications}
            >
              Disable Notifications
            </button>
          </div>
        </>
      )}
    </div>
  );
};
