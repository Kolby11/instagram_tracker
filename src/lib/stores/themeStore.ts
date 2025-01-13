import { writable, type Writable } from "svelte/store";

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export const themeStore: Writable<Theme> = writable(Theme.LIGHT);

export function initializeTheme(): void {
  let theme: Theme = Theme.LIGHT;
  if (typeof window !== 'undefined') {
    theme = getSystemTheme();
  }
  applyTheme(theme);
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return Theme.LIGHT;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
}

function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setTheme(theme: Theme): void {
  const isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;

  if (isChromeExtension) {
    chrome.runtime.sendMessage({ type: 'setTheme', theme }, (response) => {
      if (response?.success) {
        themeStore.set(theme);
        applyTheme(theme);
      } else {
        console.error('Failed to save theme:', response?.error);
      }
    });
  } else {
    themeStore.set(theme);
    applyTheme(theme);
  }
}

export function toggleTheme(): void {
  themeStore.update(currentTheme => {
    const newTheme: Theme = currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    setTheme(newTheme);
    return newTheme;
  });
}