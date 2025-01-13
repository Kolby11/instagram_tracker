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
 * Fetch followers with pagination (50 per batch)
 */
export async function fetchFollowers(
	userId: number,
	progressCallback?: (progress: number) => void
): Promise<IgUserPreview[]> {
	const followers: IgUserPreview[] = [];
	let after: string | null = null;
	let hasNext = true;
	let batchCount = 0;

	while (hasNext) {
		const variables = {
			id: userId,
			include_reel: true,
			fetch_mutual: true,
			first: 50,
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
			const edges = data.data.user.edge_followed_by.edges;

			hasNext = data.data.user.edge_followed_by.page_info.has_next_page;
			after = data.data.user.edge_followed_by.page_info.end_cursor;

			const newFollowers = edges.map(({ node }: {node: IGUserProfile}) => ({
				id: node.id,
				username: node.username,
				full_name: node.full_name,
				profile_pic_url: node.profile_pic_url,
				is_verified: node.is_verified
			}));

			followers.push(...newFollowers);
			batchCount++;

			// Update progress with batch count
			if (progressCallback) {
				progressCallback(batchCount);
			}
		} catch (error) {
			console.error('Error fetching followers:', error);
			break;
		}
	}

	console.log('[fetchFollowers] Total followers:', followers.length);
	return followers;
}

/**
 * Fetch following with pagination (50 per batch)
 */
export async function fetchFollowing(
	userId: number,
	progressCallback?: (progress: number) => void
): Promise<IgUserPreview[]> {
	const following: IgUserPreview[] = [];
	let after: string | null = null;
	let hasNext = true;
	let batchCount = 0;

	while (hasNext) {
		const variables = {
			id: userId,
			include_reel: true,
			fetch_mutual: true,
			first: 50,
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
			const edges = data.data.user.edge_follow.edges;

			hasNext = data.data.user.edge_follow.page_info.has_next_page;
			after = data.data.user.edge_follow.page_info.end_cursor;

			const newFollowing = edges.map(({ node }: {node: IGUserProfile}) => ({
				id: node.id,
				username: node.username,
				full_name: node.full_name,
				profile_pic_url: node.profile_pic_url,
				is_verified: node.is_verified
			}));

			following.push(...newFollowing);
			batchCount++;

			// Update progress with batch count
			if (progressCallback) {
				progressCallback(batchCount);
			}
		} catch (error) {
			console.error('Error fetching following:', error);
			break;
		}
	}

	console.log('[fetchFollowing] Total following:', following.length);
	return following;
}
