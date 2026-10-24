import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const REMOTE_URL = 'https://github.com/RenegedKrl/pinaskit.git';
const REPO_DIR = path.resolve('.');

async function getCredentials() {
  return new Promise((resolve, reject) => {
    const p = spawn('G:\\Programas\\git\\ucrt64\\libexec\\git-core\\git-credential-wincred.exe', ['get']);
    p.stdin.write('protocol=https\nhost=github.com\n\n');
    let out = '';
    p.stdout.on('data', d => out += d.toString());
    p.on('close', code => {
      const lines = out.split('\n');
      let username = '';
      let password = '';
      for (const line of lines) {
        if (line.startsWith('username=')) username = line.replace('username=', '').trim();
        if (line.startsWith('password=')) password = line.replace('password=', '').trim();
      }
      if (username && password) {
        resolve({ username, password });
      } else {
        reject(new Error('Credenciais do GitHub não encontradas no Windows Credential Manager.'));
      }
    });
    p.on('error', reject);
  });
}

function getAllFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === '.git' || file === 'node_modules' || file.startsWith('.chrome-profile')) continue;
    const filePath = path.join(dir, file);
    const relPath = path.join(base, file).replace(/\\/g, '/');
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, relPath));
    } else {
      results.push(relPath);
    }
  }
  return results;
}

async function runPush() {
  console.log('🚀 Iniciando processo de envio para o GitHub...');
  console.log('📁 Repositório local:', REPO_DIR);
  console.log('🌐 Repositório remoto:', REMOTE_URL);

  const creds = await getCredentials();
  console.log(`👤 Autenticado como: ${creds.username}`);

  // 1. Inicializar repositório Git se necessário
  try {
    await git.init({ fs, dir: REPO_DIR, defaultBranch: 'main' });
    console.log('✅ Repositório Git inicializado com branch padrão "main".');
  } catch (e) {
    console.log('ℹ️ Repositório Git já existe ou inicializado:', e.message);
  }

  // 2. Adicionar arquivos
  const files = getAllFiles(REPO_DIR);
  console.log(`📦 Adicionando ${files.length} arquivos ao controle de versão...`);
  for (const file of files) {
    await git.add({ fs, dir: REPO_DIR, filepath: file });
  }
  console.log('✅ Todos os arquivos foram preparados (staged).');

  // 3. Criar commit
  console.log('💾 Criando commit oficial...');
  const commitId = await git.commit({
    fs,
    dir: REPO_DIR,
    message: 'fix: Ocultacao de badges de temperatura para visitantes no formulario e previews, mantendo classificacao restrita ao CRM',
    author: {
      name: creds.username,
      email: 'kaue.kfd63@gmail.com'
    }
  });
  console.log(`✅ Commit criado com sucesso: ${commitId}`);

  // 4. Configurar Remote Origin
  try {
    await git.addRemote({
      fs,
      dir: REPO_DIR,
      remote: 'origin',
      url: REMOTE_URL,
      force: true
    });
    console.log(`✅ Remote origin configurado: ${REMOTE_URL}`);
  } catch (e) {
    console.log('ℹ️ Remote origin já configurado.');
  }

  // 5. Enviar (Push) para o GitHub
  console.log('📤 Enviando arquivos para a branch main no GitHub...');
  const pushResult = await git.push({
    fs,
    http,
    dir: REPO_DIR,
    remote: 'origin',
    ref: 'main',
    remoteRef: 'refs/heads/main',
    force: true,
    onAuth: () => ({
      username: creds.username,
      password: creds.password
    })
  });

  console.log('🎉 Push concluído com sucesso!', JSON.stringify(pushResult, null, 2));
  console.log(`🔗 Acesse seu projeto em: https://github.com/RenegedKrl/pinaskit`);
}

runPush().catch(err => {
  console.error('❌ Falha ao enviar para o GitHub:', err);
  process.exit(1);
});
