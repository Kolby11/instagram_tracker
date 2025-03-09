import type { ExportData } from "$lib/types/exportTypes";
import type { UserData, UserPreview } from "$lib/types/userTypes";
import { derived, get, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import { diffProfile, findDifferences, parseIgUserPreviews, parseIgUserProfile } from "$lib/utils/users";
import { MAX_FETCHABLE_COUNT, MAX_STORED_USERS } from "$lib/data";
import { fetchFollowers, fetchFollowing, fetchUserProfile } from "$lib/utils/instagramApi";

// Initialize stores
export const userDataStore: Writable<UserData> = writable({});
export const loadingStateStore = writable({
  isLoading: false,
  followersProgress: 0,
  followingProgress: 0,
  error: null as string | null,
  limitations: {
    followersExceeded: false,
    followingExceeded: false
  }
});

export const totalProgressStore = derived(
  loadingStateStore,
  $state => Math.floor(($state.followersProgress + $state.followingProgress) / 2)
);

function updateProgress(type: 'followers' | 'following', progress: number) {
  loadingStateStore.update(state => ({
    ...state,
    [`${type}Progress`]: progress * 100
  }));
}

export async function fetchUserData(userId: number): Promise<void> {
  loadingStateStore.set({
    isLoading: true,
    followersProgress: 0,
    followingProgress: 0,
    error: null,
    limitations: {
      followersExceeded: false,
      followingExceeded: false
    }
  });

  try {
    // Fetch user profile first
    const userProfile = await fetchUserProfile(userId);
    if (!userProfile) {
      throw new Error('Failed to fetch user profile');
    }

    // Check follower/following counts
    const followersCount = userProfile.follower_count;
    const followingCount = userProfile.following_count;
    
    const limitations = {
      followersExceeded: followersCount > MAX_FETCHABLE_COUNT,
      followingExceeded: followingCount > MAX_FETCHABLE_COUNT
    };

    // Update limitations in store
    loadingStateStore.update(state => ({
      ...state,
      limitations
    }));

    // Update user profile in store
    userDataStore.update(state => ({
      ...state,
      userId,
      profile: parseIgUserProfile(userProfile)
    }));

    // If both exceed limits, throw error
    if (limitations.followersExceeded && limitations.followingExceeded) {
      throw new Error(
        `This account has too many connections (${followersCount.toLocaleString()} followers, ${followingCount.toLocaleString()} following). To prevent excessive requests, we can only analyze accounts with fewer than ${MAX_FETCHABLE_COUNT.toLocaleString()} followers and following.`
      );
    }

    // Fetch only what's within limits
    let followers: UserPreview[] = [];
    let following: UserPreview[] = [];
    
    if (!limitations.followersExceeded) {
      const followerData = await fetchFollowers(userId, (current, total) => {
        const progress = total > 0 ? (current / total) : 0;
        updateProgress('followers', progress);
      });
      followers = parseIgUserPreviews(followerData);
    } else {
      updateProgress('followers', 1); // Mark as complete
    }

    if (!limitations.followingExceeded) {
      const followingData = await fetchFollowing(userId, (current, total) => {
        const progress = total > 0 ? (current / total) : 0;
        updateProgress('following', progress);
      });
      following = parseIgUserPreviews(followingData);
    } else {
      updateProgress('following', 1); // Mark as complete
    }

    userDataStore.update(state => ({
      ...state,
      followers,
      following,
      appMetadata: {
        latestDataRefresh: new Date()
      },
    }));

    // Save to localStorage
    if (browser) {
      saveUserDataToLocalStorage(get(userDataStore));
    }
  } catch (error) {
    loadingStateStore.update(state => ({
      ...state,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }));
  } finally {
    loadingStateStore.update(state => ({
      ...state,
      isLoading: false,
      followersProgress: 100,
      followingProgress: 100
    }));
  }
}
export function saveUserDataToLocalStorage(userData: UserData): void {
  if (!browser || !userData.userId) return;

  const savedUserIdsLocal = localStorage.getItem("savedUserIds");
  const savedUserIds: string[] = savedUserIdsLocal ? JSON.parse(savedUserIdsLocal) : [];
  
  // Save the current user data
  localStorage.setItem(userData.userId.toString(), JSON.stringify(userData));
  
  // If user already exists in the list, remove it (to move it to front later)
  const existingIndex = savedUserIds.indexOf(userData.userId.toString());
  if (existingIndex !== -1) {
    savedUserIds.splice(existingIndex, 1);
  }
  
  // Add new userId to the front of the list
  savedUserIds.unshift(userData.userId.toString());
  
  // If we exceed MAX_STORED_USERS, remove the oldest entry
  if (savedUserIds.length > MAX_STORED_USERS) {
    const oldestUserId = savedUserIds.pop();
    if (oldestUserId) {
      localStorage.removeItem(oldestUserId);
    }
  }
  
  // Update the saved user IDs list
  localStorage.setItem("savedUserIds", JSON.stringify(savedUserIds));
}

export function loadUserDataFromLocalStorage(userId: number): void {
  if (!browser) return;

  const userData = localStorage.getItem(userId.toString());
  userDataStore.set(userData ? JSON.parse(userData) : {});
}

export function importDataIntoUserStore(
  userDataStore: Writable<UserData>,
  data: ExportData
): void {
  userDataStore.update((oldData) => {
    const updatedValue = structuredClone(oldData);

    // Ensure we have a history object
    if (!updatedValue.history) {
      updatedValue.history = {
        initialState: structuredClone(data.initialState ?? {}),
        latestState: structuredClone(data.latestState ?? {}),
        records: data.records ? [...data.records] : [],
      };
    } else {
      if (!updatedValue.history.initialState) {
        updatedValue.history.initialState = structuredClone(data.initialState ?? {});
      }

      // Merge any imported records
      updatedValue.history.records = [
        ...updatedValue.history.records,
        ...(data.records ?? []),
      ];
    }

    // 3) Compare oldLatest vs. the new (imported) latestState
    const oldLatest = updatedValue.history.latestState ?? {};
    const newLatest = data.latestState || data.initialState;

    // ---- NEW SECTION: Skip the diff if oldLatest has no data ----
    if (
      (!oldLatest.followers || oldLatest.followers.length === 0) &&
      (!oldLatest.following || oldLatest.following.length === 0)
    ) {
      // Just update latestState, no record
      updatedValue.history.latestState = structuredClone(newLatest);
      return updatedValue; // <-- This returns early, skipping the diff logic below
    }
    // --------------------------------------------------------------

    // Followers / following arrays
    const newFollowers = findDifferences(newLatest.followers ?? [], oldLatest.followers ?? []);
    const unfollowers = findDifferences(oldLatest.followers ?? [], newLatest.followers ?? []);
    const newFollowing = findDifferences(newLatest.following ?? [], oldLatest.following ?? []);
    const iUnfollowed = findDifferences(oldLatest.following ?? [], newLatest.following ?? []);

    // Compare profiles
    const profileDiff = diffProfile(newLatest.profile, oldLatest.profile);

    // 4) Build the diff record if changes exist
    const diff: Record<string, unknown> = {};
    if (profileDiff) diff.profile = profileDiff;
    if (newFollowers.length) diff.newFollowers = newFollowers;
    if (unfollowers.length) diff.unfollowers = unfollowers;
    if (newFollowing.length) diff.newFollowing = newFollowing;
    if (iUnfollowed.length) diff.iUnfollowed = iUnfollowed;

    if (Object.keys(diff).length > 0) {
      updatedValue.history.records.push({
        diff,
        timestamp: new Date(),
      });
    }

    // 5) Overwrite old `latestState` with the new import snapshot
    updatedValue.history.latestState = structuredClone(newLatest);

    return updatedValue;
  });
}


// Only set up the subscription if we're in the browser
if (browser) {
  let isUpdating = false;

  userDataStore.subscribe((currentValue) => {
    // Prevent recursive updates
    if (isUpdating || !currentValue) return;

    try {
      isUpdating = true;
      const updatedValue = structuredClone(currentValue);

      const currentFollowers = updatedValue.followers ?? [];
      const currentFollowing = updatedValue.following ?? [];

      // Recalculate helper arrays
      updatedValue.notFollowingMeBack = currentFollowers.filter(
        (follower) => !currentFollowing.some((f) => f.id === follower.id)
      );

      updatedValue.iDontFollowBack = currentFollowing.filter(
        (following) => !currentFollowers.some((f) => f.id === following.id)
      );


      // Update currentDiff by comparing top-level data to history.latestState
      if (updatedValue.history?.latestState) {
        const latestState = updatedValue.history.latestState;

        const newFollowers = findDifferences(currentFollowers, latestState.followers ?? []);
        const unfollowers = findDifferences(latestState.followers ?? [], currentFollowers);
        const newFollowing = findDifferences(currentFollowing, latestState.following ?? []);
        const iUnfollowed = findDifferences(latestState.following ?? [], currentFollowing);
        const profileDiff = diffProfile(updatedValue.profile, latestState.profile);

        const currentDiff: Record<string, unknown> = {};
        if (profileDiff) {
          currentDiff.profile = profileDiff;
        }
        if (newFollowers.length) {
          currentDiff.newFollowers = newFollowers;
        }
        if (unfollowers.length) {
          currentDiff.unfollowers = unfollowers;
        }
        if (newFollowing.length) {
          currentDiff.newFollowing = newFollowing;
        }
        if (iUnfollowed.length) {
          currentDiff.iUnfollowed = iUnfollowed;
        }

        // Compare to existing updatedValue.currentDiff
        const oldCurrentDiffStr = JSON.stringify(updatedValue.currentDiff);
        const newCurrentDiffStr = JSON.stringify(currentDiff);

        // Only update if it changed
        if (newCurrentDiffStr !== oldCurrentDiffStr) {
          updatedValue.currentDiff =
            Object.keys(currentDiff).length > 0 ? currentDiff : undefined;
        }
      }

      // Only update the store if something changed
      if (JSON.stringify(currentValue) !== JSON.stringify(updatedValue)) {
        userDataStore.set(updatedValue);
        // Save to local storage
        saveUserDataToLocalStorage(updatedValue);
      }
    } finally {
      isUpdating = false;
    }
  });
}
