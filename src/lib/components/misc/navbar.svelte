<script>
	import FullscreenButton from './fullscreenButton.svelte';
	import SettingsButton from './settingsButton.svelte';
	import ThemeButton from './themeButton.svelte';
</script>

<div class="w-full">
	<div class="flex w-full items-center justify-between bg-white px-4 py-1.5 dark:bg-neutral-700">
		<h1 class="text-center text-xl font-medium">Instagram Tracker</h1>
		<div class="flex items-center justify-center gap-2">
			<ThemeButton class="" />
			<SettingsButton />
			<FullscreenButton class="sm:hidden" />
		</div>
	</div>
</div>
