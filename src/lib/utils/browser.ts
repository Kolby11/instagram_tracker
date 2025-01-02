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
			// Example: if URL is https://instagram.com/johndoe/,
			// pathname is "/johndoe/", so remove `/`
			const name = url.pathname.replace(/\//g, '');
			resolve(name);
		});
	});
}
