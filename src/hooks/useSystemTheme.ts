import { useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { setupSystemThemeListener } from '../utils/themeInitializer';

/**
 * Hook to sync with system theme changes
 * Only follows system changes if user has an explicit stored preference
 * that already matches the system theme (i.e., user chose to be in sync).
 * New users (no stored preference) always stay on light mode.
 */
export function useSystemTheme() {
  const { setTheme } = useSettingsStore();

  useEffect(() => {
    // Set up listener for system theme changes
    const cleanup = setupSystemThemeListener(newTheme => {
      try {
        const storedSettings = localStorage.getItem('settings-storage');
        if (!storedSettings) {
          // No stored preference = new user, don't auto-switch to dark
          return;
        }
        const parsed = JSON.parse(storedSettings);
        if (parsed.state?.theme && parsed.state.theme !== newTheme) {
          // User has a stored preference that differs from system — respect it
          return;
        }
        if (parsed.state?.theme === newTheme) {
          // Theme already matches system, keep in sync
          setTheme(newTheme);
        }
      } catch (error) {
        console.warn('Failed to check stored theme preference:', error);
        // On error, don't change theme — stay on current
      }
    });

    return cleanup;
  }, [setTheme]);
}
