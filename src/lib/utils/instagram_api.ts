import type { UserPreview } from "$lib/models";

const IG_APP_ID = "936619743392459";
const HEADERS = { "x-ig-app-id": IG_APP_ID };
const CREDENTIALS = "include";

/**
 * Get the numeric user ID by username.
 */
export async function getUserId(username: string) {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
  try {
    const response = await fetch(url, {
      credentials: CREDENTIALS,
      headers: HEADERS,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // Data shape: { data: { user: { id: string, ... } } }
    const userId = parseInt(data?.data?.user?.id);
    console.log("[getUserId]", { username, userId });
    return userId;
  } catch (error) {
    console.error("Error in getUserId:", error);
    throw error;
  }
}

/**
 * Fetch all followers in batches of 25 per page.
 */
export async function getFollowers(userId: number): Promise<UserPreview[]> {
  let allFollowers: UserPreview[] = [];
  let nextMaxId: string | undefined = undefined;

  while (true) {
    // Build the URL with pagination parameters
    const url = new URL(
      `https://www.instagram.com/api/v1/friendships/${userId}/followers/`
    );
    url.searchParams.set("count", "100");
    if (nextMaxId) {
      url.searchParams.set("max_id", nextMaxId);
    }

    const response = await fetch(url.toString(), {
      credentials: CREDENTIALS,
      headers: HEADERS,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Accumulate the users
    const users = data?.users ?? [];
    console.log("[getFollowers] Fetched this batch:", users);
    allFollowers = [...allFollowers, ...users];

    // Check if there is another page
    if (data?.next_max_id) {
      nextMaxId = data.next_max_id;
    } else {
      break;
    }
  }

  console.log("[getFollowers] All followers for userId:", userId, allFollowers);
  return allFollowers;
}

/**
 * Fetch all following in batches of 200 per page.
 */
export async function getFollowing(userId: number): Promise<UserPreview[]> {
  let allFollowing: UserPreview[] = [];
  let nextMaxId: string | undefined = undefined;

  while (true) {
    // Build the URL with pagination parameters
    const url = new URL(
      `https://www.instagram.com/api/v1/friendships/${userId}/following/`
    );
    url.searchParams.set("count", "200");
    if (nextMaxId) {
      url.searchParams.set("max_id", nextMaxId);
    }

    const response = await fetch(url.toString(), {
      credentials: CREDENTIALS,
      headers: HEADERS,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Accumulate the users
    const users = data?.users ?? [];
    console.log("[getFollowing] Fetched this batch:", users);
    allFollowing = [...allFollowing, ...users];

    // Check if there is another page
    if (data?.next_max_id) {
      nextMaxId = data.next_max_id;
    } else {
      break;
    }
  }

  console.log("[getFollowing] All following for userId:", userId, allFollowing);
  return allFollowing;
}

/**
 * Returns the list of users you follow (following[]) who do NOT follow you back.
 */
export function getNotFollowingBack(
  followers: UserPreview[],
  following: UserPreview[]
): UserPreview[] {
  // Collect the IDs of everyone who follows you
  const followerIds = new Set(followers.map((f) => f.id));

  // From the list of people you follow, return those who do NOT appear in your followers
  const notFollowingBack = following.filter((f) => !followerIds.has(f.id));

  console.log("[getNotFollowingBack] Count:", notFollowingBack.length);
  console.log("[getNotFollowingBack] They are:", notFollowingBack);

  return notFollowingBack;
}
