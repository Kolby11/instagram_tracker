import type { UserData } from "$lib/types/userTypes";

export function needsDataRefresh(userData: UserData, newUsername: string,  refreshInterval: number): boolean {
  if(!userData.profile || userData.profile.username !== newUsername) return true;
  if (userData?.appMetadata?.latestDataRefresh) {
    return (Date.now() - new Date(userData.appMetadata.latestDataRefresh).getTime()) > refreshInterval * 1000 * 60 * 60 * 24;
  }
  return false;
}