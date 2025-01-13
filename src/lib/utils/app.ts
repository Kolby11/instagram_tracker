import { TabId, type Tab } from "$lib/types/appTypes";
import type { UserData } from "$lib/types/userTypes";
import type { Writable } from "svelte/store";

export function mapUserDataToTabData(userData: UserData, tabs: Writable<Tab[]>): void {
  tabs.update((currentTabs) => {
    if (!Array.isArray(currentTabs)) {
      return currentTabs ?? [];
    }
    return currentTabs.map((oldTab) => {
      const newTab = { ...oldTab };

      switch (newTab.id) {
        case TabId.FOLLOWERS:
          newTab.count = userData.followers?.length ?? 0;
          break;
        case TabId.FOLLOWING:
          newTab.count = userData.following?.length ?? 0;
          break;
        case TabId.NOT_FOLLOWING_ME_BACK:
          newTab.count = userData.notFollowingMeBack?.length ?? 0;
          break;
        case TabId.I_DONT_FOLLOW_BACK:
          newTab.count = userData.iDontFollowBack?.length ?? 0;
          break;
        case TabId.UNFOLLOWERS:
          newTab.count = userData.currentDiff?.unfollowers?.length ?? 0;
          break;
        case TabId.NEW_FOLLOWERS:
          newTab.count = userData.currentDiff?.newFollowers?.length ?? 0;
          break;
        case TabId.I_UNFOLLOWED:
          newTab.count = userData.currentDiff?.iUnfollowed?.length ?? 0;
          break;
        case TabId.NEW_FOLLOWING:
          newTab.count = userData.currentDiff?.newFollowing?.length ?? 0;
          break;
      }

      return newTab;
    });
  });
}
