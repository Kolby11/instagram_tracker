<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import '../app.css';
	let { children } = $props();

	let environment: string;
	let instagramOpen: boolean = $state(false);

	// This will trigger when running as an extension
	onMount(() => {
		if (window.chrome && chrome.runtime && chrome.runtime.id) {
			environment = 'Chrome Extension';
		}

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

{#if instagramOpen}
	{@render children()}
{:else}
	<div class="container">
		<h1>Instagram must be open to use this extension</h1>
	</div>
{/if}
