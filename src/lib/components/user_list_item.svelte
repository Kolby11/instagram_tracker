<script lang="ts">
	import { type IgUser } from '$lib/instagram_models';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';

	type UserListItem = { user: IgUser } & HTMLLiAttributes;
	const { user, ...props }: UserListItem = $props();
</script>

<li class="flex items-center justify-start gap-x-1" {...props}>
	<p>{user.username}</p>
	{#if user.is_verified}
		<img src={chrome.runtime.getURL('img/verified.svg')} alt="Verified" />
	{/if}
</li>
