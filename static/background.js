// background.js

// Image fetcher
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'FETCH_IMAGE') {
		fetch(request.url)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.blob();
			})
			.then((blob) => {
				return new Promise((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						resolve(reader.result);
					};
					reader.readAsDataURL(blob);
				});
			})
			.then((base64Data) => {
				sendResponse({ success: true, base64Data });
			})
			.catch((error) => {
				sendResponse({ success: false, error: error.message });
			});

		return true;
	}
});

const Theme = {
	LIGHT: 'light',
	DARK: 'dark'
};

// Theme setter and getter
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'setTheme') {
		chrome.storage.sync
			.set({ theme: message.theme })
			.then(() => {
				sendResponse({ success: true });
				return false;
			})
			.catch((error) => {
				sendResponse({ success: false, error: error.message });
				return false;
			});
		return true;
	}

	if (message.type === 'getTheme') {
		chrome.storage.sync.get(['theme']).then(({ theme }) => {
			sendResponse({ theme: theme });
			return false;
		});
		return true;
	}
});
