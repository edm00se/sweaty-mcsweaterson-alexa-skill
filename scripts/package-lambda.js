const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const stagingDir = path.join(buildDir, 'lambda-staging');
const artifactPath = path.join(buildDir, 'sweatyBundle.zip');

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

const requiredFiles = ['lib/index.js', 'lib/sweaty.js', 'lib/weatherGetter.js'];

for (const file of requiredFiles) {
  const source = path.join(rootDir, file);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing required Lambda file: ${file}`);
  }
}

fs.cpSync(path.join(rootDir, 'lib'), path.join(stagingDir, 'lib'), {
  recursive: true
});
fs.copyFileSync(
  path.join(rootDir, 'package.json'),
  path.join(stagingDir, 'package.json')
);
fs.copyFileSync(
  path.join(rootDir, 'package-lock.json'),
  path.join(stagingDir, 'package-lock.json')
);

try {
  execSync(`npm install --omit=dev --prefix "${stagingDir}"`, {
    stdio: 'inherit'
  });

  execSync(
    `cd "${stagingDir}" && zip -r "${artifactPath}" lib node_modules package.json package-lock.json`,
    {
      stdio: 'inherit'
    }
  );

  console.log(`Lambda bundle created at ${artifactPath}`);
} catch (error) {
  console.error(
    'Failed to create Lambda bundle. Ensure the zip utility is installed.'
  );
  throw error;
}
