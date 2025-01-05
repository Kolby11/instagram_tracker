<script lang="ts">
	import { type IgUser } from '$lib/instagram_models';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';

	type UserListItem = { user: IgUser } & HTMLLiAttributes;
	const { user, ...props }: UserListItem = $props();

	// Track the loaded image URL separately
	let loadedImageUrl = $state('');

	$effect(() => {
		if (user?.profile_pic_url) {
			// Create a proper Promise wrapper around the message
			const fetchImage = () =>
				new Promise((resolve, reject) => {
					try {
						chrome.runtime.sendMessage({ action: 'FETCH_IMAGE', url: user.profile_pic_url }, (response) => {
							if (chrome.runtime.lastError) {
								reject(chrome.runtime.lastError);
							} else if (response?.success) {
								resolve(response.base64Data);
							} else {
								reject(new Error(response?.error || 'Failed to fetch image'));
							}
						});
					} catch (error) {
						reject(error);
					}
				});

			// Use the promise
			fetchImage()
				.then((base64Data) => {
					loadedImageUrl = base64Data as string;
				})
				.catch((error) => {
					console.error('Error fetching image:', error);
				});
		}
	});
</script>

<li class="flex items-center justify-start gap-x-1" {...props}>
	<img src={loadedImageUrl || user.profile_pic_url} alt="Profile Picture" class="size-4 rounded-full" />
	<p>{user.username}</p>
	{#if user.is_verified}
		<img src={chrome.runtime.getURL('img/verified.svg')} alt="Verified" />
	{/if}
</li>
