
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
}

export type UserData = {
	userId?: number;
	profile?: UserProfile;
	followers?: UserPreview[];
	following?: UserPreview[];
	history?: UserHistory;
};

export type UserDifference = {
	profile: UserProfile;
	newFollowers: UserPreview[];
	unfollowers: UserPreview[];
	newFollowing: UserPreview[];
	unfollowing: UserPreview[];
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


