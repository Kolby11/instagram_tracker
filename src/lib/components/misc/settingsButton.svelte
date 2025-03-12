<script lang="ts">
	import { settingsOpen } from '$lib/stores/appSettingsStore';
	import { getTranslation } from '$lib/utils/i18n';
	import IcSharpSettings from '~icons/ic/sharp-settings';

	const props = $props();
</script>

<button onclick={() => ($settingsOpen = !$settingsOpen)} {...props} title={getTranslation('settings', 'Settings')}>
	<IcSharpSettings class="size-6" aria-label={getTranslation('settings', 'Settings')} />
</button>
