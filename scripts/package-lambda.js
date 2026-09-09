const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const lambdaDir = path.join(rootDir, 'lib');
const artifactPath = path.join(buildDir, 'sweatyBundle.zip');

fs.mkdirSync(buildDir, { recursive: true });

const lambdaFiles = [
  'index.js',
  'sweaty.js',
  'weatherGetter.js',
  'package.json',
  'package-lock.json'
];

for (const file of lambdaFiles) {
  const source = path.join(lambdaDir, file);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing required Lambda file: ${file}`);
  }
}

const zipCommand = `cd "${lambdaDir}" && zip -r "${artifactPath}" ${lambdaFiles.join(
  ' '
)}`;

try {
  execSync(zipCommand, { stdio: 'inherit' });
  console.log(`Lambda bundle created at ${artifactPath}`);
} catch (error) {
  console.error(
    'Failed to create Lambda bundle. Ensure the zip utility is installed.'
  );
  throw error;
}
