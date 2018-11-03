const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os');
// npm binary based on OS
const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';
// lib path
const lib = path.resolve(__dirname, './lib/');

console.log('======');
console.log('-- installing lib deps --');

// ensure path has package.json
if (!fs.existsSync(path.join(lib, 'package.json'))) {
  console.log('-- no ./lib/package.json found --');
  process.exit(1);
  return;
}

// install folder
const installProc = cp.spawn(npmCmd, ['i'], {
  env: process.env,
  cwd: lib,
  stdio: 'inherit'
});
installProc.on('close', code => {
  if (code === 0) {
    console.log('-- done --');
    console.log('======');
    process.exit();
    return;
  } else {
    console.log(`-- problem installing lib deps, exited with ${code} --`);
    console.log('-- consult the output of the npm logs --');
    console.log('======');
    process.exit(code);
    return;
  }
});
