#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando Sistema de Clínica Estética...\n');

// Limpar cache
console.log('🧹 Limpando cache...');
const nextDir = path.join(__dirname, '../.next');
const tsconfigBuild = path.join(__dirname, '../tsconfig.tsbuildinfo');

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('✅ Cache .next removido');
}

if (fs.existsSync(tsconfigBuild)) {
  fs.unlinkSync(tsconfigBuild);
  console.log('✅ tsconfig.tsbuildinfo removido');
}

console.log('\n🔧 Iniciando servidor de desenvolvimento...\n');

// Iniciar Next.js
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

nextProcess.on('close', (code) => {
  console.log(`\n🛑 Servidor encerrado com código ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit(0);
});