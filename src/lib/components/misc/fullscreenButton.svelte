<script lang="ts">
	import { userDataStore } from '$lib/stores/userDataStore';
	import { openInNewTab } from '$lib/utils/browser';
	import IcRoundFullscreen from '~icons/ic/round-fullscreen';

	const props = $props();

	function fullscreenButtonClick() {
		openInNewTab(`${chrome.runtime.getURL('index.html')}?username=${$userDataStore.profile?.username}`);
	}
</script>

<button onclick={fullscreenButtonClick} {...props} title="Open in new tab">
	<IcRoundFullscreen aria-label="Fullscreen" class="size-6" />
</button>
