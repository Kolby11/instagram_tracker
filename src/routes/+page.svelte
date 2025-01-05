<script lang="ts">
	import { onMount } from 'svelte';
	import UserDisplayMain from '$lib/components/user_display_main.svelte';
	import Button from '$lib/components/button.svelte';
	import ExportFollowersButton from '$lib/components/export_followers_button.svelte';
	import ProgressBar from '$lib/components/progress_bar.svelte';
	import type { UserProfile } from '$lib/instagram_models';

	// Utility functions & state
	import { getUserId, fetchUserProfile, fetchFollowers, fetchFollowing } from '$lib/utils/instagram_api';
	import { parseIgUserPreviews } from '$lib/utils/users';

	import { userState } from '$lib/states/user_state.svelte';
	import { getUsernameFromURL, openInNewTab } from '$lib/utils/browser';
	import TabsVertical from '$lib/components/misc/tabs_vertical.svelte';
	import { page } from '$app/state';
	import { pageTabs } from '$lib/data';
	import ImportFollowersButton from '$lib/components/import_followers_button.svelte';
	import UserList from '$lib/components/user_list.svelte';
	import { activeTabId } from '$lib/states/tab_state.svelte';
	import Icon from '@iconify/svelte';

	let params = $derived(new URL(page.url).searchParams);

	let loadingFollowers = false;
	let loadFollowersError = false;
	let progress = 0;

	let userProfile: UserProfile | undefined = $state();

	onMount(async () => {
		await handleURLChange();
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			// If you need the currentTab info for something
			// let currentTab = tabs[0];
		});
	});

	async function handleURLChange() {
		const newUsername = (await getUsernameFromURL()) || params.get('username') || '';
		console.log('Username:', newUsername); // Add this log
		if (!newUsername) return;

		const newUserId = await getUserId(newUsername);
		console.log('UserId:', newUserId); // Add this log
		userState.username = newUsername;
		userState.userId = newUserId;

		if (newUserId) {
			userProfile = await fetchUserProfile(newUserId);
			console.log('Fetched userProfile:', userProfile); // Add this log
		}
	}

	// The main analysis function
	async function analyzeFollowers() {
		if (loadingFollowers || !userState.userId) return;

		loadingFollowers = true;
		loadFollowersError = false;
		progress = 0;

		try {
			let followersProgress = 0;
			let followingProgress = 0;

			// Fetch followers & following in parallel
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

			// Once both are done
			progress = 100;

			// parseIgUserPreviews is your utility
			const formattedFollowers = parseIgUserPreviews(followers);
			const formattedFollowing = parseIgUserPreviews(following);

			if (!formattedFollowers || !formattedFollowing) {
				loadFollowersError = true;
				return;
			}

			// Save in userState
			userState.followers = formattedFollowers;
			userState.following = formattedFollowing;
		} catch (error) {
			console.error('Error in analyzeFollowers:', error);
			loadFollowersError = true;
		} finally {
			loadingFollowers = false;
		}
	}

	function fullscreenButtonClick() {
		openInNewTab(`${chrome.runtime.getURL('index.html')}?username=${userState.username}`);
	}
</script>

<div class="w-full min-w-96">
	<div class="relative w-full px-2 pt-2">
		<h1 class="border-b pb-2 text-center text-3xl">Instagram Tracker</h1>

		<!-- Use a button that calls openInNewTab instead of an <a> tag -->
		<button
			onclick={fullscreenButtonClick}
			class="absolute right-0 top-0 flex items-center justify-center p-2 md:hidden"
			style="background: none; border: none; cursor: pointer;"
		>
			<Icon icon="ic:round-open-in-new" width="24" height="24" aria-label="Fullscreen" />
		</button>
	</div>

	<UserDisplayMain {userProfile} />
	<div class="flex items-stretch justify-start gap-4">
		<div class="mt-4 flex flex-col items-center justify-between border-r border-gray-400 pr-2 text-base max-sm:text-xs">
			<div class="flex items-start">
				<TabsVertical tabs={pageTabs} />
			</div>
			<div class="mb-4 mt-10 flex flex-col items-center justify-center gap-2">
				<ImportFollowersButton>
					<div class="flex items-center justify-center gap-2">
						<Icon icon="ic:round-file-upload" aria-label="Import data" class="size-4 sm:size-6" />
						<p>Import data</p>
					</div>
				</ImportFollowersButton>
				<ExportFollowersButton>
					<div class="flex items-center justify-center gap-2">
						<Icon icon="ic:round-file-download" aria-label="Export data" class="size-4 sm:size-6" />
						<p>Export data</p>
					</div>
				</ExportFollowersButton>
			</div>
		</div>
		<div class="flex grow">
			{#if userState.userId && !userState.followers && !userState.following}
				<div class="flex items-center justify-center">
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
				<!-- If loading, show progress bar -->
				{#if loadingFollowers}
					<ProgressBar {progress} />
				{/if}
			{:else}
				<UserList followers={userState.followers} following={userState.following} filter_by_tab={$activeTabId} />
			{/if}
		</div>
	</div>

	<p>User ID: {userState.userId}</p>
</div>

<style>
	.instagramGradientBg {
		background: linear-gradient(145deg, rgba(249, 206, 52, 1) 0%, rgba(238, 42, 123, 1) 50%, rgba(98, 40, 215, 1) 100%);
	}
</style>
