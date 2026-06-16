/** Force development mode for Vite dev server (avoids blank page / $RefreshSig$ errors). */
process.env.NODE_ENV = 'development';

const { spawn } = await import('node:child_process');
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node scripts/with-dev-env.mjs <command> [args...]');
  process.exit(1);
}

const child = spawn(args[0], args.slice(1), {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
