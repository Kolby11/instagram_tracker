<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type ButtonVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
	type ButtonSize = 'sm' | 'md' | 'lg';

	type ButtonProps = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
		error?: boolean;
		done?: boolean;
		fullWidth?: boolean;
	} & HTMLButtonAttributes;

	const props: ButtonProps = $props();

	// Default props
	const variant = $derived(props.variant ?? 'default');
	const size = $derived(props.size ?? 'md');
	const loading = $derived(props.loading ?? false);
	const error = $derived(props.error ?? false);
	const done = $derived(props.done ?? false);
	const fullWidth = $derived(props.fullWidth ?? false);

	// Computed classes
	const baseClasses =
		'relative transform overflow-hidden rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2',
		lg: 'px-6 py-3 text-lg'
	};

	const variantClasses = {
		default: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
		primary: 'bg-blue-600 hover:bg-blue-700 text-white',
		success: 'bg-green-600 hover:bg-green-700 text-white',
		warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
		error: 'bg-red-600 hover:bg-red-700 text-white'
	};

	const stateClasses = $derived.by(() => ({
		loading: loading ? 'animate-pulse bg-yellow-600 text-white' : '',
		error: error ? 'bg-red-600 text-white' : '',
		done: done ? 'bg-green-600 text-white' : '',
		fullWidth: fullWidth ? 'w-full' : ''
	}));

	const classes = $derived.by(() =>
		[
			baseClasses,
			sizeClasses[size],
			variantClasses[variant],
			stateClasses.loading,
			stateClasses.error,
			stateClasses.done,
			stateClasses.fullWidth,
			props.class // Allow custom classes to be added
		].join(' ')
	);
</script>

<button {...props} disabled={loading || props.disabled} class={classes}>
	<div class="flex items-center justify-center gap-2">
		{#if loading}
			<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		{/if}
		{@render props.children?.()}
	</div>
</button>
