import type { IgUser } from '$lib/instagram_models';
import type { ExportJSON } from '$lib/models';

export function exportAsJSON(userId: number, username: string, followers: IgUser[], following: IgUser[]) {
	// 1) Build the export JSON object
	const exportObject: ExportJSON = {
		followers,
		following,
		metadata: {
			userId,
			username,
			exportDate: new Date().toISOString()
		}
	};

	// 2) Convert it to a JSON string
	const jsonString = JSON.stringify(exportObject, null, 2);

	// 3) Create a Blob from the JSON string
	const blob = new Blob([jsonString], { type: 'application/json' });

	// 4) Create a temporary Object URL
	const url = URL.createObjectURL(blob);

	// 5) Dynamically create an `<a>` element with the download attribute
	const link = document.createElement('a');
	link.href = url;
	link.download = `instagram_tracker_${new Date().toISOString().split('T')[0]}.json`;

	// 6) Programmatically click the link to trigger the download
	link.click();

	// 7) (Optional) Revoke the object URL after a short delay
	setTimeout(() => {
		URL.revokeObjectURL(url);
	}, 1000);
}
