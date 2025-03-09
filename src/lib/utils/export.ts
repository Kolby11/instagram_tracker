
import { ExportFileTypes, type ExportData } from "$lib/types/exportTypes";
import type { UserData } from "$lib/types/userTypes";
import YAML from "yaml";
import { diffProfile, findDifferences } from "./users";


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
 * we embed them in `initialState` / `latestState` with any `records`
 */
function prepareForExport(userData: UserData): ExportData {
  if (!userData.userId) {
    throw new Error("User ID is required for export");
  }

  const currentState: UserData = {
    userId: userData.userId,
    profile: userData.profile,
    followers: userData.followers ?? [],
    following: userData.following ?? [],
  };

  // Ensure a history object exists
  if (!userData.history) {
    userData.history = {
      initialState: structuredClone(currentState),
      latestState: structuredClone(currentState),
      records: [],
    };
  }

  let hasPushedDiff = false;
  if (userData.currentDiff) {
    const lastRecord = userData.history.records.at(-1);
    const newDiffStr = JSON.stringify(userData.currentDiff);
    const lastDiffStr = lastRecord ? JSON.stringify(lastRecord.diff) : null;

    if (!lastRecord || newDiffStr !== lastDiffStr) {
      userData.history.records.push({
        diff: structuredClone(userData.currentDiff),
        timestamp: new Date(),
      });
    }

    userData.currentDiff = undefined;
    hasPushedDiff = true;
  }

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

  userData.history.latestState = structuredClone(currentState);

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
