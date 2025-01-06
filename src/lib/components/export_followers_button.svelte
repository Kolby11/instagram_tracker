<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Button from './button.svelte';
	import { exportFile } from '$lib/utils/export';
	import { userState } from '$lib/states/user_state.svelte';

	type ButtonProps = HTMLButtonAttributes;

	let loading: boolean = false;

	let props: ButtonProps = $props();

	function onClick() {
		if (!userState.userId || !userState.username || !userState.followers || !userState.following || loading) return;

		exportFile(userState.userId, userState.username, userState.followers, userState.following);
	}
</script>

<Button {...props} onclick={onClick} variant="primary">
	{@render props.children?.()}
</Button>
