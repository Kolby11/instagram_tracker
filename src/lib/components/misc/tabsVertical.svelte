<script lang="ts">
	import type { Tab, TabId } from '$lib/types/appTypes';
	import { activeTabId } from '$lib/stores/tabStore';

	const { tabs }: { tabs: Tab[] } = $props();

	function handleTabClick(tabId: TabId, e: MouseEvent) {
		e.preventDefault();
		activeTabId.set(tabId);
	}
</script>

<ul
	class="flex w-fit flex-col gap-0.5 border-l border-gray-200 bg-transparent align-baseline text-gray-500 dark:border-gray-700 dark:text-gray-400"
>
	{#each tabs as tab (tab.name)}
		<li>
			<button
				onclick={(e) => handleTabClick(tab.id, e)}
				class={`block w-full rounded-r-lg px-6 py-4 text-left font-semibold transition max-sm:px-4 max-sm:py-2 ${
					$activeTabId === tab.id
						? // Active tab styles (notice no extra bolding)
							'bg-violet-400 text-violet-900 dark:bg-violet-700 dark:text-white'
						: // Inactive tab styles & hover states
							'hover:bg-violet-300 hover:text-gray-600 dark:hover:bg-violet-600 dark:hover:text-white'
				}`}
			>
				{tab.name}
				{#if tab.count}({tab.count}){/if}
			</button>
		</li>
	{/each}
</ul>
