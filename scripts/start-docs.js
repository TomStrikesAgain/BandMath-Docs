const { spawn } = require('child_process');
const path = require('path');

// Parse port (default 3002) and ignore legacy Docusaurus flags like --no-open
const args = process.argv.slice(2);
let port = '3002';
for (let i = 0; i < args.length; i++) {
  if ((args[i] === '--port' || args[i] === '-p') && args[i + 1]) {
    port = args[i + 1];
    i++;
  }
}

const nextBin = path.resolve(__dirname, '../node_modules/.bin/next');
const child = spawn(nextBin, ['dev', '--webpack', '-p', port], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  env: { ...process.env, PORT: port },
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
