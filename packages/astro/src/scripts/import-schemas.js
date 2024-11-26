import schemaTools from '@nqminds/verifiable-schemas-toolchain';
import { readFileSync } from 'fs';
import { resolve as pathResolve } from 'path';

const configPath = pathResolve(process.cwd(), 'config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));
import { resolve as urlResolve } from 'url';

// Define constants with paths relative to execution location
const yamlFilePath = pathResolve(process.cwd(), '../schemas/src/taibom-schemas');
const outputDir = pathResolve(process.cwd(), 'src/content/docs/schemas');
const hedgedocServer = config.HEDGEDOC_SERVER;


const relativeGitPath = `git/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/contents/packages/schemas/src/`;
const path = urlResolve(hedgedocServer, relativeGitPath);
const selectedTheme = 'astro';
const addDataFiles = false;
const addFormLink = false;

console.log("PATH", path)
await schemaTools.generateDocusaurusFiles(yamlFilePath, outputDir, path, selectedTheme, path, addFormLink, addDataFiles);