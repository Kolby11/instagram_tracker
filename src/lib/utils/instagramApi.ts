import { FETCH_FOLLOWERS_BATCH_SIZE, FETCH_FOLLOWING_BATCH_SIZE } from '$lib/data';
import type { IgUserPreview, IGUserProfileResponse, IGUserProfile } from '$lib/types/instagramTypes';

const QUERY_HASH_FOLLOWERS = 'c76146de99bb02f6415203be841dd25a';
const QUERY_HASH_FOLLOWING = 'd04b0a864b4b54837c0d870b0e77e076';
const DOC_ID_PROFILE = '8755478011231574';

/**
 * Get the numeric user ID by username.
 */
export async function getUserId(username: string): Promise<number> {
	const url = `https://www.instagram.com/web/search/topsearch/?query=${username}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		const user = data.users.map((u: any) => u.user).filter((u: any) => u.username === username)[0];

		if (!user) {
			throw new Error('User not found');
		}
		return parseInt(user.pk);
	} catch (error) {
		console.error('Error in getUserId:', error);
		throw error;
	}
}

/**
 * Fetch user profile information by user ID.
 */
export async function fetchUserProfile(userId: number): Promise<IGUserProfile | undefined> {
	const variables = {
		id: userId,
		render_surface: 'PROFILE'
	};

	const url = `https://www.instagram.com/graphql/query/?doc_id=${DOC_ID_PROFILE}&variables=${encodeURIComponent(
		JSON.stringify(variables)
	)}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data: IGUserProfileResponse = await response.json();
		const user = data.data.user;

		if (!user) {
			throw new Error('User profile not found');
		}

		return user;
	} catch (error) {
		console.error('Error fetching user profile:', error);
		throw error;
	}
}

/**
 * Fetch followers with pagination and accurate progress
 */
export async function fetchFollowers(
	userId: number,
	progressCallback?: (current: number, total: number) => void
): Promise<IgUserPreview[]> {
	const followers: IgUserPreview[] = [];
	let after: string | null = null;
	let hasNext = true;
	let totalCount: number | null = null;

	while (hasNext) {
		const variables = {
			id: userId,
			include_reel: true,
			fetch_mutual: true,
			first: FETCH_FOLLOWERS_BATCH_SIZE,
			after: after
		};

		const url: string = `https://www.instagram.com/graphql/query/?query_hash=${QUERY_HASH_FOLLOWERS}&variables=${encodeURIComponent(
			JSON.stringify(variables)
		)}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			const edgeFollowedBy = data.data.user.edge_followed_by;
			
			// Get total count from the first response
			if (totalCount === null) {
				totalCount = edgeFollowedBy.count;
			}

			const edges = edgeFollowedBy.edges;
			hasNext = edgeFollowedBy.page_info.has_next_page;
			after = edgeFollowedBy.page_info.end_cursor;

			const newFollowers = edges.map(({ node }: { node: IGUserProfile }) => ({
				id: node.id,
				username: node.username,
				full_name: node.full_name,
				profile_pic_url: node.profile_pic_url,
				is_verified: node.is_verified
			}));

			followers.push(...newFollowers);

			// Update progress based on current followers count and total
			if (progressCallback && totalCount) {
				progressCallback(followers.length, totalCount);
			}
		} catch (error) {
			console.error('Error fetching followers:', error);
			break;
		}
	}

	return followers;
}

/**
 * Fetch following with pagination and accurate progress
 */
export async function fetchFollowing(
	userId: number,
	progressCallback?: (current: number, total: number) => void
): Promise<IgUserPreview[]> {
	const following: IgUserPreview[] = [];
	let after: string | null = null;
	let hasNext = true;
	let totalCount: number | null = null;

	while (hasNext) {
		const variables = {
			id: userId,
			include_reel: true,
			fetch_mutual: true,
			first: FETCH_FOLLOWING_BATCH_SIZE,
			after: after
		};

		const url: string = `https://www.instagram.com/graphql/query/?query_hash=${QUERY_HASH_FOLLOWING}&variables=${encodeURIComponent(
			JSON.stringify(variables)
		)}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			const edgeFollow = data.data.user.edge_follow;
			
			// Get total count from the first response
			if (totalCount === null) {
				totalCount = edgeFollow.count;
			}

			const edges = edgeFollow.edges;
			hasNext = edgeFollow.page_info.has_next_page;
			after = edgeFollow.page_info.end_cursor;

			const newFollowing = edges.map(({ node }: { node: IGUserProfile }) => ({
				id: node.id,
				username: node.username,
				full_name: node.full_name,
				profile_pic_url: node.profile_pic_url,
				is_verified: node.is_verified
			}));

			following.push(...newFollowing);

			// Update progress based on current following count and total
			if (progressCallback && totalCount) {
				progressCallback(following.length, totalCount);
			}
		} catch (error) {
			console.error('Error fetching following:', error);
			break;
		}
	}

	return following;
}