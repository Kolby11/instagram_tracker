import type { DifferenceRecord, UserData} from "./userTypes";

export type ExportData = {
	initialState: UserData;
	latestState: UserData;
	records: DifferenceRecord[];
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