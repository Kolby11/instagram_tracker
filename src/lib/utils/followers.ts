import type { IgUser } from '$lib/instagram_models';

/**
 * Returns the list of users you follow who do NOT follow you back.
 */
export function getNotFollowingMeBack(following: IgUser[], followers: IgUser[]): IgUser[] {
	const notFollowingMeBack = following.filter((following) => {
		return !followers.find((follower) => follower.username === following.username);
	});
	return notFollowingMeBack;
}

/**
 * Returns the list of users who follow you but you do NOT follow back.
 */
export function getIDontFollowBack(following: IgUser[], followers: IgUser[]): IgUser[] {
	const notFollowingBack = followers.filter((follower) => {
		return !following.find((following) => following.username === follower.username);
	});
	return notFollowingBack;
}
