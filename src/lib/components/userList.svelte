<script lang="ts">
	import IcRoundArrowBackIos from '~icons/ic/round-arrow-back-ios';
	import IcRoundArrowForwardIos from '~icons/ic/round-arrow-forward-ios';
	import UserListItem from './userListItem.svelte';
	import type { UserPreview } from '$lib/types/userTypes';

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

<div class="flex min-h-0 flex-1 flex-col">
	<!-- Scrollable list -->
	<div class="max-h-72 flex-1 overflow-y-auto p-2 sm:max-h-none sm:p-4">
		{#if displayedUsers && displayedUsers.length > 0}
			<div class="flex flex-col gap-y-1 sm:gap-y-2">
				{#each displayedUsers as user}
					<UserListItem {user} />
				{/each}
			</div>
		{:else}
			<p>No users to display</p>
		{/if}
	</div>

	<!-- Pagination always visible at the bottom -->
	{#if displayedUsers && displayedUsers.length > 0}
		<div class="flex items-center gap-2 self-center justify-self-center p-2">
			<button aria-label="Previous page" title="Previous page" onclick={goToPrevPage} disabled={currentPage === 1}>
				<IcRoundArrowBackIos class="size-5 sm:size-6" />
			</button>
			<span>Page {currentPage} of {totalPages}</span>
			<button aria-label="Next page" title="Next page" onclick={goToNextPage} disabled={currentPage === totalPages}>
				<IcRoundArrowForwardIos class="size-5 sm:size-6" />
			</button>
		</div>
	{/if}
</div>
