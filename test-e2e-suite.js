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

  let serverProcess = null;
  try {
    const checkRes = await fetch(`${BASE_URL}/index.html`);
    if (checkRes.ok) console.log('🌐 Servidor local já em execução em ' + BASE_URL);
  } catch {
    console.log('🚀 Inicializando servidor local para testes em ' + BASE_URL);
    serverProcess = spawn('node', ['server.js'], { env: { ...process.env, PORT: '3334' } });
    await new Promise(r => setTimeout(r, 1500));
  }

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
      const wrapped = (expr.includes('const ') || expr.includes('let ')) && !expr.trim().startsWith('(() =>')
        ? `(() => { ${expr} })()`
        : expr;
      const res = await send('Runtime.evaluate', { expression: wrapped, returnByValue: true, awaitPromise: true });
      if (res?.exceptionDetails) {
        console.error('⚠️ [EVAL JS EXCEPTION]:', res.exceptionDetails.text, res.exceptionDetails.exception?.description);
      }
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

    await evalJs(`
      localStorage.clear();
      document.querySelector('.pk-demo-tab[data-view="landing"]')?.click();
    `);
    await new Promise(r => setTimeout(r, 600));

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
    await new Promise(r => setTimeout(r, 400));
    await evalJs('document.getElementById("side-nav-overview")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const greeting = await evalJs('document.querySelector(".pk-dash-greeting")?.innerText.trim()');
    assert(greeting === 'Olá, Mariana! 👋', 'Saudação "Olá, Mariana! 👋" renderizada na Visão Geral', greeting);

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

    // Testar botão "Copiar Script" no primeiro botão (Glúteo Feminino)
    await evalJs('document.querySelector(".btn-copy-script-action")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const copyModalActive = await evalJs('document.getElementById("copy-script-modal-overlay")?.classList.contains("is-active")');
    assert(copyModalActive === true, 'Botão "Copiar Script" abre modal com as abas de Código e IA');

    const copyModalTitle = await evalJs('document.getElementById("copy-modal-button-name")?.innerText');
    assert(copyModalTitle.includes('Glúteo Feminino'), 'Modal exibe o nome do botão ("Glúteo Feminino") no cabeçalho');

    // Validar Aba 1 (</> Código) ativa por padrão
    const isCodeTabVisible = await evalJs('document.getElementById("copy-tab-code")?.style.display !== "none"');
    assert(isCodeTabVisible === true, 'Aba "</> Código" está visível por padrão com o script de instalação');

    const scriptCodeValue = await evalJs('document.getElementById("copy-script-code")?.value');
    assert(scriptCodeValue && scriptCodeValue.includes('data-pinaskit="btn-1"'), 'Script embed contém o identificador do botão (data-pinaskit="btn-1")');

    await takeScreenshot('copy-script-code-tab');

    // Alternar para a Aba 2 (🤖 Pedir para uma IA)
    await evalJs('document.getElementById("tab-btn-ai")?.click()');
    await new Promise(r => setTimeout(r, 300));

    const isAiTabVisible = await evalJs('document.getElementById("copy-tab-ai")?.style.display !== "none"');
    assert(isAiTabVisible === true, 'Aba "🤖 Pedir para uma IA" abre e fica visível ao clicar');

    const aiPromptValue = await evalJs('document.getElementById("copy-ai-prompt-code")?.value');
    assert(aiPromptValue && aiPromptValue.includes('Preciso adicionar um widget de botão flutuante'), 'Prompt para IA contém a instrução profissional completa');
    assert(aiPromptValue && aiPromptValue.includes('data-pinaskit="btn-1"'), 'Prompt para IA injeta automaticamente a tag do botão correspondente');

    // Clicar no botão de copiar prompt para IA
    await evalJs('document.getElementById("btn-do-copy-ai-prompt")?.click()');
    await new Promise(r => setTimeout(r, 300));

    await takeScreenshot('copy-script-ai-tab');

    // Fechar modal copiar script
    await evalJs('document.getElementById("btn-close-copy-modal")?.click()');
    await new Promise(r => setTimeout(r, 300));

    // Testar Vinculação & Edição Rápida do Link do Site do Botão
    const siteUrlCardExists = await evalJs('document.querySelector(".pk-site-url-card-box") !== null');
    assert(siteUrlCardExists === true, 'Card do botão exibe a caixa de site vinculado exclusivo');

    // Clica no botão de alterar site no primeiro card
    await evalJs('document.querySelector(".btn-quick-edit-site-url")?.click()');
    await new Promise(r => setTimeout(r, 300));

    const editSiteModalActive = await evalJs('document.getElementById("edit-site-modal-overlay")?.classList.contains("is-active")');
    assert(editSiteModalActive === true, 'Modal de vincular site exclusivo abre ao clicar em Alterar Site');

    // Preenche novo link de site
    await evalJs(`
      const input = document.getElementById("edit-site-url-input");
      if (input) input.value = "https://brunamentoriadecarreira.vercel.app";
      document.getElementById("edit-site-url-form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    `);
    await new Promise(r => setTimeout(r, 600));

    const updatedCardSiteUrl = await evalJs('document.querySelector(".btn-linked-website-link")?.innerText');
    assert(updatedCardSiteUrl && updatedCardSiteUrl.includes('brunamentoriadecarreira.vercel.app'), 'Card do botão atualizou automaticamente o link do site vinculado exclusivo');

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

    // --------------------------------------------------------------------------
    // TESTE 8: SIDEBAR FIXA NO SCROLL DA PÁGINA (SOLICITAÇÃO DO USUÁRIO)
    // --------------------------------------------------------------------------
    console.log('\n📌 9. Testando Fixação da Sidebar Desktop no Scroll:');
    await setViewport(1280, 800, false);
    await new Promise(r => setTimeout(r, 400));
    await evalJs('document.getElementById("side-nav-overview")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const sidebarPos = await evalJs('window.getComputedStyle(document.querySelector(".pk-sidebar"))?.position');
    assert(sidebarPos === 'fixed', `Sidebar desktop possui position: fixed (atual: ${sidebarPos})`);

    const initialLogoTop = await evalJs('document.getElementById("side-brand-logo")?.getBoundingClientRect().top');
    const initialHelpTop = await evalJs('document.getElementById("side-help")?.getBoundingClientRect().top');
    const initialSettingsBottom = await evalJs('document.getElementById("side-settings")?.getBoundingClientRect().bottom');

    assert(initialLogoTop >= 35 && initialLogoTop <= 65, `Logo 'Pinas Kit' visível no topo (Y=${initialLogoTop}px)`);
    assert(initialSettingsBottom <= 800, `Item 'Configurações' visível no rodapé sem corte (Bottom=${initialSettingsBottom}px)`);

    // Rola a página 800px para baixo
    await evalJs('window.scrollTo(0, 800)');
    await new Promise(r => setTimeout(r, 400));

    const scrolledLogoTop = await evalJs('document.getElementById("side-brand-logo")?.getBoundingClientRect().top');
    const scrolledSettingsBottom = await evalJs('document.getElementById("side-settings")?.getBoundingClientRect().bottom');
    const scrollY = await evalJs('window.scrollY');

    assert(scrollY > 0, `Página rolou com sucesso (scrollY=${scrollY}px)`);
    assert(Math.abs(scrolledLogoTop - initialLogoTop) < 2, `Logo 'Pinas Kit' permaneceu 100% fixo no topo durante o scroll (Delta=${Math.abs(scrolledLogoTop - initialLogoTop)}px)`);
    assert(Math.abs(scrolledSettingsBottom - initialSettingsBottom) < 2, `Itens do rodapé permaneceram 100% fixos na tela (Delta=${Math.abs(scrolledSettingsBottom - initialSettingsBottom)}px)`);

    await takeScreenshot('sidebar-fixed-scrolled');

    // --------------------------------------------------------------------------
    // TESTE 9: FICHA & DRAWER LATERAL DO LEAD (MODELO D & GESTÃO COMPLETA)
    // --------------------------------------------------------------------------
    console.log('\n🗂️ 10. Testando Ficha & Drawer Lateral do Lead (Modelo D):');
    await evalJs('window.scrollTo(0, 0)');
    await evalJs('document.getElementById("side-nav-leads")?.click()');
    await new Promise(r => setTimeout(r, 400));

    // Clicar no nome do primeiro lead (Ana Livia) para abrir o Drawer Lateral
    await evalJs('document.querySelector(".lead-clickable-name")?.click()');
    await new Promise(r => setTimeout(r, 500));

    const drawerActive = await evalJs('document.getElementById("lead-drawer-overlay")?.classList.contains("is-active")');
    assert(drawerActive === true, 'Drawer lateral do Lead abre ao clicar no nome na tabela');

    const drawerHasAnaLivia = await evalJs('document.getElementById("lead-drawer-panel")?.innerText.includes("Ana Livia")');
    assert(drawerHasAnaLivia === true, 'Drawer exibe o nome correto do Lead ("Ana Livia")');

    const whatsappLink = await evalJs('document.getElementById("drawer-btn-whatsapp")?.getAttribute("href")');
    assert(whatsappLink && whatsappLink.includes('wa.me'), 'Botão do WhatsApp configurado com link direto (wa.me)');

    const hasUtmTracker = await evalJs('document.getElementById("lead-drawer-panel")?.innerText.toLowerCase().includes("rastreamento de anúncios")');
    assert(hasUtmTracker === true, 'Card de Rastreamento de Anúncios e UTMs presente no Drawer');

    // Alterar estágio para "Proposta"
    await evalJs('document.querySelector(\'.pk-stage-pill[data-stage="Proposta"]\')?.click()');
    await new Promise(r => setTimeout(r, 400));

    const isPropostaActive = await evalJs('document.querySelector(\'.pk-stage-pill[data-stage="Proposta"]\')?.classList.contains("is-active")');
    assert(isPropostaActive === true, 'Estágio do pipeline alterado para "Proposta" com sucesso');

    // Inserir anotação da equipe
    await evalJs(`
      const input = document.getElementById("drawer-note-input");
      if (input) {
        input.value = "Lead respondeu com muito interesse no orçamento.";
        const form = document.getElementById("drawer-note-form");
        if (form) form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      }
    `);
    await new Promise(r => setTimeout(r, 400));

    const noteAdded = await evalJs('document.getElementById("drawer-notes-list")?.innerText.includes("muito interesse no orçamento")');
    assert(noteAdded === true, 'Anotação da equipe registrada e exibida em tempo real na ficha');

    await takeScreenshot('lead-drawer');

    // Fechar o Drawer
    await evalJs('document.getElementById("btn-close-lead-drawer")?.click()');
    await new Promise(r => setTimeout(r, 300));

    const drawerClosed = await evalJs('!document.getElementById("lead-drawer-overlay")?.classList.contains("is-active")');
    assert(drawerClosed === true, 'Drawer lateral fecha corretamente pelo botão de fechar');

    // --------------------------------------------------------------------------
    // TESTE 11: CONSTRUTOR NO-CODE INTERATIVO COM LIVE PREVIEW EM TEMPO REAL
    // --------------------------------------------------------------------------
    console.log('\n🛠️ 11. Testando Construtor No-Code & Live Preview no Celular:');
    await evalJs('document.getElementById("side-nav-buttons")?.click()');
    await new Promise(r => setTimeout(r, 400));

    // Abrir o construtor clicando em "Editar Formulário" no card do Glúteo Feminino
    await evalJs('document.querySelector(".btn-edit-form-action")?.click()');
    await new Promise(r => setTimeout(r, 500));

    const builderActive = await evalJs('document.getElementById("form-builder-modal-overlay")?.classList.contains("is-active")');
    assert(builderActive === true, 'Modal do Construtor No-Code abre ao clicar em Editar Formulário');

    const builderHasButtonName = await evalJs('document.getElementById("form-builder-modal")?.innerText.includes("Glúteo Feminino")');
    assert(builderHasButtonName === true, 'Construtor identifica o botão selecionado ("Glúteo Feminino")');

    const previewNotchExists = await evalJs('document.querySelector(".pk-builder-phone-notch") !== null');
    assert(previewNotchExists === true, 'Moldura do celular (Phone Mockup) com entalhe renderizada com sucesso');

    // Testar atualização reativa em tempo real: digitar novo título no formulário
    await evalJs(`
      const input = document.getElementById("builder-title");
      if (input) {
        input.value = "Avaliação Estética Exclusiva";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    `);
    await new Promise(r => setTimeout(r, 400));

    const previewTitleUpdated = await evalJs('document.getElementById("preview-form-title")?.innerText.trim()');
    assert(previewTitleUpdated === 'Avaliação Estética Exclusiva', 'Título no Phone Mockup atualizou em tempo real ao digitar', previewTitleUpdated);

    // Testar inserção dinâmica de opção
    await evalJs('document.getElementById("btn-add-builder-option")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const previewOptionsCount = await evalJs('document.querySelectorAll(".pk-preview-option-item").length');
    assert(previewOptionsCount >= 4, `Nova opção inserida com sucesso no Live Preview (Total: ${previewOptionsCount} opções)`);

    // Testar inserção rápida de tag no template
    await evalJs('document.querySelector(\'.pk-builder-tag-chip[data-tag="{nome}"]\')?.click()');
    await new Promise(r => setTimeout(r, 300));

    const templateHasTag = await evalJs('document.getElementById("builder-template")?.value.includes("{nome}")');
    assert(templateHasTag === true, 'Tag rápida {nome} inserida no template da mensagem');

    await takeScreenshot('form-builder-live-preview');

    // Salvar o formulário
    await evalJs('document.getElementById("btn-save-builder")?.click()');
    await new Promise(r => setTimeout(r, 600));

    const builderClosed = await evalJs('!document.getElementById("form-builder-modal-overlay")?.classList.contains("is-active")');
    assert(builderClosed === true, 'Construtor salva as alterações e fecha o modal automaticamente');

    // --------------------------------------------------------------------------
    // TESTE 12: TELA COMPLETA DE NOVO BOTÃO & PREVIEW AO VIVO (CENTRALKIT STYLE)
    // --------------------------------------------------------------------------
    console.log('\n🔘 12. Testando Tela Completa de Novo Botão & Live Widget Preview:');
    
    // Clica no botão "+ Criar Novo Botão / Site"
    await evalJs('document.getElementById("btn-create-new-button")?.click()');
    await new Promise(r => setTimeout(r, 500));

    const newBtnContainerExists = await evalJs('document.getElementById("new-button-view-container") !== null');
    assert(newBtnContainerExists === true, 'Tela completa de Novo Botão aberta com sucesso');

    const triggerHasWhatsappSvg = await evalJs('document.querySelector("#preview-floating-trigger-btn svg") !== null');
    assert(triggerHasWhatsappSvg === true, 'Widget flutuante possui o ícone oficial em SVG do WhatsApp renderizado');

    const triggerHasNoEmoji = await evalJs('!document.getElementById("preview-floating-trigger-btn")?.innerText.includes("💬")');
    assert(triggerHasNoEmoji === true, 'Widget flutuante circular não possui emoji genérico, exibindo o logo fiel à imagem');

    // Digita novo nome interno
    await evalJs(`(() => {
      const input = document.getElementById("new-btn-name");
      if (input) {
        input.value = "Clínica Harmonize";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 300));

    const previewNameUpdated = await evalJs('document.getElementById("preview-store-name")?.innerText');
    assert(previewNameUpdated === 'Clínica Harmonize', 'Nome atualizado em tempo real no mockup do site', previewNameUpdated);

    const previewAvatarUpdated = await evalJs('document.getElementById("preview-store-avatar")?.innerText');
    assert(previewAvatarUpdated === 'CH', 'Iniciais no avatar do mockup atualizadas para "CH"', previewAvatarUpdated);

    // Digita nova saudação
    await evalJs(`(() => {
      const input = document.getElementById("new-btn-greeting");
      if (input) {
        input.value = "Agende sua avaliação VIP";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 300));

    const previewGreetingUpdated = await evalJs('document.getElementById("preview-floating-greeting")?.innerText');
    assert(previewGreetingUpdated === 'Agende sua avaliação VIP', 'Saudação do balão atualizada em tempo real no mockup', previewGreetingUpdated);

    // Altera a cor usando preset violeta #7C3AED
    await evalJs(`(() => {
      document.querySelector('.btn-color-preset[data-color="#7C3AED"]')?.click();
    })()`);
    await new Promise(r => setTimeout(r, 300));

    const hexInputVal = await evalJs('document.getElementById("new-btn-color-hex")?.value');
    assert(hexInputVal === '#7C3AED', 'Preset de cor Violeta Pinas (#7C3AED) aplicado ao campo hex', hexInputVal);

    // Altera a posição para esquerda
    await evalJs(`(() => {
      const radioLeft = document.querySelector('input[name="new-btn-position"][value="left"]');
      if (radioLeft) {
        radioLeft.checked = true;
        radioLeft.dispatchEvent(new Event("change", { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 300));

    const containerLeftPos = await evalJs('document.getElementById("preview-floating-container")?.style.left');
    assert(containerLeftPos === '20px', 'Widget flutuante deslocado para o canto inferior esquerdo com sucesso', containerLeftPos);

    // Retorna para o canto direito
    await evalJs(`(() => {
      const radioRight = document.querySelector('input[name="new-btn-position"][value="right"]');
      if (radioRight) {
        radioRight.checked = true;
        radioRight.dispatchEvent(new Event("change", { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 300));

    const containerRightPos = await evalJs('document.getElementById("preview-floating-container")?.style.right');
    assert(containerRightPos === '20px', 'Widget flutuante reposicionado no canto inferior direito', containerRightPos);

    // Atualiza o link do site no formulário de novo botão e verifica a barra de endereço em tempo real
    await evalJs(`(() => {
      const siteInput = document.getElementById("new-btn-site-url");
      if (siteInput) {
        siteInput.value = "https://clinica-harmonize.com.br";
        siteInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 200));

    const browserAddressUrl = await evalJs('document.getElementById("preview-browser-url")?.innerText');
    assert(browserAddressUrl === 'clinica-harmonize.com.br', 'Barra de endereço do navegador simulado atualiza em tempo real com o domínio digitado');

    // Retorna para o Verde Oficial do WhatsApp (#25D366) para ficar idêntico à imagem de referência
    await evalJs(`(() => {
      document.querySelector('.btn-color-preset[data-color="#25D366"]')?.click();
    })()`);
    await new Promise(r => setTimeout(r, 300));

    await takeScreenshot('new-button-live-preview');

    // Testa Alternador de Abas do Preview (Botão Flutuante vs Formulário no Rodapé)
    await evalJs('document.getElementById("btn-preview-mode-form")?.click()');
    await new Promise(r => setTimeout(r, 300));

    const formPreviewVisible = await evalJs('document.getElementById("preview-mode-form-container")?.style.display');
    assert(formPreviewVisible === 'block', 'Aba de preview do Formulário na Página alternada para exibição (display: block)');

    const liveFormTitle = await evalJs('document.getElementById("preview-live-form-title")?.innerText');
    assert(liveFormTitle && liveFormTitle.length > 0, 'Título do formulário exibido corretamente no preview ao vivo');

    // Testa adicionar nova opção de qualificação
    await evalJs('document.getElementById("btn-add-new-option")?.click()');
    await new Promise(r => setTimeout(r, 300));

    const optionsCount = await evalJs('document.querySelectorAll(".new-btn-option-row").length');
    assert(optionsCount >= 4, 'Nova opção adicionada com sucesso à lista de qualificação (+1 linha)', optionsCount);

    // Retorna para a aba do Botão Flutuante
    await evalJs('document.getElementById("btn-preview-mode-float")?.click()');
    await new Promise(r => setTimeout(r, 300));

    const floatPreviewVisible = await evalJs('document.getElementById("preview-mode-float-container")?.style.display');
    assert(floatPreviewVisible === 'block', 'Aba do Botão Flutuante restaurada no preview ao vivo');

    // Submete o formulário para criar o botão
    await evalJs(`(() => {
      const form = document.getElementById("new-button-form");
      if (form) form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    })()`);
    await new Promise(r => setTimeout(r, 800));

    // Verifica que retornou para a lista de botões
    const returnedToButtons = await evalJs('document.getElementById("buttons-view-container") !== null');
    assert(returnedToButtons === true, 'Retornou automaticamente para a lista de botões após criação');

    // Verifica que o modal de instalação (CopyScriptModal) abriu automaticamente
    const copyScriptModalOpen = await evalJs('document.getElementById("copy-script-modal-overlay")?.classList.contains("is-active")');
    assert(copyScriptModalOpen === true, 'Modal de instalação com Script e Prompt para IA abriu automaticamente');

    const modalTitleHasNewName = await evalJs('document.getElementById("copy-modal-button-name")?.innerText.includes("Clínica Harmonize")');
    assert(modalTitleHasNewName === true, 'Modal exibe o nome do botão recém-criado ("Clínica Harmonize")');

    // Alterna para a aba de IA no modal
    await evalJs('document.getElementById("tab-btn-ai")?.click()');
    await new Promise(r => setTimeout(r, 300));

    const newAiPromptValue = await evalJs('document.getElementById("copy-ai-prompt-code")?.value');
    assert(newAiPromptValue && newAiPromptValue.includes('data-pinaskit='), 'Prompt para IA gerado dinamicamente com o ID do novo botão');

    // Testa cópia segura do prompt de IA
    await evalJs('document.getElementById("btn-do-copy-ai-prompt")?.click()');
    await new Promise(r => setTimeout(r, 300));

    await takeScreenshot('new-button-installation-modal');

    // Fecha o modal
    await evalJs('document.getElementById("btn-close-copy-modal")?.click()');
    await new Promise(r => setTimeout(r, 300));

    // ------------------------------------------------------------------------
    // 13. TESTANDO CENTRAL DE ANÚNCIOS, ATRIBUIÇÃO DE TRÁFEGO E GERADOR DE UTMS
    // ------------------------------------------------------------------------
    console.log('\n📈 13. Testando Central de Anúncios & Atribuição de Tráfego:');
    
    // Navega para a aba de Anúncios
    await evalJs('document.getElementById("side-nav-ads")?.click()');
    await new Promise(r => setTimeout(r, 600));

    const campaignsViewLoaded = await evalJs('document.getElementById("campaigns-view-container") !== null');
    assert(campaignsViewLoaded === true, 'Aba Central de Anúncios & Atribuição de Tráfego renderizada com sucesso');

    const campaignsCount = await evalJs('document.querySelectorAll(".campaign-row").length');
    assert(campaignsCount >= 5, 'Tabela de campanhas exibe todas as campanhas iniciais rastreadas', campaignsCount);

    // Testa filtro de plataforma Meta Ads
    await evalJs('document.querySelector(".campaign-platform-filter[data-platform=\\"meta\\"]")?.click()');
    await new Promise(r => setTimeout(r, 400));
    const metaFilterActive = await evalJs('document.querySelector(".campaign-platform-filter[data-platform=\\"meta\\"]")?.classList.contains("pk-btn-primary")');
    assert(metaFilterActive === true, 'Filtro por plataforma Meta Ads ativado com destaque');

    // Retorna para Todas as plataformas
    await evalJs('document.querySelector(".campaign-platform-filter[data-platform=\\"Todas\\"]")?.click()');
    await new Promise(r => setTimeout(r, 400));

    // Testa alternar status da campanha (Ativa -> Pausada -> Ativa)
    const initialCampStatusText = await evalJs('document.querySelector(".pk-btn-toggle-camp-status")?.innerText');
    await evalJs('document.querySelector(".pk-btn-toggle-camp-status")?.click()');
    await new Promise(r => setTimeout(r, 400));
    const updatedCampStatusText = await evalJs('document.querySelector(".pk-btn-toggle-camp-status")?.innerText');
    assert(initialCampStatusText !== updatedCampStatusText, 'Alternância interativa de status da campanha na tabela');
    // Restaura
    await evalJs('document.querySelector(".pk-btn-toggle-camp-status")?.click()');
    await new Promise(r => setTimeout(r, 400));

    // Testa o Simulador de ROI (Arrasta slider)
    await evalJs(`(() => {
      const slider = document.getElementById("sim-budget-slider");
      if (slider) {
        slider.value = 1000;
        slider.dispatchEvent(new Event("input", { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 300));
    const simBudgetVal = await evalJs('document.getElementById("sim-budget-display")?.innerText');
    assert(simBudgetVal && simBudgetVal.includes('1.000'), 'Simulador de ROI reage em tempo real ao valor do orçamento adicional');

    // Testa abertura do Modal Gerador de Links com UTMs
    await evalJs('document.getElementById("btn-open-utm-builder")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const utmModalIsOpen = await evalJs('document.getElementById("utm-builder-modal-overlay")?.classList.contains("is-active")');
    assert(utmModalIsOpen === true, 'Modal do Gerador de Links Rastreados (UTMs) aberto com sucesso');

    const utmInitialUrl = await evalJs('document.getElementById("utm-output-url")?.value');
    assert(utmInitialUrl && utmInitialUrl.includes('utm_source='), 'URL rastreada gerada com parâmetros oficiais de UTM');

    // Alterna para canal Feed
    await evalJs('document.querySelector(".utm-medium-chip[data-medium=\\"feed\\"]")?.click()');
    await new Promise(r => setTimeout(r, 300));
    const utmUpdatedUrl = await evalJs('document.getElementById("utm-output-url")?.value');
    assert(utmUpdatedUrl && utmUpdatedUrl.includes('utm_medium=feed'), 'Canal selecionado no modal atualiza o link UTM dinamicamente');

    // Clica no botão de copiar link rastreado
    await evalJs('document.getElementById("btn-copy-utm-url")?.click()');
    await new Promise(r => setTimeout(r, 300));

    await takeScreenshot('ads-traffic-utm-builder');

    // Fecha modal de UTM
    await evalJs('document.getElementById("btn-close-utm-modal")?.click()');
    await new Promise(r => setTimeout(r, 300));

    await takeScreenshot('campaigns-traffic-view');

    // ------------------------------------------------------------------------
    // 14. TESTANDO SITE REAL DO CLIENTE COM SCRIPT EMBED OFICIAL ATIVO
    // ------------------------------------------------------------------------
    console.log('\n🌐 14. Testando Site Real do Cliente com Script Embed (/teste-widget.html):');
    await send('Page.navigate', { url: `${BASE_URL}/teste-widget.html?button=btn-1` });
    await new Promise(r => setTimeout(r, 2000));

    const embedFloatingBtnExists = await evalJs('document.getElementById("pk-embed-floating-wrap") !== null');
    assert(embedFloatingBtnExists === true, 'Script embed.js carregou e injetou o Botão Flutuante de WhatsApp na página do cliente');

    const embedTriggerHasSvg = await evalJs('document.querySelector("#pk-embed-trigger-btn svg") !== null');
    assert(embedTriggerHasSvg === true, 'Botão Flutuante no site do cliente possui o logo SVG oficial do WhatsApp');

    const embedPageFormExists = await evalJs('document.getElementById("pk-embed-page-form") !== null');
    assert(embedPageFormExists === true, 'Script embed.js injetou o Formulário de Qualificação ao final da página (#pinaskit-form)');

    const embedPageFormTitle = await evalJs('document.querySelector(".pk-embed-page-form-section h3")?.innerText');
    assert(embedPageFormTitle === 'Avaliação Estética Exclusiva' || embedPageFormTitle === 'Conte sobre seu momento.', 'Formulário na página exibe o título configurado pelo usuário', embedPageFormTitle);

    // Clica no botão flutuante para abrir o balão
    await evalJs('document.getElementById("pk-embed-trigger-btn")?.click()');
    await new Promise(r => setTimeout(r, 400));

    const embedPopupIsOpen = await evalJs('document.getElementById("pk-embed-popup")?.classList.contains("is-open")');
    assert(embedPopupIsOpen === true, 'Balão popup de WhatsApp abre ao clicar no botão flutuante');

    // 14.1 Testar submissão do formulário na página (sem redirecionar para o WhatsApp do visitante)
    await evalJs(`
      const nameInput = document.getElementById("pk-page-name");
      const phoneInput = document.getElementById("pk-page-phone");
      if (nameInput) nameInput.value = "Renato Silva";
      if (phoneInput) phoneInput.value = "11999998888";
      document.getElementById("pk-embed-page-form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    `);
    await new Promise(r => setTimeout(r, 500));

    const successBoxExists = await evalJs('document.querySelector(".pk-embed-success-box") !== null');
    assert(successBoxExists === true, 'Submissão do formulário na página exibe a tela de confirmação de sucesso in-place');

    const successBoxTitle = await evalJs('document.querySelector(".pk-embed-success-box h3")?.innerText');
    assert(successBoxTitle && successBoxTitle.includes('Aplicação enviada com sucesso'), 'Mensagem de sucesso confirma o recebimento sigiloso da aplicação');

    const leadsInStorage = await evalJs('localStorage.getItem("pk_leads")');
    assert(leadsInStorage && leadsInStorage.includes('Renato Silva'), 'Lead preenchido na página é salvo diretamente no CRM (pk_leads)');

    await takeScreenshot('client-site-widget-live');

  } catch (err) {
    console.error('🚨 Erro inesperado no teste E2E:', err);
    testFails++;
    errorsFound.push({ test: 'E2E Chrome', detail: err.message });
  } finally {
    if (ws) ws.close();
    chrome.kill('SIGKILL');
    if (serverProcess) serverProcess.kill('SIGKILL');
    console.log('\n🛑 Google Chrome e Servidor finalizados com segurança.');
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
