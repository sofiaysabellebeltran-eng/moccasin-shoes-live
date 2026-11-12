import { spawn } from 'child_process';
console.log('\n🚀 STARTING BACKEND (Port 3001)...');
const backend = spawn('node', ['server.js'], { stdio: 'inherit', shell: true });
console.log('🚀 STARTING FRONTEND (Vite)...\n');
const frontend = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
process.on('SIGINT', () => { backend.kill(); frontend.kill(); process.exit(); });
