import type { IgUser, IgUserPreview } from '$lib/instagram_models';

export function parseIgUserPreviews(users: IgUserPreview[]): IgUser[] {
	return users.map((u) => {
		return {
			id: u.id,
			username: u.username,
			is_private: u.is_private,
			profile_pic_url: u.profile_pic_url,
			is_verified: u.is_verified
		};
	});
}
