import { TabId, type Tab } from "./types/appTypes";

export const MAX_STORED_USERS = 3;
export const FETCH_FOLLOWERS_BATCH_SIZE = 50;
export const FETCH_FOLLOWING_BATCH_SIZE = 50;
export const MAX_FETCHABLE_COUNT = 2000;

export const initialPageTabs: Tab[] = [
  { name: 'Followers', id: TabId.FOLLOWERS },
  { name: 'Following', id: TabId.FOLLOWING },
  { name: 'Not Following Me Back', id: TabId.NOT_FOLLOWING_ME_BACK },
  { name: "I Don't Follow Back",id: TabId.I_DONT_FOLLOW_BACK },
  { name: 'Unfollowers', id: TabId.UNFOLLOWERS },
  { name: 'New Followers', id: TabId.NEW_FOLLOWERS },
  { name: 'I Unfollowed', id: TabId.I_UNFOLLOWED },
  { name: 'New Following', id: TabId.NEW_FOLLOWING}
]

export enum UserListFilter {
  All,
  Followers,
  Following,
  NotFollowingMeBack,
  IDontFollowBack,
  Unfollowers,
  NewFollowers,
  IUnfollowed,
  NewFollowing
}