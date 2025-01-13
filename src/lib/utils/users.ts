import type { ExportData } from '$lib/types/exportTypes';
import type { IgUserPreview, IGUserProfile } from '$lib/types/instagramTypes';
import type { UserData, UserPreview, UserProfile } from '$lib/types/userTypes';
import type { Writable } from 'svelte/store';

export function parseIgUserPreviews(users: IgUserPreview[]): UserPreview[] {
	return users.map((u) => {
		return {
			id: u.id,
			username: u.username,
			isPrivate: u.is_private,
			profilePicURL: u.profile_pic_url,
			isVerified: u.is_verified
		};
	});
}

export function parseIgUserProfile(user: IGUserProfile): UserProfile {
	return {
			username: user.username,
			fullName: user.full_name,
			profilePicUrl: user.profile_pic_url,
			bio: user.biography,
			followerCount: user.follower_count,
			followingCount: user.following_count
	};
}

export function importDataIntoUserState(userDataStore: Writable<UserData>, data: ExportData): void {
	const newUserData: UserData = {
		userId: data.metadata.userId,
		profile: {
			username: data.profile?.username || data.metadata.username,
			profilePicUrl: data.profile?.profilePicUrl,
			bio: data.profile?.bio
		},
		followers: data.followers,
		following: data.following,
		history: data.history
	}
	userDataStore.set(newUserData);
}