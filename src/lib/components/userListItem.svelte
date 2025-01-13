<script lang="ts">
	import type { HTMLLiAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';
	import type { UserPreview } from '$lib/types/userTypes';

	type UserListItem = { user: UserPreview } & HTMLLiAttributes;
	const { user, ...props }: UserListItem = $props();

	// Track the loaded image URL separately
	let loadedImageUrl = $state('');

	$effect(() => {
		if (user?.profilePicURL) {
			// Create a proper Promise wrapper around the message
			const fetchImage = () =>
				new Promise((resolve, reject) => {
					try {
						chrome.runtime.sendMessage({ action: 'FETCH_IMAGE', url: user.profilePicURL }, (response) => {
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
	<!-- svelte-ignore a11y_img_redundant_alt -->
	<img src={loadedImageUrl || user?.profilePicURL} alt="Profile Picture" class="size-4 rounded-full sm:size-8" />
	<p>{user.username}</p>
	{#if user.isVerified}
		<img src={chrome.runtime.getURL('img/verified.svg')} alt="Verified" />
	{/if}
</li>
