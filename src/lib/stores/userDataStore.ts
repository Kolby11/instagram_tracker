import type { UserData, UserPreview } from "$lib/types/userTypes";
import { writable, type Writable } from "svelte/store";

export const userDataStore: Writable<UserData> = writable({});

/**
 * Utility to find items in `current` that are not in `previous` (by `id`).
 */
function findDifferences(
  current: UserPreview[] = [],
  previous: UserPreview[] = []
): UserPreview[] {
  return current.filter(
    (cur) => !previous.some((prev) => prev.id === cur.id)
  );
}

// Implement the history tracking logic

/**
 * Subscribe to the store; this callback fires whenever userDataStore changes.
 */
userDataStore.subscribe((value) => {
  if (!value.history) return;

  if (!value.history.latestState) {
    value.history.latestState = {
      userId: value.userId,
      profile: value.profile,
      followers: value.followers ?? [],
      following: value.following ?? []
    };

    // Update the store with this initial "latestState"
    userDataStore.set(value);
    return;
  }

  // We do have a latestState, so let's calculate changes
  const currentFollowers = value.followers ?? [];
  const currentFollowing = value.following ?? [];

  const latestFollowers = value.history.latestState.followers ?? [];
  const latestFollowing = value.history.latestState.following ?? [];

  const new_followers = findDifferences(currentFollowers, latestFollowers);
  const unfollowers = findDifferences(latestFollowers, currentFollowers);

  const new_following = findDifferences(currentFollowing, latestFollowing);
  const i_unfollowed = findDifferences(latestFollowing, currentFollowing);

  // You could optionally bail out if nothing changed:
  // if (
  //   !new_followers.length &&
  //   !unfollowers.length &&
  //   !new_following.length &&
  //   !i_unfollowed.length
  // ) {
  //   return;
  // }

  // Create a new record describing these changes
  const newHistoryRecord = {
    new_followers,
    unfollowers,
    i_unfollowed,
    new_following,
    timestamp: new Date()
  };

  // Ensure we have a records array
  value.history.records = value.history.records ?? [];
  value.history.records.push(newHistoryRecord);

  // Update the latestState to the new "current" data
  value.history.latestState = {
    userId: value.userId,
    profile: value.profile,
    followers: [...currentFollowers],
    following: [...currentFollowing]
  };

  // Finally, set the store so the new `history` and `latestState`
  // are recognized by Svelte (and possibly trigger another update).
  userDataStore.set(value);

  console.log("User history updated", value.history);
});

// function compareFollowers() {
//   if (!previousData?.followers || !$userDataStore.followers) return;

//   unfollowers = previousData.followers.filter(
//     (prevFollower) => !$userDataStore.followers?.some((currentFollower) => currentFollower.id === prevFollower.id)
//   );

//   newFollowers = $userDataStore.followers.filter(
//     (currentFollower) => !previousData?.followers.some((prevFollower) => prevFollower.id === currentFollower.id)
//   );
// }
