<script lang="ts">
	const { progress, ...props }: { progress: number } = $props();
</script>

<div class="relative h-6 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
	<!-- Progress text - always visible on top -->
	<div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-white">
		{progress}%
	</div>

	<!-- Gradient overlay that gets revealed -->
	<div
		class="instagramGradientBg absolute inset-0 transition-all duration-300 ease-in-out"
		style:clip-path={`inset(0 ${100 - progress}% 0 0)`}
	>
		<!-- Progress text - visible when gradient is revealed -->
		<div class="flex h-full items-center justify-center text-xs font-medium text-white">
			{progress}%
		</div>
	</div>
</div>

<style>
	.instagramGradientBg {
		background: linear-gradient(145deg, rgba(249, 206, 52, 1) 0%, rgba(238, 42, 123, 1) 50%, rgba(98, 40, 215, 1) 100%);
	}
</style>
