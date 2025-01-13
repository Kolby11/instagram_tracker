import { TabId } from '$lib/types/appTypes';
import { writable, type Writable } from 'svelte/store';

export const activeTabId: Writable<TabId> = writable(TabId.FOLLOWERS);