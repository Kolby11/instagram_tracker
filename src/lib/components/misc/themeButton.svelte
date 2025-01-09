<script lang="ts">
	import { themeStore, toggleTheme } from '../stores/themeStore';
	import Icon from '@iconify/svelte';
	import IcRoundLightMode from '~icons/ic/round-light-mode';
	import IcRoundDarkMode from '~icons/ic/round-dark-mode';
	import IcRoundComputer from '~icons/ic/round-computer';

	const props = $props();
</script>

<button onclick={toggleTheme} {...props} title="Toggle theme">
	{#if $themeStore === 'light'}
		<IcRoundDarkMode class="size-6" aria-label="Dark theme" />
	{:else if $themeStore === 'dark'}
		<IcRoundLightMode class="size-6" aria-label="Light theme" />
	{:else}
		<IcRoundComputer class="size-6" />
	{/if}
</button>
