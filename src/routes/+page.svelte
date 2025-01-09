<script lang="ts">
	import { onMount } from 'svelte';
	import UserDisplayMain from '$lib/components/userDisplayMain.svelte';
	import Button from '$lib/components/button.svelte';
	import ExportFollowersButton from '$lib/components/export_followers_button.svelte';
	import ProgressBar from '$lib/components/progress_bar.svelte';
	import type { UserProfile } from '$lib/instagram_models';

	// Utility functions & state
	import { getUserId, fetchUserProfile, fetchFollowers, fetchFollowing } from '$lib/utils/instagram_api';
	import { parseIgUserPreviews } from '$lib/utils/users';

	import { userState } from '$lib/states/user_state.svelte';
	import { getUsernameFromURL } from '$lib/utils/browser';
	import TabsVertical from '$lib/components/misc/tabsVertical.svelte';
	import { page } from '$app/state';
	import { pageTabs } from '$lib/data';
	import ImportFollowersButton from '$lib/components/importFollowersButton.svelte';
	import UserList from '$lib/components/userList.svelte';
	import { activeTabId } from '$lib/components/stores/tabStore';
	import IcRoundFileDownload from '~icons/ic/round-file-download';
	import ThemeButton from '$lib/components/misc/themeButton.svelte';
	import FullscreenButton from '$lib/components/misc/fullscreenButton.svelte';

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
</script>

<div
	class="flex min-h-0 w-full min-w-96 flex-col bg-neutral-100 text-neutral-900 transition dark:bg-neutral-800 dark:text-neutral-100 sm:h-screen"
>
	<!-- Header -->
	<div class="flex w-full items-center justify-between bg-white px-4 py-1.5 dark:bg-neutral-700">
		<h1 class="text-center text-xl">Instagram Tracker</h1>
		<div class="flex items-center justify-center gap-2">
			<ThemeButton class="" />
			<FullscreenButton class="md:hidden" />
		</div>
	</div>

	<div class="flex items-center justify-center border-b border-neutral-200 dark:border-neutral-600">
		<UserDisplayMain {userProfile} />
	</div>

	<!-- Content -->
	<div class="flex min-h-0 grow items-stretch">
		<!-- Key: min-h-0 on flex parent -->
		<div
			class="flex flex-col items-center justify-between border-r border-neutral-200 py-2 pr-2 text-base dark:border-neutral-600 max-sm:text-xs sm:py-4"
		>
			<!-- Left panel content -->
			<div class="flex items-start">
				<TabsVertical tabs={pageTabs} />
			</div>
			<div class="mt-10 flex flex-col items-center justify-center gap-2">
				<ImportFollowersButton />
				<ExportFollowersButton>
					<div class="flex items-center justify-center gap-2">
						<IcRoundFileDownload aria-label="Export data" class="size-4 sm:size-6" />
						<p>Export data</p>
					</div>
				</ExportFollowersButton>
			</div>
		</div>

		<!-- Right side -->
		<div class="flex min-h-0 grow flex-col">
			<!-- Another min-h-0 for nested flex -->
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

				{#if loadingFollowers}
					<ProgressBar {progress} />
				{/if}
			{:else}
				<UserList followers={userState.followers} following={userState.following} filterByTab={$activeTabId} />
			{/if}
		</div>
	</div>
</div>

<style>
	.instagramGradientBg {
		background: linear-gradient(145deg, rgba(249, 206, 52, 1) 0%, rgba(238, 42, 123, 1) 50%, rgba(98, 40, 215, 1) 100%);
	}
</style>
