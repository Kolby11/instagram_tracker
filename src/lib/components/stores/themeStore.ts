import { writable, type Writable } from 'svelte/store';

type Theme = 'light' | 'dark';

export const themeStore: Writable<Theme | undefined> = writable<Theme | undefined>();

export function initializeTheme(): void {
  let theme: Theme = 'light';
  if (typeof window !== 'undefined') {
    theme = getSystemTheme();
  }
  applyTheme(theme);
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    return newTheme;
  });
}