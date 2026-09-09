const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const artifactPath = path.join(buildDir, 'sweatyBundle.zip');

fs.mkdirSync(buildDir, { recursive: true });

const requiredFiles = ['lib/index.js', 'lib/sweaty.js', 'lib/weatherGetter.js'];

for (const file of requiredFiles) {
  const source = path.join(rootDir, file);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing required Lambda file: ${file}`);
  }
}

const zipCommand = `cd "${rootDir}" && zip -r "${artifactPath}" lib node_modules package.json package-lock.json`;

try {
  execSync(zipCommand, { stdio: 'inherit' });
  console.log(`Lambda bundle created at ${artifactPath}`);
} catch (error) {
  console.error(
    'Failed to create Lambda bundle. Ensure the zip utility is installed.'
  );
  throw error;
}
