export enum TabId {
  FOLLOWERS = 'followers',
  FOLLOWING = 'following',
  NOT_FOLLOWING_ME_BACK = 'not_following_me_back',
  I_DONT_FOLLOW_BACK = 'i_dont_follow_back',
  UNFOLLOWERS = 'unfollowers',
  NEW_FOLLOWERS = 'new_followers',
  I_UNFOLLOWED = 'i_unfollowed',
  NEW_FOLLOWING = 'new_following'
}

export type Tab = {
  name: string;
  id: TabId;
  count?: number;
}