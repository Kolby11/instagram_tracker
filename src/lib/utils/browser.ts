/**
 * Gets the current username from the active tab's URL
 */
export function getUsernameFromURL(): Promise<string | undefined> {
	return new Promise((resolve) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tab = tabs[0];
			if (!tab?.url) {
				resolve(undefined);
				return;
			}

			const url = new URL(tab.url);
			const name = url.pathname.replace(/\//g, '');
			resolve(name);
		});
	});
}


/**
* Opens a new tab using the Chrome extension API.
* We only call this client-side, so we check `typeof chrome !== 'undefined'`.
*/
export function openInNewTab(url: string): void {
	if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime) {
		chrome.tabs.create({
			url: url,
			active: true
		});
	} else {
		console.warn('Chrome API not available. Are you running in a Chrome extension environment?');
	}
}