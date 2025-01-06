<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Button from './button.svelte';
	import { onMount } from 'svelte';
	import { importFile } from '$lib/utils/import';

	type ButtonProps = HTMLButtonAttributes;

	let props: ButtonProps = $props();

	let inputRef: HTMLInputElement;

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files?.length) return;

		const file = target.files[0];
		try {
			const parsedData = await importFile(file);
			console.log('Parsed Data:', parsedData);
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

<Button {...props} onclick={triggerFilePicker}>
	{@render props.children?.()}

	<input type="file" accept=".json" style="display: none" bind:this={inputRef} onchange={handleFileChange} />
</Button>
