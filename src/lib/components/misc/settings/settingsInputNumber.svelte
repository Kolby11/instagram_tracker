<script module lang="ts">
	export type AppSettingInputNumberProps = {
		unit: string;
		min: number;
		max: number;
	};
</script>

<script lang="ts">
	import { appSettings } from '$lib/stores/appSettingsStore';

	import type { AppSettings } from '$lib/types/appSettingTypes';

	export const { key, unit, min, max }: { key: keyof AppSettings } & AppSettingInputNumberProps = $props();
</script>

<div
	class="flex items-center justify-center gap-x-1 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 px-2 py-1 text-neutral-900 outline-1 focus-within:outline dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
>
	<input
		bind:value={$appSettings[key].value}
		class="w-5 bg-transparent text-right outline-none"
		type="number"
		{min}
		{max}
	/>
	<!-- <span>
		<p>
			{unit}
		</p>
	</span> -->
</div>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
