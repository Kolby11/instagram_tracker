<script lang="ts">
	import type { IgUser } from '$lib/instagram_models';
	import { TabId } from '$lib/models';
	import { getIDontFollowBack, getNotFollowingMeBack } from '$lib/utils/followers';
	import Icon from '@iconify/svelte';
	import UserListItem from './user_list_item.svelte';

	const itemsPerPage = 25;

	let { followers, following, filter_by_tab }: { followers?: IgUser[]; following?: IgUser[]; filter_by_tab: TabId } =
		$props();

	const users = $derived.by(() => {
		if (filter_by_tab === TabId.followers) return followers;
		if (filter_by_tab === TabId.following) return following;
		if (filter_by_tab === TabId.not_following_me_back) return notFollowingMeBack;
		if (filter_by_tab === TabId.i_dont_follow_back) return iDontFollowBack;
	});

	let notFollowingMeBack = $derived(followers && following ? getNotFollowingMeBack(following, followers) : []);

	let iDontFollowBack = $derived(followers && following ? getIDontFollowBack(following, followers) : []);

	// Pagination helpers
	let currentPage = $state(1);
	const totalPages: number | undefined = $derived.by(() =>
		users ? Math.ceil(users.length / itemsPerPage) : undefined
	);
	const displayedUsers = $derived.by(() => {
		return (users || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	});

	function goToPrevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function goToNextPage() {
		if (!totalPages) return;

		if (currentPage < totalPages) {
			currentPage++;
		}
	}
</script>

<div>
	{#if displayedUsers && displayedUsers.length > 0}
		<!-- Render the users in the current slice -->
		<div class="h-72 overflow-y-auto sm:max-h-none">
			{#each displayedUsers as user}
				<UserListItem {user} />
			{/each}
		</div>

		<!-- Pagination controls -->
		<div class="my-2 flex items-center gap-2">
			<button aria-label="Previous" onclick={goToPrevPage} disabled={currentPage === 1}
				><Icon icon="ic:round-arrow-back-ios" width="20" height="20" /></button
			>
			<span>Page {currentPage} of {totalPages}</span>
			<button aria-label="Next" onclick={goToNextPage} disabled={currentPage === totalPages}
				><Icon icon="ic:round-arrow-forward-ios" width="20" height="20" /></button
			>
		</div>
	{:else}
		<p>No users to display</p>
	{/if}
</div>
