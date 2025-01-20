<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Button from './button.svelte';
	import { onMount } from 'svelte';
	import { importFile } from '$lib/utils/import';
	import IcRoundFileUpload from '~icons/ic/round-file-upload';
	import { importDataIntoUserStore, userDataStore } from '$lib/stores/userDataStore';

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
	class="border-2 border-dashed border-gray-300 bg-transparent dark:text-neutral-100 dark:hover:bg-neutral-200"
>
	<div class="flex items-center justify-center gap-2">
		<IcRoundFileUpload aria-label="Import data" class="size-4 sm:size-6" />
		<p>Import data</p>
	</div>

	<input type="file" accept=".json,.yml,.yaml" style="display: none" bind:this={inputRef} onchange={handleFileChange} />
</Button>
