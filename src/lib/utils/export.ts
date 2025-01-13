
import { ExportFileTypes, type ExportData } from "$lib/types/exportTypes";
import type { UserData } from "$lib/types/userTypes";
import YAML from "yaml";
import { diffProfile, findDifferences } from "./users";

// No longer needed in top-level export since we embed all data in initialState/latestState
// import type { Profile, Following, Followers }... etc.

export function exportFile(userData: UserData, exportAs: ExportFileTypes = ExportFileTypes.JSON) {
  if (!userData.userId) {
    console.error("Missing user ID to export");
    return;
  }

  try {
    const exportObject = prepareForExport(userData);
    const blob = createBlobFromObject(exportObject, exportAs);

    if (!blob) {
      console.error("Could not create export blob");
      return;
    }

    downloadBlob(blob, `instagram_tracker_${new Date().toISOString().split("T")[0]}.${exportAs}`);
  } catch (err) {
    console.error("Error preparing export:", err);
  }
}

function createBlobFromObject(obj: unknown, type: ExportFileTypes): Blob | undefined {
  if (type === ExportFileTypes.JSON) {
    const jsonString = JSON.stringify(obj, null, 2);
    return new Blob([jsonString], { type: "application/json" });
  } else if (type === ExportFileTypes.YAML) {
    const yamlString = YAML.stringify(obj);
    return new Blob([yamlString], { type: "text/yaml" });
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * prepareForExport
 *
 * Instead of putting `profile`, `followers`, and `following` at top level,
 * we embed them in `initialState` / `latestState` with any `records`, and
 * just add `metadata`.
 */
function prepareForExport(userData: UserData): ExportData {
  if (!userData.userId) {
    throw new Error("User ID is required for export");
  }

  // We treat the user's current data as the "current state"
  const currentState: UserData = {
    userId: userData.userId,
    profile: userData.profile,
    followers: userData.followers ?? [],
    following: userData.following ?? [],
    // notFollowingMeBack, iDontFollowBack, currentDiff, etc. can be included or omitted as you wish
  };

  // Ensure a history object exists
  if (!userData.history) {
    userData.history = {
      initialState: structuredClone(currentState),
      latestState: structuredClone(currentState),
      records: [],
    };
  }

  // (A) If there's a `currentDiff`, push it into `records` (avoid duplicates)
  let hasPushedDiff = false;
  if (userData.currentDiff) {
    const lastRecord = userData.history.records.at(-1);
    const newDiffStr = JSON.stringify(userData.currentDiff);
    const lastDiffStr = lastRecord ? JSON.stringify(lastRecord.diff) : null;

    // Only push if it's not identical to the last record's diff
    if (!lastRecord || newDiffStr !== lastDiffStr) {
      userData.history.records.push({
        diff: structuredClone(userData.currentDiff),
        timestamp: new Date(),
      });
    }

    // Clear it so we don't push again next time
    userData.currentDiff = undefined;
    hasPushedDiff = true;
  }

  // (B) If we did NOT push a currentDiff, check for new diffs vs. latestState
  if (!hasPushedDiff) {
    const latestState = userData.history.latestState ?? currentState;

    const newFollowers = findDifferences(currentState.followers, latestState.followers);
    const unfollowers = findDifferences(latestState.followers, currentState.followers);
    const newFollowing = findDifferences(currentState.following, latestState.following);
    const iUnfollowed = findDifferences(latestState.following, currentState.following);
    const profileDiff = diffProfile(currentState.profile, latestState.profile);

    // Build a new diff if we have changes
    const diff: Record<string, unknown> = {};
    if (profileDiff) diff.profile = profileDiff;
    if (newFollowers.length) diff.newFollowers = newFollowers;
    if (unfollowers.length) diff.unfollowers = unfollowers;
    if (newFollowing.length) diff.newFollowing = newFollowing;
    if (iUnfollowed.length) diff.iUnfollowed = iUnfollowed;

    if (Object.keys(diff).length > 0) {
      const lastRecord = userData.history.records.at(-1);
      const newDiffStr = JSON.stringify(diff);
      const lastDiffStr = lastRecord ? JSON.stringify(lastRecord.diff) : null;

      // Push only if different from the last record
      if (!lastRecord || newDiffStr !== lastDiffStr) {
        userData.history.records.push({
          diff,
          timestamp: new Date(),
        });
      }
    }
  }

  // (C) Update latestState to match the current "live" data
  userData.history.latestState = structuredClone(currentState);

  // (D) Return an ExportData object that has initialState, latestState, records, and metadata
  return {
    initialState: userData.history.initialState,
    latestState: userData.history.latestState,
    records: userData.history.records,
    metadata: {
      userId: userData.userId,
      username: userData.profile?.username ?? "",
      exportDate: new Date().toISOString(),
    },
  };
}
