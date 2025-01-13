<script lang="ts">
	import { Theme, themeStore, toggleTheme } from '../../stores/themeStore';
	import IcRoundLightMode from '~icons/ic/round-light-mode';
	import IcRoundDarkMode from '~icons/ic/round-dark-mode';
	import IcRoundComputer from '~icons/ic/round-computer';

	const props = $props();
</script>

<button onclick={toggleTheme} {...props} title="Toggle theme">
	{#if $themeStore === Theme.LIGHT}
		<IcRoundDarkMode class="size-6" aria-label="Dark theme" />
	{:else if $themeStore === Theme.DARK}
		<IcRoundLightMode class="size-6" aria-label="Light theme" />
	{:else}
		<IcRoundComputer class="size-6" />
	{/if}
</button>
