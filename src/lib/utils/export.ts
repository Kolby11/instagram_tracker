import { type ExportData, ExportFileTypes } from '$lib/types/exportTypes';
import type { UserData } from '$lib/types/userTypes';
import YAML from 'yaml';

export function exportFile(userData: UserData, exportAs: ExportFileTypes = ExportFileTypes.JSON) {
	if (!userData.userId) {
		console.error('Missing user ID to export');
		return;
	}

	const exportObject: ExportData = {
		profile: userData.profile,
		history: userData.history,
		followers: userData.followers || [],
		following: userData.following || [],
		metadata: {
			userId: userData.userId,
			username: userData.profile?.username || "",
			exportDate: new Date().toISOString()
		}
	};

	const blob = createBlobFromObject(exportObject, exportAs);

	if (!blob) {
		console.error('Could not create export blob');
		return;
	}

	downloadBlob(blob, `instagram_tracker_${new Date().toISOString().split('T')[0]}.${exportAs}`);
}

function createBlobFromObject(obj: unknown, type: ExportFileTypes): Blob | undefined {
	if (type === ExportFileTypes.JSON) {
		const jsonString = JSON.stringify(obj, null, 2);
		return new Blob([jsonString], { type: 'application/json' });
	} else if (type === ExportFileTypes.YAML) {
		const yamlString = YAML.stringify(obj);
		return new Blob([yamlString], { type: 'text/yaml' });
	}
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	
	setTimeout(() => {
		URL.revokeObjectURL(url);
	}, 1000);
}