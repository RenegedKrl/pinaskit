import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9338;
const PROFILE_DIR = path.resolve('.chrome-profile-test-suite2');
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

    // Navegar de fato para BASE_URL
    console.log(`🧭 Navegando para ${BASE_URL}...`);
    await send('Page.navigate', { url: BASE_URL });
    await new Promise(r => setTimeout(r, 2500));

    // --------------------------------------------------------------------------
    // TESTE 1: CARREGAMENTO INICIAL E INTEGRIDADE DO DOM
    // --------------------------------------------------------------------------
    console.log('\n📄 2. Verificando Carregamento Inicial do Site:');
    await setViewport(1280, 800, false);

    const currentUrl = await evalJs('window.location.href');
    assert(currentUrl.includes('localhost:3334'), 'URL carregada no navegador é http://localhost:3334');

    const pageTitle = await evalJs('document.title');
    assert(pageTitle.includes('Pinas Kit') && pageTitle.includes('Modelo D'), 'Título da página correto', pageTitle);

    const bodyTheme = await evalJs('document.body.getAttribute("data-theme")');
    assert(bodyTheme === 'light', 'Tema padrão inicial é Claro (light mode conforme Modelo D)');

    const heroTitle = await evalJs('document.querySelector(".pk-hero-title")?.innerText.trim()');
    assert(heroTitle === 'Seu negócio organizado e sem complicação.', 'Headline oficial do Hero renderizada com sucesso', heroTitle);

    const heroImgLoaded = await evalJs(`
      (() => {
        const img = document.getElementById("hero-human-avatar");
        return img && img.complete && img.naturalWidth > 0;
      })()
    `);
    assert(heroImgLoaded === true, 'Foto humana acolhedora do Hero carregou com sucesso no navegador');

    // --------------------------------------------------------------------------
    // TESTE 2: ALTERNÂNCIA DE TEMA CLARO / ESCURO
    // --------------------------------------------------------------------------
    console.log('\n🌓 3. Testando Alternância Instantânea de Tema (Dark / Light):');
    await evalJs('document.getElementById("btn-theme-toggle")?.click()');
    await new Promise(r => setTimeout(r, 400));
    const themeAfterClick = await evalJs('document.body.getAttribute("data-theme")');
    assert(themeAfterClick === 'dark', 'Tema alternado com sucesso para Dark Mode (#09090B)', themeAfterClick);

    const darkBgColor = await evalJs('getComputedStyle(document.body).backgroundColor');
    assert(darkBgColor === 'rgb(9, 9, 11)', 'CSS background em Dark Mode corresponde a #09090B (rgb(9, 9, 11))', darkBgColor);

    // Captura screenshot dark mode
    await takeScreenshot('dark-mode');

    // Retorna para tema claro
    await evalJs('document.getElementById("btn-theme-toggle")?.click()');
    await new Promise(r => setTimeout(r, 400));
    const themeReset = await evalJs('document.body.getAttribute("data-theme")');
    assert(themeReset === 'light', 'Tema retornado com sucesso para Light Mode', themeReset);

    // --------------------------------------------------------------------------
    // TESTE 3: INTERATIVIDADE DA LANDING PAGE (TABELA DE PREÇOS E FAQ)
    // --------------------------------------------------------------------------
    console.log('\n💰 4. Testando Alternância de Preços e Sanfona FAQ:');
    
    // Toggle de Preço Mensal/Anual
    const initialPrice = await evalJs('document.getElementById("price-card-amount")?.innerText.trim()');
    assert(initialPrice === 'R$ 41,58', 'Preço inicial no plano anual exibe R$ 41,58');

    await evalJs('document.getElementById("btn-toggle-billing")?.click()');
    await new Promise(r => setTimeout(r, 300));
    const monthlyPrice = await evalJs('document.getElementById("price-card-amount")?.innerText.trim()');
    assert(monthlyPrice === 'R$ 49,90', 'Alternado para faturamento mensal exibe R$ 49,90');

    // Retorna para anual
    await evalJs('document.getElementById("btn-toggle-billing")?.click()');
    await new Promise(r => setTimeout(r, 300));

    // FAQ Accordion
    const faqAnswerBefore = await evalJs('document.querySelector(".faq-answer")?.style.display');
    assert(faqAnswerBefore === 'none' || faqAnswerBefore === '', 'Item de FAQ inicia fechado por padrão');
    
    await evalJs('document.querySelector(".faq-item")?.click()');
    await new Promise(r => setTimeout(r, 300));
    const faqAnswerAfter = await evalJs('document.querySelector(".faq-answer")?.style.display');
    assert(faqAnswerAfter === 'block', 'Item de FAQ expande exibindo a resposta ao ser clicado');

    // Screenshot Landing Page Desktop
    await takeScreenshot('landing-desktop');

    // --------------------------------------------------------------------------
    // TESTE 4: FORMULÁRIO DE QUALIFICAÇÃO DINÂMICO ("CONTE SOBRE SEU MOMENTO")
    // --------------------------------------------------------------------------
    console.log('\n📝 5. Testando Abertura e Funcionamento do Formulário de Qualificação Roxo:');

    // Abrir o modal pelo botão "#top-btn-open-qual"
    await evalJs('document.getElementById("top-btn-open-qual")?.click()');
    await new Promise(r => setTimeout(r, 500));

    const modalVisible = await evalJs('document.getElementById("qualification-modal-overlay")?.classList.contains("is-active")');
    assert(modalVisible === true, 'Modal de Qualificação abre com transição suave e fundo escurecido');

    // Testar Dropdown Customizado (não-nativo)
    await evalJs('document.getElementById("custom-select-trigger")?.click()');
    await new Promise(r => setTimeout(r, 300));
    const dropdownOpened = await evalJs('document.getElementById("custom-select-menu")?.classList.contains("is-open")');
    assert(dropdownOpened === true, 'Dropdown customizado de opções abre ao ser clicado');

    // Clicar na 2ª opção ("Estou pensando em mudar de área")
    await evalJs(`
      const option = document.querySelectorAll('.pk-select-option')[1];
      option?.click();
    `);
    await new Promise(r => setTimeout(r, 300));

    const selectedOptionValue = await evalJs('document.getElementById("selected-moment-value")?.value');
    assert(selectedOptionValue === 'Estou pensando em mudar de área', 'Opção selecionada gravada no input oculto do formulário', selectedOptionValue);

    // Preencher campos de Nome, WhatsApp e Mensagem
    await evalJs(`
      (() => {
        const nameInput = document.getElementById("lead-name");
        const phoneInput = document.getElementById("lead-phone");
        const msgInput = document.getElementById("lead-goals");
        if (nameInput) nameInput.value = "Juliana Moreira - Teste QA";
        if (phoneInput) phoneInput.value = "11 99876-5432";
        if (msgInput) msgInput.value = "Quero organizar meus leads de Meta Ads e WhatsApp.";
      })()
    `);

    // Capturar screenshot do modal aberto e preenchido
    await takeScreenshot('qualification-modal');

    // Submeter o formulário disparando o evento de submit
    await evalJs(`
      (() => {
        const form = document.getElementById("qualification-form");
        if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));

    // Verificar se lead foi gravado no Storage do CRM com a chave oficial pk_leads
    const leadsInStorage = await evalJs('JSON.parse(localStorage.getItem("pk_leads") || "[]")');
    const newLead = leadsInStorage.find(l => l.name === 'Juliana Moreira - Teste QA');
    assert(newLead !== undefined, 'Novo lead qualificado foi persistido no CRM do cliente (pk_leads)');
    assert(newLead && newLead.temperature === 'Quente', 'Temperatura de qualificação calculada como "Quente" (+45 pontos)');

    // --------------------------------------------------------------------------
    // TESTE 5: DASHBOARD DO CRM (PAINEL DA MARIANA - MODELO D)
    // --------------------------------------------------------------------------
    console.log('\n📊 6. Testando Dashboard CRM (Modelo D):');

    // Alternar para a visão de Dashboard
    await evalJs('document.querySelector(\'.pk-demo-tab[data-view="dashboard"]\')?.click()');
    await new Promise(r => setTimeout(r, 600));

    const marianaGreeting = await evalJs('document.querySelector(".pk-dash-greeting")?.innerText.trim()');
    assert(marianaGreeting === 'Olá, Mariana! 👋', 'Saudação acolhedora "Olá, Mariana! 👋" renderizada', marianaGreeting);

    // Card de Onboarding (Progresso guiado)
    const onboardingText = await evalJs('document.querySelector(".pk-card-onboarding")?.innerText.includes("Seu início no Pinas Kit")');
    assert(onboardingText === true, 'Card de Início Guiado exibido com destaque');

    // Card de Próxima Ação Recomendada
    const nextActionCard = await evalJs('document.querySelector(".pk-card-next-action") !== null');
    assert(nextActionCard === true, 'Card de "Próxima Ação Recomendada" presente na tela');

    // 4 Métricas Principais
    const metricLeadsVal = await evalJs('document.querySelectorAll(".pk-metric-card .pk-metric-value")[0]?.innerText.trim()');
    assert(metricLeadsVal === '24', 'Métrica "Seus leads hoje" exibe 24');

    const metricConversas = await evalJs('document.querySelectorAll(".pk-metric-card .pk-metric-value")[1]?.innerText.trim()');
    assert(metricConversas === '8', 'Métrica "Conversas em andamento" exibe 8');

    const metricVendas = await evalJs('document.querySelectorAll(".pk-metric-card .pk-metric-value")[2]?.innerText.trim()');
    assert(metricVendas === '5', 'Métrica "Vendas este mês" exibe 5');

    const metricGasto = await evalJs('document.querySelectorAll(".pk-metric-card .pk-metric-value")[3]?.innerText.trim()');
    assert(metricGasto === 'R$ 120,00', 'Métrica "Investimento em anúncios" exibe R$ 120,00');

    // Verificar se o lead recém-criado está presente na lista de leads do CRM
    const hasNewLeadInCRM = await evalJs(`
      (() => {
        const text = document.querySelector(".pk-card[style*='padding: 28px']")?.innerText || '';
        return text.includes("Juliana Moreira - Teste QA");
      })()
    `);
    assert(hasNewLeadInCRM === true, 'Lead recém-criado (Juliana Moreira) aparece na lista do CRM');

    // Testar filtros por Etapa (Tabs do CRM)
    await evalJs('document.querySelector(\'button[data-filter="Novos"]\')?.click()');
    await new Promise(r => setTimeout(r, 400));
    const activeStageTab = await evalJs('document.querySelector(\'button[data-filter="Novos"]\')?.classList.contains("pk-btn-primary")');
    assert(activeStageTab === true, 'Filtro de etapa "Novos" ativado com estilo primário ativo');

    // Retorna para "Todos"
    await evalJs('document.querySelector(\'button[data-filter="Todos"]\')?.click()');
    await new Promise(r => setTimeout(r, 300));

    // Screenshot Dashboard Desktop
    await takeScreenshot('dashboard-desktop');

    // --------------------------------------------------------------------------
    // TESTE 6: MODAL DE CONEXÃO DE ANÚNCIOS (META & GOOGLE ADS)
    // --------------------------------------------------------------------------
    console.log('\n🔗 7. Testando Conexão de Contas de Anúncio (Meta Ads & Google Ads):');
    await evalJs('document.getElementById("btn-dash-connect-ads")?.click()');
    await new Promise(r => setTimeout(r, 500));

    const adsModalActive = await evalJs('document.getElementById("connect-ads-modal-overlay")?.classList.contains("is-active")');
    assert(adsModalActive === true, 'Modal de Conexão de Anúncios abriu corretamente');

    // Simular ativação do Google Ads
    await evalJs('document.getElementById("btn-toggle-google-connect")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const googleConnectedState = await evalJs('JSON.parse(localStorage.getItem("pk_ad_accounts") || "{}").google');
    assert(googleConnectedState === true, 'Conexão do Google Ads persistida em pk_ad_accounts');

    await takeScreenshot('connect-ads-modal');

    // Fechar modal de anúncios
    await evalJs('document.getElementById("btn-close-ads-modal")?.click()');
    await new Promise(r => setTimeout(r, 400));

    // --------------------------------------------------------------------------
    // TESTE 7: CONSTRUTOR NO-CODE DE PERGUNTAS DO FORMULÁRIO
    // --------------------------------------------------------------------------
    console.log('\n🛠️ 8. Testando Construtor Visual No-Code:');
    await evalJs('document.getElementById("top-btn-open-builder")?.click()');
    await new Promise(r => setTimeout(r, 500));

    const builderModalActive = await evalJs('document.getElementById("form-builder-modal-overlay")?.classList.contains("is-active")');
    assert(builderModalActive === true, 'Modal do Construtor No-Code abriu corretamente');

    // Modificar o título da pergunta
    await evalJs(`
      const input = document.getElementById("builder-question");
      if (input) input.value = "Qual é o seu objetivo com tráfego pago hoje?";
    `);

    // Adicionar uma nova opção
    await evalJs('document.getElementById("btn-add-builder-option")?.click()');
    await new Promise(r => setTimeout(r, 300));

    const optionRowsCount = await evalJs('document.querySelectorAll(".builder-option-row").length');
    assert(optionRowsCount === 5, 'Nova opção adicionada com sucesso no Construtor No-Code (total: 5 opções)');

    // Salvar configuração do formulário
    await evalJs(`
      (() => {
        const form = document.getElementById("form-builder-form");
        if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    const savedFormConfig = await evalJs('JSON.parse(localStorage.getItem("pk_form_config") || "{}")');
    assert(savedFormConfig.questionLabel === 'Qual é o seu objetivo com tráfego pago hoje?', 'Pergunta personalizada persistida em pk_form_config');

    await takeScreenshot('form-builder-modal');

    // --------------------------------------------------------------------------
    // TESTE 8: RESPONSIVIDADE MOBILE & BOTTOM NAVIGATION
    // --------------------------------------------------------------------------
    console.log('\n📱 9. Testando Responsividade Mobile (375x812 - iPhone):');
    await setViewport(375, 812, true);
    await new Promise(r => setTimeout(r, 600));

    const mobileBottomNavVisible = await evalJs(`
      (() => {
        const nav = document.getElementById("mobile-bottom-nav");
        return nav && getComputedStyle(nav).display !== "none";
      })()
    `);
    assert(mobileBottomNavVisible === true, 'Barra de navegação inferior mobile (Bottom Nav) é exibida em telas pequenas');

    // Verificar se não há overflow horizontal quebrado
    const hasHorizontalOverflow = await evalJs('document.documentElement.scrollWidth > document.documentElement.clientWidth');
    assert(hasHorizontalOverflow === false, 'Sem estouro de tela horizontal (sem barra de rolagem lateral indevida)');

    await takeScreenshot('mobile-dashboard');

  } catch (err) {
    console.error('🚨 Erro inesperado durante execução E2E:', err);
    testFails++;
    errorsFound.push({ test: 'Execução Geral E2E', detail: err.message });
  } finally {
    if (ws) ws.close();
    chrome.kill('SIGKILL');
    console.log('\n🛑 Google Chrome finalizado com segurança.');
  }

  // --------------------------------------------------------------------------
  // RELATÓRIO FINAL CONSOLIDADO
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 RELATÓRIO CONSOLIDADO: ${testPasses} PASSARAM | ${testFails} FALHAS`);
  console.log(`⚠️ ERROS DE CONSOLE CAPTURADOS: ${consoleErrors.length}`);
  console.log(`🚨 EXCEÇÕES NÃO TRATADAS: ${exceptions.length}`);
  console.log('================================================================');

  if (consoleErrors.length > 0) {
    console.log('\n⚠️ Lista de Erros no Console do Navegador:');
    consoleErrors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
  }

  if (errorsFound.length > 0) {
    console.error('\n🚨 Lista de Falhas nos Testes:');
    errorsFound.forEach((f, i) => console.error(`  ${i + 1}. [${f.test}] -> ${f.detail}`));
    process.exit(1);
  } else {
    console.log('\n✨ TODOS OS SISTEMAS E FUNÇÕES DO PINAS KIT FORAM TESTADOS E APROVADOS COM 100% DE SUCESSO!\n');
  }
}

runE2ETestSuite();
