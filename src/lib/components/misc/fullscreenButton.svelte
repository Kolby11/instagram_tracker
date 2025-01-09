<script lang="ts">
	import { userState } from '$lib/states/user_state.svelte';
	import { openInNewTab } from '$lib/utils/browser';
	import IcRoundFullscreen from '~icons/ic/round-fullscreen';

	const props = $props();

	function fullscreenButtonClick() {
		openInNewTab(`${chrome.runtime.getURL('index.html')}?username=${userState.username}`);
	}
</script>

<button onclick={fullscreenButtonClick} {...props} title="Open in new tab">
	<IcRoundFullscreen aria-label="Fullscreen" class="size-6" />
</button>
