<script module lang="ts">
	import { appSettings } from '$lib/stores/appSettingsStore';
	import type { AppSettings } from '$lib/types/appSettingTypes';
	import IcRoundCheck from '~icons/ic/round-check';

	export type AppSettingInputCheckboxProps = {};
</script>

<script lang="ts">
	export const { key }: { key: keyof AppSettings } & AppSettingInputCheckboxProps = $props();

	const handleClick = () => {
		appSettings.update((settings) => {
			settings[key].value = !settings[key].value;
			return settings;
		});
	};
</script>

<button
	onclick={handleClick}
	class={`relative inline-block size-5 cursor-pointer select-none rounded-md border border-neutral-200 bg-neutral-100 px-2 py-1 text-neutral-900 outline-1 outline-black focus-within:outline dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:outline-white ${$appSettings[key].value ? 'bg-violet-400 dark:bg-violet-600' : 'text-neutral-500'}`}
>
	<IcRoundCheck
		class={`absolute inset-0 size-full rounded-md transition ${$appSettings[key].value ? 'opacity-100' : 'opacity-0'}`}
		style="padding: 1px;"
	/>
</button>
