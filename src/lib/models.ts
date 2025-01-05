import type { IgUser } from './instagram_models';

export enum TabId {
  followers = 'followers',
  following = 'following',
  not_following_me_back = 'not_following_me_back',
  i_dont_follow_back = 'i_dont_follow_back'
}

export type Tab = {
	name: string;
	id: TabId;
	active: boolean;
}

export type ExportJSON = {
	followers: IgUser[];
	following: IgUser[];
	metadata: ExportMetadata;
};

type ExportMetadata = {
	userId: number;
	username: string;
	exportDate: string;
};
