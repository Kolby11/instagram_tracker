<script lang="ts">
	import { settingsOpen } from '$lib/stores/appSettingsStore';
	import IcSharpSettings from '~icons/ic/sharp-settings';

	const props = $props();
</script>

<button onclick={() => ($settingsOpen = !$settingsOpen)} {...props} title="Settings">
	<IcSharpSettings class="size-6" aria-label="Settings" />
</button>
