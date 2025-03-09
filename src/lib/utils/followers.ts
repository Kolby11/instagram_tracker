import type { UserPreview } from "$lib/types/userTypes";

/**
 * Returns the list of users you follow who do NOT follow you back.
 */
export function getNotFollowingMeBack(following: UserPreview[], followers: UserPreview[]): UserPreview[] {
	const notFollowingBack = following.filter((followedUser) => {
		return !followers.find((follower) => followedUser.username === follower.username);
	});
	return notFollowingBack;
}

/**
 * Returns the list of users who follow you but you do NOT follow back.
*/
export function getIDontFollowBack(following: UserPreview[], followers: UserPreview[]): UserPreview[] {
	const iDontFollowBack = followers.filter((follower) => {
		return !following.find((followedUser) => follower.username === followedUser.username);
	});
	return iDontFollowBack;
}
