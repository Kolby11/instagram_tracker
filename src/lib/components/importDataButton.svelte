<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Button from './button.svelte';
	import { onMount } from 'svelte';
	import { importFile } from '$lib/utils/import';
	import IcRoundFileUpload from '~icons/ic/round-file-upload';
	import { importDataIntoUserStore, userDataStore } from '$lib/stores/userDataStore';
	import { getTranslation } from '$lib/utils/i18n';

	type ButtonProps = HTMLButtonAttributes;

	let props: ButtonProps = $props();

	let inputRef: HTMLInputElement;

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files?.length) return;

		const file = target.files[0];
		try {
			const parsedData = await importFile(file);
			if (!parsedData) {
				console.error('Error parsing file:', file);
				return;
			}
			importDataIntoUserStore(userDataStore, parsedData);
		} catch (error) {
			console.error('Error importing file:', error);
		}
	}

	function triggerFilePicker() {
		inputRef.click();
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		window.addEventListener('dragover', (event) => {
			event.preventDefault();
		});

		window.addEventListener('drop', (event) => {
			event.preventDefault();

			const dt = event.dataTransfer;
			if (!dt?.files?.length) return;

			const file = dt.files[0];
			importFile(file);
		});
	});
</script>

<Button
	{...props}
	onclick={triggerFilePicker}
	class="border-2 border-dashed border-gray-600 bg-transparent text-gray-600 hover:border-gray-700 hover:bg-transparent hover:text-gray-700 dark:border-neutral-300 dark:text-neutral-200 dark:hover:border-neutral-400"
>
	<div class="flex items-center justify-center gap-2">
		<IcRoundFileUpload aria-label={getTranslation('importData', 'Import data')} class="size-4 text-gray-600 dark:text-neutral-200 sm:size-6" />
		<p>{getTranslation('importData', 'Import data')}</p>
	</div>

	<input type="file" accept=".json,.yml,.yaml" style="display: none" bind:this={inputRef} onchange={handleFileChange} />
</Button>
