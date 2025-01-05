import { TabId } from '$lib/models';
import { writable, type Writable } from 'svelte/store';

export const activeTabId: Writable<TabId> = writable(TabId.followers);