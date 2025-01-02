import type { IgUser } from '$lib/instagram_models';

export type UserState = {
	userId?: number;
	username?: string;
	followers?: IgUser[];
	following?: IgUser[];
};

export const userState: UserState = $state({});
