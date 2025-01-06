import type { IgUser } from '$lib/instagram_models';
import { type DataExport, ExportFileTypes } from '$lib/models';
import YAML from 'yaml';

export function exportFile(userId: number, username: string, followers: IgUser[], following: IgUser[], exportAs: ExportFileTypes = ExportFileTypes.json) {
	const exportObject: DataExport = {
		followers,
		following,
		metadata: {
			userId,
			username,
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
	if (type === ExportFileTypes.json) {
		const jsonString = JSON.stringify(obj, null, 2);
		return new Blob([jsonString], { type: 'application/json' });
	} else if (type === ExportFileTypes.yaml) {
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