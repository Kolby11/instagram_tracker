import YAML from 'yaml';
import type { ExportData } from '$lib/types/exportTypes';

/**
 * Main importFile function using async/await.
 */
export async function importFile(file: File): Promise<ExportData | undefined> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // Wait for the file text to be fully read
  const content = await readFileAsText(file);

  let parsed: ExportData | undefined;
  if (extension === 'json') {
    parsed = JSON.parse(content);
  } else if (extension === 'yaml' || extension === 'yml') {
    parsed = YAML.parse(content);
  }

  console.log("Parsed file for:", parsed?.metadata.username)

  return parsed;
}

/**
 * Helper: Read the file as text, returning a Promise.
 */
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsText(file);
  });
}


