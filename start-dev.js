import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Apollo247 Clone - Separated Architecture');
console.log('📱 Frontend: http://localhost:5173');
console.log('🔗 Backend: http://localhost:5000');
console.log('─'.repeat(50));

// Start backend server
const backend = spawn('tsx', ['server/index.ts'], {
  cwd: __dirname,
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Start frontend dev server
const frontend = spawn('vite', [], {
  cwd: join(__dirname, 'client'),
  stdio: 'pipe'
});

// Handle backend output
backend.stdout.on('data', (data) => {
  console.log(`[BACKEND] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[BACKEND ERROR] ${data.toString().trim()}`);
});

// Handle frontend output
frontend.stdout.on('data', (data) => {
  console.log(`[FRONTEND] ${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`[FRONTEND ERROR] ${data.toString().trim()}`);
});

// Handle process termination
const cleanup = () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

backend.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
  frontend.kill();
});

frontend.on('close', (code) => {
  console.log(`Frontend server exited with code ${code}`);
  backend.kill();
});