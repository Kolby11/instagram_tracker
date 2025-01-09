<script lang="ts">
	import type { Tab } from '$lib/models';

	export let tabs: Tab[] = [];
</script>

<ul
	class="flex gap-0.5 border-b border-gray-200 text-base text-gray-500 max-sm:text-xs dark:border-gray-700 dark:text-gray-400"
>
	{#each tabs as tab (tab.name)}
		<li>
			<a
				href="#"
				class={`inline-block rounded-t-lg px-4 py-2 ${
					tab.active
						? /* Active tab styles */
							'border-blue-600 bg-gray-100 font-medium text-blue-600 dark:border-blue-500 dark:bg-gray-800 dark:text-blue-500'
						: /* Inactive tab styles */
							'hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300'
				}`}
			>
				{tab.name}
			</a>
		</li>
	{/each}
</ul>
