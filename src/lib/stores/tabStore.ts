import { initialPageTabs } from '$lib/data';
import { TabId, type Tab } from '$lib/types/appTypes';
import { writable, type Writable } from 'svelte/store';

export const activeTabId: Writable<TabId> = writable(TabId.FOLLOWERS);
export const pageTabs: Writable<Tab[]> = writable(initialPageTabs);