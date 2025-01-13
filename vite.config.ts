import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
// import { transformSync } from 'esbuild';
// import path from 'path';
// import fs from 'fs';

// const workersFileRegex = /[\\/]static[\\/]workers[\\/].*\.ts$/;

// function workersTranspilePlugin() {
//   return {
//     name: 'workers-transpile-plugin',
//     async transform(src: string, id: string) {
//       if (workersFileRegex.test(id)) {
//         try {
//           const result = transformSync(src, {
//             loader: 'ts',
//             format: 'esm',
//           });

//           const relativePath = path.relative(process.cwd(), id);
//           const outputPath = relativePath.replace(/\.ts$/, '.js');
          
//           const outputDir = path.dirname(outputPath);
//           if (!fs.existsSync(outputDir)) {
//             fs.mkdirSync(outputDir, { recursive: true });
//           }

//           fs.writeFileSync(outputPath, result.code);
          
//           return {
//             code: '',
//             map: null
//           };
//         } catch (error) {
//           console.error('Error transforming worker file:', error);
//           return null;
//         }
//       }
//     }
//   };
// }

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({ compiler: 'svelte' }),
    // workersTranspilePlugin()
  ]
});