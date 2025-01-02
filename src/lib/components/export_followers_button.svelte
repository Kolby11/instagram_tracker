<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";
	import Button from "./button.svelte";
	import { exportAsJSON } from "$lib/utils/export";
	import { userState } from "$lib/states/user_state.svelte";

  type ButtonProps = HTMLButtonAttributes

  let loading: boolean = false

  let props: ButtonProps = $props()

  function onClick(){
    if (!userState.userId || !userState.username || !userState.followers || !userState.following || loading) return

    exportAsJSON(userState.userId, userState.username, userState.followers, userState.following)
  }
</script>

<Button {...props} onclick={onClick}>
  {@render props.children?.()}
</Button>  