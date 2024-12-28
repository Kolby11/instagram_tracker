<script lang="ts">
	import { onMount } from 'svelte';
	import { getFollowers, getFollowing, getUserId, getNotFollowingBack } from '$lib/utils/instagram_api';
	import type { UserPreview } from '$lib/models';

	let username: string = '';
	let userId: number | undefined;
	let currentTab: chrome.tabs.Tab | undefined;

	// This will hold the list of users who don't follow you back
	let notFollowingMeBack: UserPreview[] = [];

	onMount(async () => {
		// Initialize on mount
		username = (await getUsernameFromURL()) ?? '';
		if (username) {
			userId = await getUserId(username);
			await updateNotFollowingMeBack();
		}

		// Find the active tab
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			currentTab = tabs[0];
		});

		// Listen for changes to the active tab's URL
		// chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
		// 	if (tab.id === currentTab?.id && changeInfo.url) {
		// 		console.log('URL changed to:', changeInfo.url);
		// 		handleURLChange();
		// 	}
		// });
		handleURLChange();
	});

	/**
	 * Gets the current username from the active tab's URL
	 */
	function getUsernameFromURL(): Promise<string | undefined> {
		return new Promise((resolve) => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				const tab = tabs[0];
				if (!tab?.url) {
					resolve(undefined);
					return;
				}

				const url = new URL(tab.url);
				// Example: if URL is https://instagram.com/johndoe/,
				// pathname is "/johndoe/", so remove `/`
				const name = url.pathname.replace(/\//g, '');
				resolve(name);
			});
		});
	}

	/**
	 * Fetches the updated username & user ID,
	 * then updates the list of "not following me back"
	 */
	async function handleURLChange() {
		username = (await getUsernameFromURL()) ?? '';
		if (username) {
			userId = await getUserId(username);
			await updateNotFollowingMeBack();
		}
	}

	/**
	 * Fetches followers/following, then determines
	 * who is not following you back
	 */
	async function updateNotFollowingMeBack() {
		if (!userId) return;
		const followers = await getFollowers(userId);
		const following = await getFollowing(userId);

		console.log(followers, following);

		if (!followers || !following) return;
		notFollowingMeBack = getNotFollowingBack(followers, following);
	}
</script>

<div class="container w-80 p-2">
	<h1 class="text-center text-3xl">Instagram tracker</h1>

	<div class="flex flex-col items-center justify-center gap-4">
		<div class="mt-4 flex flex-col items-center justify-center">
			<p class="text-lg">Username</p>
			<p>@{username}</p>
		</div>

		<div>
			<button aria-label="See people who don't follow you back" on:click={updateNotFollowingMeBack}>
				Dont follow me back
			</button>
		</div>
	</div>

	<p>User ID: {userId}</p>

	<div>
		{#if notFollowingMeBack.length > 0}
			<h2>People who don't follow you back: {notFollowingMeBack.length}</h2>
			<ul>
				{#each notFollowingMeBack as user, idx}
					<li>{idx} - {user.username}, {user.id}</li>
				{/each}
			</ul>
		{:else if userId}
			<!-- Only display if we have a valid userId and there's no one found -->
			<p>No one found.</p>
		{/if}
	</div>
</div>
