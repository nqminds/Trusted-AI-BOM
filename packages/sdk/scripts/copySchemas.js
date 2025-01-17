#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Determine the target directory (e.g., ~/.taibom)
const homeDir = os.homedir();
const targetDir = path.join(homeDir, '.taibom/schemas');

// Source directory (inside your package)
const sourceDir = path.join(__dirname, '../schemas');

// Copy directory function
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath); // Recursive copy
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Perform the copy
console.log(`Copying schemas to ${targetDir}...`);
try {
  copyDirectory(sourceDir, targetDir);
  console.log('Schemas copied successfully!');
} catch (error) {
  console.error('Failed to copy schemas:', error);
  process.exit(1);
}
