<script lang="ts">
	import { type UserProfile } from '$lib/instagram_models';

	let { userProfile }: { userProfile: UserProfile | undefined } = $props();

	// Track the loaded image URL separately
	let loadedImageUrl = $state('');

	$effect(() => {
		if (userProfile?.profile_pic_url) {
			// Create a proper Promise wrapper around the message
			const fetchImage = () =>
				new Promise((resolve, reject) => {
					try {
						chrome.runtime.sendMessage({ action: 'FETCH_IMAGE', url: userProfile.profile_pic_url }, (response) => {
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

<div class="mt-4 flex flex-col items-center">
	{#if userProfile}
		<img src={loadedImageUrl || userProfile.profile_pic_url} alt="Profile Picture" class="size-16 rounded-full" />
		<div class="flex flex-col items-center">
			<h2 class="mt-2 text-xl">{userProfile.full_name}</h2>
			<p>@{userProfile.username}</p>
			<div class="mt-2 flex gap-4">
				<p><strong>{userProfile.follower_count}</strong> Followers</p>
				<p><strong>{userProfile.following_count}</strong> Following</p>
			</div>
		</div>
	{:else}
		<p class="animate-pulse text-lg">Loading...</p>
	{/if}
</div>
