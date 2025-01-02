import type { IgUser } from './instagram_models';

export type ExportJSON = {
	followers: IgUser[];
	following: IgUser[];
	metadata: ExportMetadata;
};

type ExportMetadata = {
	userId: number;
	username: string;
	exportDate: string;
};
