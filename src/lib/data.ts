import { AppSettingInputTypes, type AppSettings } from "./types/appSettingTypes";
import { TabId } from "./types/appTypes";
import { getTranslation } from "./utils/i18n";

export const FETCH_FOLLOWERS_BATCH_SIZE = 50;
export const FETCH_FOLLOWING_BATCH_SIZE = 50;

export const DEFAULT_APP_SETTINGS: AppSettings = {
  automaticDataRefresh: {
    title: getTranslation("automaticDataRefreshTitle", 'Automatic Data Refresh'),
    tooltip: getTranslation("automaticDataRefreshTooltip", 'Automatically refresh data on app load after the specified interval'),
    value: true,
    defaultValue: true,
    componentType: AppSettingInputTypes.CHECKBOX,
    componentProps: {}
  },
  refreshInterval: {
    title: getTranslation("refreshIntervalTitle", 'Refresh Interval'),
    tooltip: getTranslation("refreshIntervalTootlip", 'Days between automatic data refreshes'),
    value: 1,
    defaultValue: 1,
    componentType: AppSettingInputTypes.NUMBER,
    componentProps: { unit: getTranslation("refreshIntervalUnit", 'days'), min: 0, max: 365 },
  },
  maxStoredUsers: {
    title: getTranslation("maxStoredUsersTitle", 'Max stored users'),
    tooltip: getTranslation("maxStoredUsersTootlip", 'Maximum amount of stored users. When limit is reached the oldest saved user gets overwritten'),
    value: 5,
    defaultValue: 5,
    componentType: AppSettingInputTypes.NUMBER,
    componentProps: { min: 1, max: 10 },
  },
  maxFetchCount: {
    title: getTranslation("maxFetchCountTitle", 'Max fetch count'),
    tooltip: getTranslation("maxFetchCountTootlip", 'Maximum amount of followers or following that can be fetched'),
    value: 3000,
    defaultValue: 3000,
    componentType: AppSettingInputTypes.NUMBER,
    componentProps: { min: 1, max: 10000 },
  }
}

export const INITIAL_PAGE_TABS = [
  { name: getTranslation("tabFollowers", "Followers"), id: TabId.FOLLOWERS },
  { name: getTranslation('tabFollowing', 'Following'), id: TabId.FOLLOWING },
  { name: getTranslation('tabNotFollowingMeBack', 'Not Following Me Back'), id: TabId.NOT_FOLLOWING_ME_BACK },
  { name: getTranslation("tabIDontFollowBack", "I Don't Follow Back"),id: TabId.I_DONT_FOLLOW_BACK },
  { name: getTranslation('tabNewFollowers', 'New Followers'), id: TabId.NEW_FOLLOWERS },
  { name: getTranslation('tabNewFollowing','New Following'), id: TabId.NEW_FOLLOWING},
  { name: getTranslation('tabUnfollowers', 'Unfollowers'), id: TabId.UNFOLLOWERS },
  { name: getTranslation('tabIUnfollowed', 'I Unfollowed'), id: TabId.I_UNFOLLOWED }
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