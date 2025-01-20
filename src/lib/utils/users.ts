import type { IgUserPreview, IGUserProfile } from '$lib/types/instagramTypes';
import type { UserPreview, UserProfile } from '$lib/types/userTypes';

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
			followingCount: user.following_count,
			isPrivate: user.is_private,
			isVerified: user.is_verified
	};
}

/**
 * Utility to find items in `current` that are not in `previous` (by `id`).
 */
export function findDifferences(
	current: UserPreview[] = [],
	previous: UserPreview[] = []
): UserPreview[] {
	return current.filter(
		(cur) => !previous.some((prev) => prev.id === cur.id)
	);
}

/**
 * Compare two profiles (new vs. old).
 * Return `undefined` if no changes; otherwise, return an object
 * that shows what changed in each field.
 */
export function diffProfile(newProfile?: UserProfile, oldProfile?: UserProfile) {
	if (!newProfile && !oldProfile) return undefined;

	const n = newProfile ?? {};
	const o = oldProfile ?? {};

	const changedKeys: (keyof UserProfile)[] = [];
	for (const key of Object.keys(n) as (keyof UserProfile)[]) {
		if (!Object.keys(o).includes(key) || n[key] !== o[key]) {
			changedKeys.push(key);
		}
	}

	if (!changedKeys.length) return undefined;

	const result: Record<string, unknown> = {};
	for (const key of changedKeys) {
		result[key] = n[key];
	}
	return result;
}