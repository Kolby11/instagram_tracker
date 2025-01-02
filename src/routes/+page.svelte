<script lang="ts">
	import { onMount } from 'svelte';
	import { getUserId, fetchFollowers, fetchFollowing, fetchUserProfile } from '$lib/utils/instagram_api';
	import Button from '$lib/components/button.svelte';
	import { getUsernameFromURL } from '$lib/utils/browser';
	import { getNotFollowingMeBack, getIDontFollowBack } from '$lib/utils/followers';
	import { parseIgUserPreviews } from '$lib/utils/users';
	import ExportFollowersButton from '$lib/components/export_followers_button.svelte';
	import { userState } from '$lib/states/user_state.svelte';
	import UserListItem from '$lib/components/user_list_item.svelte';
	import ProgressBar from '$lib/components/progress_bar.svelte';
	import type { UserProfile } from '$lib/instagram_models';

	let currentTab: chrome.tabs.Tab | undefined;
	let loadingFollowers = $state(false);
	let loadFollowersError = false;
	let progress = $state(0); // Track follower fetching progress
	let userProfile: UserProfile | undefined = $state();

	// Derived reactive stores for analysis
	const notFollowingMeBack = $derived.by(() => {
		if (!userState.followers || !userState.following) {
			return [];
		}
		return getNotFollowingMeBack(userState.following, userState.followers);
	});

	const iDontFollowBack = $derived.by(() => {
		if (!userState.followers || !userState.following) {
			return [];
		}
		return getIDontFollowBack(userState.following, userState.followers);
	});

	// On mount, fetch the user and update state
	onMount(async () => {
		await handleURLChange();
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			currentTab = tabs[0];
		});
	});

	/**
	 * Update the user state when URL changes
	 */
	async function handleURLChange() {
		const newUsername = (await getUsernameFromURL()) ?? '';
		let newUserId: number | undefined = undefined;

		if (newUsername) {
			newUserId = await getUserId(newUsername);
			userProfile = await fetchUserProfile(newUserId);
		}

		userState.username = newUsername;
		userState.userId = newUserId;
	}

	/**
	 * Analyze followers and following
	 */
	async function analyzeFollowers() {
		if (loadingFollowers || !userState.userId) return;

		loadingFollowers = true;
		loadFollowersError = false;
		progress = 0;

		try {
			let followersProgress = 0;
			let followingProgress = 0;

			const [followers, following] = await Promise.all([
				fetchFollowers(userState.userId, (currentProgress) => {
					followersProgress = currentProgress * 100;
					progress = Math.floor((followersProgress + followingProgress) / 2);
				}),
				fetchFollowing(userState.userId, (currentProgress) => {
					followingProgress = currentProgress * 100;
					progress = Math.floor((followersProgress + followingProgress) / 2);
				})
			]);

			progress = 100;

			const formattedFollowers = parseIgUserPreviews(followers);
			const formattedFollowing = parseIgUserPreviews(following);

			if (!formattedFollowers || !formattedFollowing) {
				loadFollowersError = true;
				return;
			}

			userState.followers = formattedFollowers;
			userState.following = formattedFollowing;

			// Analyze the results
			const dontFollowMeBack = getNotFollowingMeBack(formattedFollowing, formattedFollowers);
			const iDontFollowBack = getIDontFollowBack(formattedFollowing, formattedFollowers);

			console.log({ dontFollowMeBack });
			console.log({ iDontFollowBack });
		} catch (error) {
			console.error('Error in analyzeFollowers:', error);
			loadFollowersError = true;
		} finally {
			loadingFollowers = false;
		}
	}
</script>

<!-- HTML Template -->
<div class="container w-80 p-2">
	<h1 class="border-b pb-2 text-center text-3xl">Instagram Tracker</h1>

	<div class="flex flex-col items-center justify-center gap-4">
		<!-- User Profile Section -->
		{#if userProfile}
			<div class="mt-4 flex flex-col items-center">
				<img src={userProfile.profile_pic_url} alt="Profile Picture" class="h-32 w-32 rounded-full" />
				<h2 class="mt-2 text-2xl">{userProfile.full_name}</h2>
				<p>@{userProfile.username}</p>
				<p>{userProfile.biography}</p>
				<div class="mt-2 flex gap-4">
					<p><strong>{userProfile.follower_count}</strong> Followers</p>
					<p><strong>{userProfile.following_count}</strong> Following</p>
				</div>
			</div>
		{/if}

		<div>
			<Button
				loading={loadingFollowers}
				error={loadFollowersError}
				aria-label="Analyze followers and following"
				onclick={analyzeFollowers}
			>
				{#if loadingFollowers}
					Loading...
				{:else}
					Analyze Followers
				{/if}
			</Button>
		</div>
	</div>

	{#if loadingFollowers}
		<ProgressBar {progress} />
	{/if}

	<ExportFollowersButton>Export followers</ExportFollowersButton>

	{#if notFollowingMeBack.length > 0}
		<h2>People who don't follow you back: {notFollowingMeBack.length}</h2>
		<ul>
			{#each notFollowingMeBack as user, idx}
				<UserListItem {user}></UserListItem>
			{/each}
		</ul>
	{/if}

	{#if iDontFollowBack.length > 0}
		<h2>People you don't follow back: {iDontFollowBack.length}</h2>
		<ul>
			{#each iDontFollowBack as user, idx}
				<UserListItem {user}></UserListItem>
			{/each}
		</ul>
	{/if}

	<p>User ID: {userState.userId}</p>
</div>

<!-- Styles -->
<style>
	.instagramGradientBg {
		background: linear-gradient(145deg, rgba(249, 206, 52, 1) 0%, rgba(238, 42, 123, 1) 50%, rgba(98, 40, 215, 1) 100%);
	}
</style>
