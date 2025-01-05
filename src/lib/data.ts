import { TabId, type Tab } from "./models";

export const pageTabs: Tab[] = [
  { name: 'Followers', id: TabId.followers, active: true },
  { name: 'Following', id: TabId.following,  active: false },
  { name: 'Not Following Me Back', id: TabId.not_following_me_back, active: false },
  { name: "I Don't Follow Back",id: TabId.i_dont_follow_back, active: false }
]

export enum UserListFilter {
  All,
  Followers,
  Following,
  NotFollowingMeBack,
  IDontFollowBack
}