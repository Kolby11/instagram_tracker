<script lang="ts">
	import { userDataStore } from '$lib/stores/userDataStore';
	import { openInNewTab } from '$lib/utils/browser';
	import { getTranslation } from '$lib/utils/i18n';
	import IcRoundFullscreen from '~icons/ic/round-fullscreen';

	const props = $props();

	function fullscreenButtonClick() {
		openInNewTab(`${chrome.runtime.getURL('index.html')}?username=${$userDataStore.profile?.username}`);
	}
</script>

<button onclick={fullscreenButtonClick} {...props} title={getTranslation('fullscreenButtonTitle', 'Open in new tab')}>
	<IcRoundFullscreen class="size-6" aria-label={getTranslation('fullscreenButtonImageLabel', 'Fullscreen')} />
</button>
