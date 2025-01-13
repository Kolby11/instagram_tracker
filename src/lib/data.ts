import { TabId, type Tab } from "./types/appTypes";

export const pageTabs: Tab[] = [
  { name: 'Followers', id: TabId.FOLLOWERS, active: true },
  { name: 'Following', id: TabId.FOLLOWING,  active: false },
  { name: 'Not Following Me Back', id: TabId.NOT_FOLLOWING_ME_BACK, active: false },
  { name: "I Don't Follow Back",id: TabId.I_DONT_FOLLOW_BACK, active: false },
  { name: 'Unfollowers', id: TabId.UNFOLLOWERS, active: false },
  { name: 'New Followers', id: TabId.NEW_FOLLOWERS, active: false },
  { name: 'I Unfollowed', id: TabId.I_UNFOLLOWED, active: false },
  { name: 'New Following', id: TabId.NEW_FOLLOWING, active: false }
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