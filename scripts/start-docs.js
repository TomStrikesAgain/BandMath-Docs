const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '..');

// Load environment variables from local or workspace .env files if present
const candidateEnvPaths = [
  path.join(rootDir, '.env.local'),
  path.join(rootDir, '.env'),
  path.resolve(rootDir, '../../tommares-portfolio/.env.local'),
  path.resolve(rootDir, '../BandMath-Backend/supabase/.env.local'),
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

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
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, PORT: port },
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
