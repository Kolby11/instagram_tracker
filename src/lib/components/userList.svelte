<script lang="ts">
	import IcRoundArrowBackIos from '~icons/ic/round-arrow-back-ios';
	import IcRoundArrowForwardIos from '~icons/ic/round-arrow-forward-ios';
	import UserListItem from './userListItem.svelte';
	import type { UserPreview } from '$lib/types/userTypes';
	import { getTranslation } from '$lib/utils/i18n';

	const itemsPerPage = 25;

	let { users }: { users: UserPreview[] } = $props();

	// Pagination helpers
	let currentPage = $state(1);

	// Reset the current page when the tab changes
	$effect(() => {
		users && (currentPage = 1);
	});

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

<div class="flex min-h-0 w-full min-w-48 flex-1 flex-col">
	<!-- Scrollable list -->
	{#if displayedUsers && displayedUsers.length > 0}
	<div class="custom-scrollbar max-h-none flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4">
		{#each displayedUsers as user}
			<UserListItem {user} />
		{/each}
	</div>
	{:else}
		<div class="flex justify-center items-center h-full font-semibold text-gray-500 dark:text-gray-400">
			<p>{getTranslation('noUsersToDisplay', 'No users to display')}</p>
		</div>
	{/if}

	<!-- Pagination always visible at the bottom -->
	{#if displayedUsers && displayedUsers.length > 0}
		<div class="flex items-center gap-2 self-center justify-self-center p-2">
			<button aria-label="Previous page" title="Previous page" onclick={goToPrevPage} disabled={currentPage === 1}>
				<IcRoundArrowBackIos class="size-5 sm:size-6" />
			</button>
			<span>{getTranslation('page', 'Page')} {currentPage} {getTranslation('outOf', 'of')} {totalPages}</span>
			<button aria-label="Next page" title="Next page" onclick={goToNextPage} disabled={currentPage === totalPages}>
				<IcRoundArrowForwardIos class="size-5 sm:size-6" />
			</button>
		</div>
	{/if}
</div>
