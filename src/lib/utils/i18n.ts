import { browser } from '$app/environment';

export function getTranslation(variable: string, fallback: string): string {
  if (browser) {
    return chrome.i18n.getMessage(variable);
  }
  return fallback;
}