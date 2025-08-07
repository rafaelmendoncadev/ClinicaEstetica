#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 REINICIALIZANDO SISTEMA COMPLETAMENTE...\n');

try {
  // 1. Parar processos
  console.log('🛑 Parando processos existentes...');
  try {
    execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
  } catch (e) {
    // Ignorar erro se não há processos
  }

  // 2. Limpar caches
  console.log('🧹 Limpando todos os caches...');
  const pathsToDelete = [
    path.join(__dirname, '../.next'),
    path.join(__dirname, '../node_modules/.cache'),
    path.join(__dirname, '../tsconfig.tsbuildinfo'),
  ];

  pathsToDelete.forEach(p => {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`✅ Removido: ${path.basename(p)}`);
    }
  });

  // 3. Aguardar um pouco
  console.log('⏳ Aguardando limpeza...');
  setTimeout(() => {
    startServer();
  }, 2000);

} catch (error) {
  console.error('❌ Erro durante limpeza:', error.message);
  process.exit(1);
}

function startServer() {
  try {
    // 4. Iniciar servidor
    console.log('🚀 Iniciando servidor limpo...\n');
    
    const nextProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: path.join(__dirname, '..')
    });

    // 5. Tratamento de sinais
    process.on('SIGINT', () => {
      console.log('\n🛑 Encerrando servidor...');
      nextProcess.kill('SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      nextProcess.kill('SIGTERM');
      process.exit(0);
    });

    nextProcess.on('close', (code) => {
      console.log(`\n🏁 Servidor encerrado com código ${code}`);
    });

  } catch (error) {
    console.error('❌ Erro durante inicialização do servidor:', error.message);
    process.exit(1);
  }
}