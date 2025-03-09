
export type UserPreview = {
	id: number;
	username: string;
	profilePicURL: string;
	isPrivate: boolean;
	isVerified: boolean;
}

export type UserProfile = {
	username?: string;
	fullName?: string;
	profilePicUrl?: string;
	bio?: string;
	followerCount?: number;
	followingCount?: number;
	isPrivate?: boolean;
	isVerified?: boolean;
}

export type UserData = {
	appMetadata?: {
		latestDataRefresh?: Date;
	};
	userId?: number;
	profile?: UserProfile;
	followers?: UserPreview[];
	following?: UserPreview[];
	notFollowingMeBack?: UserPreview[];
	iDontFollowBack?: UserPreview[];
	history?: UserHistory;
	currentDiff?: UserDifference;
};

export type UserDifference = {
	profile?: UserProfile;
	newFollowers?: UserPreview[];
	unfollowers?: UserPreview[];
	newFollowing?: UserPreview[];
	iUnfollowed?: UserPreview[];
};

export type DifferenceRecord = {
	diff?: UserDifference;
	timestamp: Date;
};

export type UserHistory = {
	initialState: UserData;
	latestState: UserData;
	records: DifferenceRecord[];
}


