import { browser } from '$app/environment';
import { DEFAULT_APP_SETTINGS } from '$lib/data';
import type { AppSettingDataTypes, AppSettings } from '$lib/types/appSettingTypes';
import { writable, type Writable } from 'svelte/store';

// Flag to prevent saving during initialization
let isInitializing = true;

export const settingsOpen: Writable<boolean> = writable(false);
export const appSettings: Writable<AppSettings> = writable(DEFAULT_APP_SETTINGS);

/**
 * Saves the current app settings to localStorage
 * @param settings The current app settings to save
 */
export const saveAppSettings = (settings: AppSettings) => {
  if (!browser || isInitializing) return;
  
  try {
    const valuesToStore: Record<string, AppSettingDataTypes> = {};
    
    for (const key in settings) {
      if (Object.prototype.hasOwnProperty.call(settings, key)) {
        valuesToStore[key] = settings[key as keyof AppSettings].value;
      }
    }
    
    localStorage.setItem('appSettings', JSON.stringify(valuesToStore));
    console.log('App settings saved successfully');
  } catch (error) {
    console.error('Failed to save app settings:', error);
  }
};

/**
 * Loads app settings from localStorage and sets up auto-save
 */
export const loadAppSettings = () => {
  if (!browser) return;
  
  isInitializing = true;
  
  try {
    const settings = structuredClone(DEFAULT_APP_SETTINGS);
    
    try {
      const storedSettingsStr = localStorage.getItem('appSettings');
      
      if (storedSettingsStr) {
        const storedSettings = JSON.parse(storedSettingsStr || '{}');
        
        Object.entries(storedSettings).forEach(([key, value]) => {
          if (settings[key as keyof AppSettings]) {
            settings[key as keyof AppSettings].value = value as AppSettingDataTypes;
          }
        });
      }
    } catch (parseError) {
      console.error('Error parsing stored settings:', parseError);
    }
    
    appSettings.set(settings);
    
    setupAutoSave();
    
    setTimeout(() => {
      isInitializing = false;
      console.log('Settings initialization complete, auto-save enabled');
    }, 100);
  } catch (error) {
    console.error('Failed to load app settings:', error);
    isInitializing = false;
  }
};

let unsubscribeAutoSave: (() => void) | null = null;

/**
 * Sets up the auto-save subscription if it doesn't exist yet
 */
function setupAutoSave() {
  if (unsubscribeAutoSave === null) {
    unsubscribeAutoSave = appSettings.subscribe(saveAppSettings);
    console.log('Auto-save subscription set up');
  }
}

/**
 * Resets all settings to their default values
 */
export const resetAppSettings = () => {
  const defaultSettings = structuredClone(DEFAULT_APP_SETTINGS);
  appSettings.set(defaultSettings);
  console.log('App settings reset to defaults');
};

// Initialize settings when this module is imported
if (browser) {
  setupAutoSave();
}