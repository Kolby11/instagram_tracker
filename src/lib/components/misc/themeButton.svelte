<script lang="ts">
	import { Theme, themeStore, toggleTheme } from '../../stores/themeStore';
	import IcRoundLightMode from '~icons/ic/round-light-mode';
	import IcRoundDarkMode from '~icons/ic/round-dark-mode';
	import IcRoundComputer from '~icons/ic/round-computer';
	import { getTranslation } from '$lib/utils/i18n';

	const props = $props();
</script>

<button onclick={toggleTheme} {...props} title={getTranslation('toggleTheme', 'Toggle theme')}>
	{#if $themeStore === Theme.LIGHT}
		<IcRoundDarkMode class="size-6" aria-label={getTranslation('darkTheme', 'Dark theme')} />
	{:else if $themeStore === Theme.DARK}
		<IcRoundLightMode class="size-6" aria-label={getTranslation('lightTheme', 'Light theme')} />
	{:else}
		<IcRoundComputer class="size-6" aria-label={getTranslation('systemTheme', 'System theme')} />
	{/if}
</button>
