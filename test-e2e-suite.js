import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9340;
const PROFILE_DIR = path.resolve('.chrome-profile-test-suite3');
const ARTIFACTS_DIR = "C:\\Users\\kauek\\.gemini\\antigravity-ide\\brain\\3bcbda3c-2bc9-4ee2-b1f0-89850af16dea";
const BASE_URL = "http://localhost:3334";

let testPasses = 0;
let testFails = 0;
const errorsFound = [];
const consoleErrors = [];
const exceptions = [];

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    testPasses++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}: ${detail}`);
    testFails++;
    errorsFound.push({ test: testName, detail });
  }
}

async function runE2ETestSuite() {
  console.log('\n================================================================');
  console.log('🧪 PINAS KIT v7.0 — BATERIA DE TESTES E2E NO GOOGLE CHROME REAL');
  console.log('================================================================\n');

  console.log('🌐 1. Inicializando Google Chrome Headless com porta CDP: ' + CDP_PORT);
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${PROFILE_DIR}`
  ]);

  await new Promise(r => setTimeout(r, 2500));

  let ws;

  try {
    const targetRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new`, { method: 'PUT' });
    const target = await targetRes.json();
    ws = new WebSocket(target.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
          consoleErrors.push(text);
          console.error(`  ⚠️ [BROWSER CONSOLE ERROR]: ${text}`);
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const text = msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || '');
        exceptions.push(text);
        console.error(`  🚨 [BROWSER UNCAUGHT EXCEPTION]: ${text}`);
      }
    };

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        pending.set(id, (res) => resolve(res.result));
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await new Promise(resolve => ws.onopen = resolve);

    // Habilitar protocolos CDP
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    const evalJs = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      return res?.result?.value;
    };

    const takeScreenshot = async (name) => {
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(data, 'base64');
      const localPath = path.resolve(`screenshot-${name}.png`);
      fs.writeFileSync(localPath, buffer);
      if (fs.existsSync(ARTIFACTS_DIR)) {
        fs.writeFileSync(path.join(ARTIFACTS_DIR, `screenshot-${name}.png`), buffer);
      }
      return localPath;
    };

    const setViewport = async (width, height, isMobile = false) => {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: isMobile
      });
    };

    // Navegar para BASE_URL
    console.log(`🧭 Navegando para ${BASE_URL}...`);
    await send('Page.navigate', { url: BASE_URL });
    await new Promise(r => setTimeout(r, 2500));

    // --------------------------------------------------------------------------
    // TESTE 1: CARREGAMENTO INICIAL
    // --------------------------------------------------------------------------
    console.log('\n📄 2. Verificando Carregamento Inicial do Site:');
    await setViewport(1280, 800, false);

    const currentUrl = await evalJs('window.location.href');
    assert(currentUrl.includes('localhost:3334'), 'URL carregada é http://localhost:3334');

    const pageTitle = await evalJs('document.title');
    assert(pageTitle.includes('Pinas Kit'), 'Título da página correto', pageTitle);

    const heroTitle = await evalJs('document.querySelector(".pk-hero-title")?.innerText.trim()');
    assert(heroTitle === 'Seu negócio organizado e sem complicação.', 'Headline do Hero renderizada com sucesso');

    // --------------------------------------------------------------------------
    // TESTE 2: BOTÃO "VER COMO FUNCIONA" -> MODAL DE VÍDEO TOUR
    // --------------------------------------------------------------------------
    console.log('\n🎥 3. Testando Botão "Ver como funciona" (Modal de Vídeo Tour):');
    await evalJs('document.getElementById("btn-hero-demo")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const videoModalActive = await evalJs('document.getElementById("video-tour-modal-overlay")?.classList.contains("is-active")');
    assert(videoModalActive === true, 'Botão "Ver como funciona" abre o Modal de Vídeo Tour explicativo');

    const qualModalOpenByMistake = await evalJs('document.getElementById("qualification-modal-overlay")?.classList.contains("is-active")');
    assert(qualModalOpenByMistake === false, 'Formulário de qualificação NÃO abre indevidamente no botão de vídeo');

    await takeScreenshot('video-tour');

    // Fechar modal de vídeo
    await evalJs('document.getElementById("btn-close-video-modal")?.click()');
    await new Promise(r => setTimeout(r, 300));

    // --------------------------------------------------------------------------
    // TESTE 3: SIMULAÇÃO NO SITE DO CLIENTE -> FORMULÁRIO DE QUALIFICAÇÃO
    // --------------------------------------------------------------------------
    console.log('\n📱 4. Testando Simulação do Botão no Site do Cliente:');
    await evalJs('document.getElementById("btn-mock-client-site-widget")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const qualModalActive = await evalJs('document.getElementById("qualification-modal-overlay")?.classList.contains("is-active")');
    assert(qualModalActive === true, 'Botão do site cliente abre o Formulário de Qualificação Roxo');

    // Fechar modal
    await evalJs('document.getElementById("btn-close-qual-modal")?.click()');
    await new Promise(r => setTimeout(r, 300));

    // --------------------------------------------------------------------------
    // TESTE 4: NAVEGAÇÃO PARA O PAINEL DO ASSINANTE (CENTRALKIT)
    // --------------------------------------------------------------------------
    console.log('\n📊 5. Testando Painel do Assinante (CentralKit):');
    await evalJs('document.querySelector(\'.pk-demo-tab[data-view="dashboard"]\')?.click()');
    await new Promise(r => setTimeout(r, 600));

    const greeting = await evalJs('document.querySelector(".pk-dash-greeting")?.innerText.trim()');
    assert(greeting === 'Olá, Mariana! 👋', 'Saudação "Olá, Mariana! 👋" renderizada na Visão Geral');

    // --------------------------------------------------------------------------
    // TESTE 5: ABA "BOTÕES" (GERENCIADOR DE SITES E PASTAS DE CAPTAÇÃO)
    // --------------------------------------------------------------------------
    console.log('\n🔘 6. Testando Módulo de Botões & Sites de Captação:');
    await evalJs('document.getElementById("side-nav-buttons")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const buttonsViewPresent = await evalJs('document.getElementById("buttons-view-container") !== null');
    assert(buttonsViewPresent === true, 'Aba "Botões" renderizada com sucesso');

    const buttonCardsCount = await evalJs('document.querySelectorAll(".btn-site-card").length');
    assert(buttonCardsCount >= 3, `Gerenciador exibe ${buttonCardsCount} botões ativos (Glúteo Feminino, Endolaser, Consulta Médica)`);

    const quotaText = await evalJs('document.querySelector(".pk-card")?.innerText.includes("Cota de Sites")');
    assert(quotaText === true, 'Indicador de cota do Plano Starter exibido com destaque');

    // Testar botão "Copiar Script" no primeiro botão
    await evalJs('document.querySelector(".btn-copy-script-action")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const copyModalActive = await evalJs('document.getElementById("copy-script-modal-overlay")?.classList.contains("is-active")');
    assert(copyModalActive === true, 'Botão "Copiar Script" abre modal com o código embed e link direto');

    await takeScreenshot('copy-script');

    // Fechar modal copiar script
    await evalJs('document.getElementById("btn-close-copy-modal")?.click()');
    await new Promise(r => setTimeout(r, 300));

    // Capturar screenshot da tela de botões
    await takeScreenshot('buttons-view');

    // --------------------------------------------------------------------------
    // TESTE 6: ABA "LEADS" (TABELA CENTRALKIT - IMAGEM 2)
    // --------------------------------------------------------------------------
    console.log('\n👥 7. Testando Base de Leads da CentralKit (Imagem 2):');
    await evalJs('document.getElementById("side-nav-leads")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const leadsTablePresent = await evalJs('document.getElementById("leads-view-container") !== null');
    assert(leadsTablePresent === true, 'Tela de Leads carregada com sucesso');

    const hasAnaLivia = await evalJs('document.body.innerText.includes("Ana Livia Pereira de Sousa Paulo")');
    assert(hasAnaLivia === true, 'Lead "Ana Livia" presente na tabela de contatos');

    const hasEndolaser = await evalJs('document.body.innerText.includes("Endolaser")');
    assert(hasEndolaser === true, 'Coluna "Botão" identifica a campanha de origem ("Endolaser")');

    // Testar filtro por Botão
    await evalJs(`
      const sel = document.getElementById("filter-lead-button");
      if (sel) {
        sel.value = "Glúteo Feminino";
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      }
    `);
    await new Promise(r => setTimeout(r, 400));

    const rowsCountAfterFilter = await evalJs('document.querySelectorAll(".pk-lead-table-row").length');
    assert(rowsCountAfterFilter >= 2, `Filtro por botão "Glúteo Feminino" retornou ${rowsCountAfterFilter} contatos`);

    // Resetar filtro para Todos
    await evalJs(`
      const sel = document.getElementById("filter-lead-button");
      if (sel) {
        sel.value = "Todos";
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      }
    `);
    await new Promise(r => setTimeout(r, 300));

    await takeScreenshot('leads-table');

    // --------------------------------------------------------------------------
    // TESTE 7: RESPONSIVIDADE MOBILE
    // --------------------------------------------------------------------------
    console.log('\n📱 8. Testando Responsividade Mobile (375x812):');
    await setViewport(375, 812, true);
    await new Promise(r => setTimeout(r, 500));

    const mobileNavVisible = await evalJs('document.getElementById("mobile-bottom-nav") !== null');
    assert(mobileNavVisible === true, 'Barra inferior de navegação mobile ativa');

    const hasOverflow = await evalJs('document.documentElement.scrollWidth > document.documentElement.clientWidth');
    assert(hasOverflow === false, 'Zero estouro de tela horizontal no mobile');

  } catch (err) {
    console.error('🚨 Erro inesperado no teste E2E:', err);
    testFails++;
    errorsFound.push({ test: 'E2E Chrome', detail: err.message });
  } finally {
    if (ws) ws.close();
    chrome.kill('SIGKILL');
    console.log('\n🛑 Google Chrome finalizado com segurança.');
  }

  // --------------------------------------------------------------------------
  // RELATÓRIO FINAL
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 RELATÓRIO FINAL E2E: ${testPasses} PASSARAM | ${testFails} FALHAS`);
  console.log(`⚠️ ERROS DE CONSOLE CAPTURADOS: ${consoleErrors.length}`);
  console.log(`🚨 EXCEÇÕES NÃO TRATADAS: ${exceptions.length}`);
  console.log('================================================================');

  if (errorsFound.length > 0) {
    console.error('\n🚨 Lista de Falhas nos Testes:');
    errorsFound.forEach((f, i) => console.error(`  ${i + 1}. [${f.test}] -> ${f.detail}`));
    process.exit(1);
  } else {
    console.log('\n✨ TODOS OS TESTES E2E NO CHROME PASSARAM COM SUCESSO!\n');
  }
}

runE2ETestSuite();
