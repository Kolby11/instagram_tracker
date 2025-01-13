import type { UserPreview } from "$lib/types/userTypes";

/**
 * Returns the list of users you follow who do NOT follow you back.
 */
export function getNotFollowingMeBack(following: UserPreview[], followers: UserPreview[]): UserPreview[] {
	const notFollowingMeBack = following.filter((following) => {
		return !followers.find((follower) => follower.username === following.username);
	});
	return notFollowingMeBack;
}

/**
 * Returns the list of users who follow you but you do NOT follow back.
 */
export function getIDontFollowBack(following: UserPreview[], followers: UserPreview[]): UserPreview[] {
	const notFollowingBack = followers.filter((follower) => {
		return !following.find((following) => following.username === follower.username);
	});
	return notFollowingBack;
}
