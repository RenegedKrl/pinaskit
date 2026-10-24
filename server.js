import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let PORT = parseInt(process.env.PORT, 10) || 3333;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];
  if (cleanUrl === '/') cleanUrl = '/index.html';

  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  // API de Leads para Integração Cross-Domain com embed.js
  if (cleanUrl === '/api/leads') {
    const leadsFile = path.join(__dirname, 'leads-data.json');
    if (req.method === 'GET') {
      let leads = [];
      if (fs.existsSync(leadsFile)) {
        try { leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8')); } catch (_) {}
      }
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(JSON.stringify(leads));
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const newLead = JSON.parse(body);
          let leads = [];
          if (fs.existsSync(leadsFile)) {
            try { leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8')); } catch (_) {}
          }
          leads.unshift(newLead);
          fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), 'utf8');
          console.log(`[Pinas Kit API] Novo Lead Recebido via Embed: ${newLead.name} (${newLead.button})`);
          res.writeHead(201, {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
          });
          return res.end(JSON.stringify({ success: true, lead: newLead }));
        } catch (err) {
          res.writeHead(400, {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
          });
          return res.end(JSON.stringify({ success: false, error: 'JSON inválido' }));
        }
      });
      return;
    }
  }

  let filePath = path.join(__dirname, cleanUrl);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'public', cleanUrl);
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Erro no servidor: ${err.code}`);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`\n🚀 Servidor Pinas Kit v7.0 ativo em: http://localhost:${portToTry}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Porta ${portToTry} ocupada, tentando ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Erro no servidor:', err);
    }
  });
}

startServer(PORT);
