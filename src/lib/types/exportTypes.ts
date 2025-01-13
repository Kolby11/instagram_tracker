import type { UserHistory, UserPreview, UserProfile } from "./userTypes";

export type ExportData = {
	profile?: UserProfile;
  history?: UserHistory;
	followers?: UserPreview[];
	following?: UserPreview[];
	metadata: ExportMetadata;
};

export enum ExportFileTypes {
	JSON = 'json',
	YAML = 'yaml'
}

type ExportMetadata = {
	userId: number;
	username: string;
	exportDate: string;
};