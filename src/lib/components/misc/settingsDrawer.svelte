<script lang="ts">
	import { appSettings, settingsOpen } from '$lib/stores/appSettingsStore';
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import IcRoundClose from '~icons/ic/round-close';
	import SettingsInputCheckbox from './settings/settingsInputCheckbox.svelte';
	import SettingsInputNumber from './settings/settingsInputNumber.svelte';
	import { AppSettingInputTypes, type AppSettings } from '$lib/types/appSettingTypes';

	const props: HTMLAttributes<HTMLDivElement> = $props();
	let component = $state<HTMLDivElement | null>(null);

	onMount(() => {
		settingsOpen.subscribe((value) => {
			if (!component) return;
			if (value) {
				component.focus();
				component.classList.remove('hidden');

				setTimeout(() => {
					if (!component) return;
					component.classList.remove('translate-x-full');
					component.classList.add('translate-x-0');
				}, 1);
			} else {
				component.classList.remove('translate-x-0');
				component.classList.add('translate-x-full');
				setTimeout(() => {
					if (!component) return;
					component.classList.add('hidden');
				}, 300);
			}
		});
		console.log({ $appSettings });
	});
</script>

<div
	bind:this={component}
	{...props}
	class={`${
		props.class || ''
	} h-fit min-h-40 w-full max-w-72 rounded-l-xl border-y border-l bg-neutral-100 p-2 transition dark:border-neutral-600 dark:bg-neutral-700 sm:max-w-96`}
>
	<div>
		<div class="flex justify-between px-2">
			<h3 class="text-lg font-medium">Settings</h3>
			<button disabled={!$settingsOpen} onclick={() => ($settingsOpen = false)}>
				<IcRoundClose class="size-6" aria-label="Close settings" />
			</button>
		</div>
		<div class="mt-2">
			{#each Object.entries($appSettings) as [key, setting]}
				<div
					class="flex w-full items-center justify-between border-b border-neutral-300 px-4 py-2 dark:border-neutral-600"
				>
					<p>{setting.title}</p>

					{#if setting.componentType === AppSettingInputTypes.CHECKBOX}
						<SettingsInputCheckbox {...{ key: key as keyof AppSettings, ...setting.componentProps }} />
					{:else if setting.componentType === AppSettingInputTypes.NUMBER}
						<SettingsInputNumber {...{ key: key as keyof AppSettings, ...setting.componentProps }} />
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
