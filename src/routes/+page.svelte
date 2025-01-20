<script lang="ts">
	import { onMount } from 'svelte';
	import UserDisplayMain from '$lib/components/userDisplayMain.svelte';
	import ProgressBar from '$lib/components/progressBar.svelte';
	import { getUserId } from '$lib/utils/instagramApi';
	import { getUsernameFromURL } from '$lib/utils/browser';
	import TabsVertical from '$lib/components/misc/tabsVertical.svelte';
	import {
		fetchUserData,
		loadUserDataFromLocalStorage,
		userDataStore,
		loadingStateStore,
		totalProgressStore
	} from '$lib/stores/userDataStore';
	import { page } from '$app/state';
	import ImportFollowersButton from '$lib/components/importFollowersButton.svelte';
	import UserList from '$lib/components/userList.svelte';
	import { activeTabId, pageTabs } from '$lib/stores/tabStore';
	import IcRoundFileDownload from '~icons/ic/round-file-download';
	import ThemeButton from '$lib/components/misc/themeButton.svelte';
	import FullscreenButton from '$lib/components/misc/fullscreenButton.svelte';
	import { mapUserDataToTabData } from '$lib/utils/app';
	import { browser } from '$app/environment';
	import { TabId } from '$lib/types/appTypes';
	import { getIDontFollowBack, getNotFollowingMeBack } from '$lib/utils/followers';
	import type { UserData } from '$lib/types/userTypes';
	import ExportFollowersButton from '$lib/components/exportFollowersButton.svelte';

	let params = $derived(new URL(page.url).searchParams);
	let currentUsername = '';

	onMount(async () => {
		await handleURLChange();

		// Listen for URL changes in the active tab
		chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
			// Only handle updates for the active tab and when URL changes
			if (changeInfo.url) {
				const currentTab = await getCurrentTab();
				if (currentTab?.id === tabId) {
					await handleURLChange();
				}
			}
		});

		// Handle tab activation changes
		chrome.tabs.onActivated.addListener(async (activeInfo) => {
			await handleURLChange();
		});
	});

	async function getCurrentTab() {
		return new Promise<chrome.tabs.Tab>((resolve) => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				resolve(tabs[0]);
			});
		});
	}

	userDataStore.subscribe((e) => {
		if (!browser) return;
		mapUserDataToTabData(e, pageTabs);
	});

	async function handleURLChange() {
		const newUsername = (await getUsernameFromURL()) || params.get('username') || '';
		if (!newUsername) return;

		// Check if the username has not changed return
		if (newUsername === currentUsername) return;

		const newUserId = await getUserId(newUsername);
		currentUsername = newUsername;

		// Load from localStorage first
		loadUserDataFromLocalStorage(newUserId);

		// Check if we need to fetch fresh data
		const currentData = $userDataStore;
		const needsFreshData =
			!currentData.profile ||
			currentData.profile.username !== newUsername ||
			!currentData.followers ||
			!currentData.following;

		if (needsFreshData) {
			console.log('Fetching fresh data for:', newUsername);
			await fetchUserData(newUserId);
		} else {
			console.log('Using cached data for:', newUsername);
		}
	}

	function getUsers(activeTabId: TabId, userData: UserData) {
		if (activeTabId === TabId.FOLLOWERS) {
			return userData.followers || [];
		}
		if (activeTabId === TabId.FOLLOWING) {
			return userData.following || [];
		}
		if (activeTabId === TabId.NOT_FOLLOWING_ME_BACK && userData.following && userData.followers) {
			return getNotFollowingMeBack(userData.following, userData.followers) || [];
		}
		if (activeTabId === TabId.I_DONT_FOLLOW_BACK && userData.following && userData.followers) {
			return getIDontFollowBack(userData.following, userData.followers) || [];
		}
		if (activeTabId === TabId.UNFOLLOWERS) {
			return userData.currentDiff?.unfollowers || [];
		}
		if (activeTabId === TabId.NEW_FOLLOWERS) {
			return userData.currentDiff?.newFollowers || [];
		}
		if (activeTabId === TabId.I_UNFOLLOWED) {
			return userData.currentDiff?.iUnfollowed || [];
		}
		if (activeTabId === TabId.NEW_FOLLOWING) {
			return userData.currentDiff?.newFollowing || [];
		}

		return [];
	}

	// Helper function to check if account is private
	function isPrivateAccount(userData: UserData): boolean {
		return Boolean(
			userData.profile &&
				userData.profile.isPrivate &&
				(!userData.followers || userData.followers.length === 0) &&
				(!userData.following || userData.following.length === 0) &&
				((userData.profile.followerCount && userData.profile.followerCount > 0) ||
					(userData.profile.followingCount && userData.profile.followingCount > 0))
		);
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
		<UserDisplayMain userProfile={$userDataStore.profile} />
	</div>

	<!-- Content -->
	<div class="flex min-h-0 grow items-stretch">
		<div
			class="flex flex-col items-center justify-between border-r border-neutral-200 py-2 pr-2 text-base dark:border-neutral-600 max-sm:text-xs sm:py-4"
		>
			<!-- Left panel content -->
			<div class="flex items-start">
				<TabsVertical tabs={$pageTabs} />
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
		<div class="flex min-h-0 grow flex-col items-center justify-center max-sm:max-w-56">
			{#if $userDataStore.userId}
				{#if $loadingStateStore.isLoading}
					<div class="flex flex-col items-center justify-center space-y-4 p-4">
						<p class="text-center text-sm text-neutral-600 dark:text-neutral-400">Loading user data...</p>
						<ProgressBar progress={$totalProgressStore} />

						{#if $loadingStateStore.limitations.followersExceeded || $loadingStateStore.limitations.followingExceeded}
							<div class="mt-4 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
								<p class="text-sm text-yellow-700 dark:text-yellow-200">
									{#if $loadingStateStore.limitations.followersExceeded && $loadingStateStore.limitations.followingExceeded}
										This account has too many connections to analyze. We can only analyze accounts with fewer than 2,000
										followers and following.
									{:else if $loadingStateStore.limitations.followersExceeded}
										This account has too many followers to analyze (>2,000). Only following data will be fetched.
									{:else}
										This account follows too many users to analyze (>2,000). Only follower data will be fetched.
									{/if}
								</p>
							</div>
						{/if}
					</div>
				{:else if isPrivateAccount($userDataStore)}
					<div class="flex flex-col items-center justify-center p-8 text-center">
						<p class="mb-2 text-lg font-medium">Private Account</p>
						<p class="text-sm text-neutral-600 dark:text-neutral-400">
							This account is private. You need to follow this account to view their followers and following.
						</p>
					</div>
				{:else if $loadingStateStore.error}
					<div class="flex flex-col items-center justify-center p-8 text-center">
						<p class="mb-2 text-lg font-medium text-red-600">Error Loading Data</p>
						<p class="text-sm text-neutral-600 dark:text-neutral-400">
							{$loadingStateStore.error}
						</p>
					</div>
				{:else}
					<UserList users={getUsers($activeTabId, $userDataStore)} />
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.instagramGradientBg {
		background: linear-gradient(145deg, rgba(249, 206, 52, 1) 0%, rgba(238, 42, 123, 1) 50%, rgba(98, 40, 215, 1) 100%);
	}
</style>
