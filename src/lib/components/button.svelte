<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type ButtonProps = {
		loading?: boolean;
		error?: boolean;
		done?: boolean;
	} & HTMLButtonAttributes;

	let { loading, error, done, ...props }: ButtonProps = $props();
</script>

<button
	{...props}
	disabled={loading ? true : false}
	class={`${loading && 'loading'} ${error && 'error'} ${done && 'done'} relative transform overflow-hidden rounded-lg px-4 py-3 backdrop-blur-lg transition-all hover:scale-105 active:scale-95`}
>
	<div>
		{@render props.children?.()}
	</div>
</button>

<style>
	.loading {
		@apply scale-110 bg-yellow-600 active:bg-yellow-600;
	}

	.error {
		@apply scale-110 bg-red-600 active:bg-red-600;
	}

	.done {
		@apply scale-110 bg-green-600 active:bg-green-600;
	}
</style>
