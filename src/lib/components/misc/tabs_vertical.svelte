<script lang="ts">
	import type { Tab, TabId } from '$lib/models';
	import { activeTabId } from '$lib/states/tab_state.svelte';

	const { tabs }: { tabs: Tab[] } = $props();

	function handleTabClick(tabId: TabId, e: MouseEvent) {
		e.preventDefault();
		activeTabId.set(tabId);
	}
</script>

<ul
	class="flex w-fit flex-col gap-0.5 border-l border-gray-200 align-baseline text-gray-500 dark:border-gray-700 dark:text-gray-400"
>
	{#each tabs as tab (tab.name)}
		<li>
			<button
				onclick={(e) => handleTabClick(tab.id, e)}
				class={`block w-full rounded-r-lg px-6 py-4 text-left max-sm:px-4 max-sm:py-2 ${
					$activeTabId === tab.id
						? 'bg-gray-100 font-semibold text-blue-600 dark:bg-gray-800 dark:text-blue-500'
						: 'hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
				}`}
			>
				{tab.name}
			</button>
		</li>
	{/each}
</ul>
