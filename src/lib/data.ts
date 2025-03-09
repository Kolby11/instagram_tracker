import { AppSettingInputTypes, type AppSettings } from "./types/appSettingTypes";
import { TabId, type Tab } from "./types/appTypes";

export const MAX_STORED_USERS = 3;
export const FETCH_FOLLOWERS_BATCH_SIZE = 50;
export const FETCH_FOLLOWING_BATCH_SIZE = 50;
export const MAX_FETCHABLE_COUNT = 2000;

export const DEFAULT_APP_SETTINGS: AppSettings = {
    automaticDataRefresh: {
      title: 'Automatic Data Refresh',
      tooltip: 'Automatically refresh data on app load after the specified interval',
      value: true,
      defaultValue: true,
      componentType: AppSettingInputTypes.CHECKBOX,
      componentProps: {}
    },
    refreshInterval: {
      title: 'Refresh Interval',
      tooltip: 'Days between automatic data refreshes',
      value: 1,
      defaultValue: 1,
      componentType: AppSettingInputTypes.NUMBER,
      componentProps: { unit: "days", min: 0, max: 365 },
    }
}

export const INITIAL_PAGE_TABS: Tab[] = [
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