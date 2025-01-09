<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import '../app.css';
	import { initializeTheme, setTheme } from '$lib/components/stores/themeStore';

	let { children } = $props();
	let environment: string;
	let instagramOpen: boolean = $state(false);

	onMount(() => {
		// Initialize theme
		if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
			console.log('Checking theme');
			chrome.runtime.sendMessage({ type: 'getTheme' }, (response) => {
				console.log('Got theme:', response.theme);
				setTheme(response.theme);
			});
		} else {
			initializeTheme();
		}

		// Check if running as extension
		if (window.chrome && chrome.runtime && chrome.runtime.id) {
			environment = 'Chrome Extension';
		}

		// Check if Instagram is open
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			let tab = tabs[0];
			if (!tab || !tab.url) {
				return;
			}
			let url = new URL(tab.url);
			if (url.hostname === 'www.instagram.com') {
				instagramOpen = true;
			}
		});
	});
</script>

{@render children()}
