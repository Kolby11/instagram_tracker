<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Button from './button.svelte';
	import { exportFile } from '$lib/utils/export';
	import { userDataStore } from '$lib/stores/userDataStore';

	type ButtonProps = HTMLButtonAttributes;

	let loading: boolean = false;

	let props: ButtonProps = $props();

	function onClick() {
		if (
			!$userDataStore.userId ||
			!$userDataStore?.profile?.username ||
			!$userDataStore.followers ||
			!$userDataStore.following ||
			loading
		)
			return;

		exportFile($userDataStore);
	}
</script>

<Button {...props} onclick={onClick} variant="primary">
	{@render props.children?.()}
</Button>
