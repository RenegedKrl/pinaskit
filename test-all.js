/* ==========================================================================
   PINAS KIT — SUÍTE DE TESTES AUTOMATIZADOS (CENTRALKIT V7.0)
   ========================================================================== */

import { StorageService } from './src/services/storage.js';
import { renderHeader } from './src/components/Header.js';
import { renderLandingPage } from './src/components/LandingPage.js';
import { renderDashboard } from './src/components/Dashboard.js';
import { renderButtonsView } from './src/components/ButtonsView.js';
import { renderLeadsView } from './src/components/LeadsView.js';
import { renderQualificationModal } from './src/components/QualificationModal.js';
import { renderConnectAdsModal } from './src/components/ConnectAdsModal.js';
import { renderFormBuilderModal } from './src/components/FormBuilderModal.js';
import { renderVideoTourModal } from './src/components/VideoTourModal.js';
import { renderCopyScriptModal } from './src/components/CopyScriptModal.js';
import { renderLeadDrawer } from './src/components/LeadDrawer.js';
import { renderNewButtonView } from './src/components/NewButtonView.js';
import { renderCampaignsView } from './src/components/CampaignsView.js';
import { renderUtmBuilderModal } from './src/components/UtmBuilderModal.js';
import { renderEditSiteModal } from './src/components/EditSiteModal.js';
import { renderLeadScoringView } from './src/components/LeadScoringView.js';
import { renderLeadSettingsModal } from './src/components/LeadSettingsModal.js';
import fs from 'fs';

let passCount = 0;
let failCount = 0;
const errors = [];

function assert(condition, testName, errorDetails = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}: ${errorDetails}`);
    failCount++;
    errors.push({ testName, errorDetails });
  }
}

console.log('\n============================================================');
console.log('🧪 INICIANDO PROTOCOLO ZERO-BUG & TESTE CENTRALKIT V7.0');
console.log('============================================================\n');

// Mock simples de localStorage e document para Node
const memoryStorage = {};
globalThis.localStorage = {
  getItem: (key) => memoryStorage[key] || null,
  setItem: (key, val) => { memoryStorage[key] = String(val); },
  removeItem: (key) => { delete memoryStorage[key]; },
  clear: () => { Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]); }
};
globalThis.document = {
  body: {
    setAttribute: (attr, val) => { memoryStorage[`body_${attr}`] = val; }
  }
};

// --------------------------------------------------------------------------
// 1. TESTES DO STORAGE SERVICE & ESTADOS
// --------------------------------------------------------------------------
console.log('📦 1. Testando StorageService (Gerenciamento de Estado & Dados):');

// 1.1 Tema Claro/Escuro
StorageService.setTheme('dark');
assert(StorageService.getTheme() === 'dark', 'Persistência do Tema Escuro');
StorageService.setTheme('light');
assert(StorageService.getTheme() === 'light', 'Persistência do Tema Claro');

// 1.2 Botões / Sites Iniciais (CentralKit)
const initialButtons = StorageService.getButtons();
assert(Array.isArray(initialButtons) && initialButtons.length >= 3, 'Carregamento de botões/sites iniciais (3 de 5)');
assert(initialButtons[0].name === 'Glúteo Feminino', 'Primeiro botão identificado como Glúteo Feminino');
assert(initialButtons[1].name === 'Endolaser', 'Segundo botão identificado como Endolaser');
assert(initialButtons[2].name === 'Consulta Médica', 'Terceiro botão identificado como Consulta Médica');

// 1.3 Leads iniciais da CentralKit (Imagem 2)
const initialLeads = StorageService.getLeads();
assert(Array.isArray(initialLeads) && initialLeads.length >= 4, 'Carregamento de leads iniciais demonstrativos');
assert(initialLeads[0].name.includes('Ana Livia'), 'Primeiro lead inicial identificado corretamente (Ana Livia)');
assert(initialLeads[0].button === 'Glúteo Feminino', 'Primeiro lead vinculado ao botão Glúteo Feminino');

// 1.4 Adicionar novo lead
const addedLead = StorageService.addLead({
  name: 'Carlos Eduardo Teste',
  phone: '+55 11 98888-7777',
  email: 'carlos@teste.com',
  button: 'Consulta Médica',
  origin: 'Meta Ads',
  campaign: 'Campanha_Outubro_Feed',
  temperature: 'Quente',
  score: 45
});
assert(addedLead && addedLead.name === 'Carlos Eduardo Teste', 'Adição de novo lead na base');
const updatedLeads = StorageService.getLeads();
assert(updatedLeads[0].id === addedLead.id, 'Novo lead inserido no topo da lista com prioridade');

// 1.5 Filtro de leads por Botão
const gluteoLeads = StorageService.getLeads('Glúteo Feminino');
assert(gluteoLeads.every(l => l.button === 'Glúteo Feminino'), 'Filtragem de leads por botão específico (Glúteo Feminino)');

// 1.6 Configuração do Formulário Dinâmico
const formConfig = StorageService.getFormConfig();
assert(formConfig.title === 'Conte sobre seu momento.', 'Título do formulário dinâmico correto');
assert(Array.isArray(formConfig.options) && formConfig.options.length >= 3, 'Opções do formulário dinâmico carregadas');

// 1.7 Contas de Anúncio
assert(StorageService.getConnectedAds().facebook === false, 'Estado inicial de anúncios desconectado');
StorageService.setConnectedAds({ facebook: true, instagram: true, google: false });
assert(StorageService.getConnectedAds().facebook === true, 'Conexão simulada do Facebook Ads persistida');

// 1.8 Busca e Manipulação do Lead (Drawer)
const lead1 = StorageService.getLeadById('lead-1');
assert(lead1 && lead1.name.includes('Ana Livia'), 'Busca de lead por ID (getLeadById)');
const updatedStageLead = StorageService.updateLeadStage('lead-1', 'Proposta', 'Mariana');
assert(updatedStageLead && updatedStageLead.stage === 'Proposta', 'Atualização de estágio no CRM');
assert(updatedStageLead.timeline[0].title.includes('Proposta'), 'Adição automática de evento de estágio na linha do tempo');
const updatedNoteLead = StorageService.addLeadNote('lead-1', 'Lead super interessada para o sábado', 'Mariana');
assert(updatedNoteLead && updatedNoteLead.activityNotes.length > 0, 'Adição de anotação interna no lead');

// 1.9 Criação e Persistência de Novo Botão
const newBtnSaved = StorageService.saveButton({
  name: 'Harmonização Facial',
  slug: 'harmonizacao-facial',
  whatsappNumber: '5511951047970',
  category: 'Procedimento Estético',
  status: 'Ativo'
});
assert(newBtnSaved && newBtnSaved.name === 'Harmonização Facial', 'Criação de novo botão via saveButton');
assert(newBtnSaved && newBtnSaved.slug === 'harmonizacao-facial', 'Slug do novo botão gerado corretamente');
assert(StorageService.getButtons().some(b => b.name === 'Harmonização Facial'), 'Novo botão persistido no StorageService');
const updatedBtnSite = StorageService.updateButtonSiteUrl('btn-1', 'https://brunamentoriadecarreira.vercel.app');
assert(updatedBtnSite && updatedBtnSite.siteUrl === 'https://brunamentoriadecarreira.vercel.app', 'StorageService atualiza o link do site do botão');

// 1.10 Campanhas de Anúncios, Atribuição de Tráfego & Cálculo de Métricas
const campaigns = StorageService.getCampaigns();
assert(Array.isArray(campaigns) && campaigns.length >= 5, 'Carregamento inicial de campanhas de anúncios (5 campanhas)');
assert(campaigns[0].cpl !== undefined && Number(campaigns[0].cpl) > 0, 'Cálculo dinâmico do Custo por Lead (CPL) em R$');
assert(campaigns[0].roi !== undefined && Number(campaigns[0].roi) > 0, 'Cálculo dinâmico do Retorno sobre Investimento (ROI / ROAS)');
assert(campaigns[0].tier && campaigns[0].tier.badge, 'Classificação visual de desempenho da campanha (Modelo D)');

// Filtros por plataforma
const metaCampaigns = StorageService.getCampaigns('meta');
assert(metaCampaigns.every(c => c.platform === 'meta'), 'Filtro de campanhas por plataforma Meta Ads');
const googleCampaigns = StorageService.getCampaigns('google');
assert(googleCampaigns.every(c => c.platform === 'google'), 'Filtro de campanhas por plataforma Google Ads');

// Alternar status da campanha
const camp1 = campaigns[0];
const initialStatus = camp1.status;
const toggledCamp = StorageService.toggleCampaignStatus(camp1.id);
assert(toggledCamp && toggledCamp.status !== initialStatus, 'Alternância de status da campanha (Ativa/Pausada)');
StorageService.toggleCampaignStatus(camp1.id); // restaura

// Métricas Agregadas do Dashboard
const adMetrics = StorageService.getAggregatedAdMetrics();
assert(adMetrics.totalSpend && adMetrics.totalSpend.includes('R$'), 'Métricas agregadas: Total investido formatado em R$');
assert(adMetrics.totalLeads > 0, 'Métricas agregadas: Total de leads capturados via tráfego pago');
assert(adMetrics.avgCpl && adMetrics.avgCpl.includes('R$'), 'Métricas agregadas: CPL médio calculado com precisão');
assert(adMetrics.overallRoi && adMetrics.overallRoi.includes('x'), 'Métricas agregadas: ROI geral calculado como multiplicador');
assert(adMetrics.bestCampaign && adMetrics.bestCampaign.name, 'Métricas agregadas: Identificação automática da campanha campeã');

// Gerador de URLs com UTM
const generatedUtm = StorageService.generateUtmUrl({
  baseUrl: 'https://clinicaestetica.com.br/gluteo',
  utmSource: 'meta_ads',
  utmMedium: 'stories',
  utmCampaign: 'promo-verao-gluteo',
  utmContent: 'criativo-01'
});
assert(generatedUtm.includes('utm_source=meta_ads'), 'Gerador de UTM: Inclui utm_source');
assert(generatedUtm.includes('utm_medium=stories'), 'Gerador de UTM: Inclui utm_medium');
assert(generatedUtm.includes('utm_content=criativo-01'), 'Gerador de UTM: Inclui utm_content');

// 1.11 Regras de Pontuação e Automação de Leads (Storage)
const defaultScoringRules = StorageService.getScoringRules();
assert(defaultScoringRules && defaultScoringRules.thresholds.coldMax === 30, 'StorageService: Regras padrão de pontuação carregadas');
const updatedScoring = StorageService.saveScoringRules({ thresholds: { coldMax: 35, warmMax: 75 } });
assert(updatedScoring.thresholds.coldMax === 35, 'StorageService: Salvar novas regras de pontuação');
const autoSettings = StorageService.getLeadAutomationSettings();
assert(autoSettings && autoSettings.autoCreateDeal === true, 'StorageService: Configurações de automação de leads');

// --------------------------------------------------------------------------
// 2. TESTES DE COMPONENTES & HIERARQUIA VISUAL
// --------------------------------------------------------------------------
console.log('\n🎨 2. Testando Renderização dos Componentes (Modelo D UI/UX):');

// 2.1 Header
const headerHtml = renderHeader('landing');
assert(headerHtml.includes('Pinas Kit'), 'Header exibe o nome oficial do produto');
assert(headerHtml.includes('btn-theme-toggle'), 'Header possui o botão de alternância de tema');
assert(headerHtml.includes('Como funciona') && headerHtml.includes('Preços'), 'Header possui links de navegação');

// 2.2 Landing Page
const landingHtml = renderLandingPage();
assert(landingHtml.includes('Seu negócio organizado e sem complicação.'), 'Landing Page exibe headline oficial do Modelo D');
assert(landingHtml.includes('Começar agora, é grátis →'), 'Landing Page possui CTA principal com texto correto');
assert(landingHtml.includes('btn-hero-demo'), 'Landing Page possui botão "Ver como funciona"');
assert(landingHtml.includes('btn-mock-client-site-widget'), 'Landing Page possui a demonstração simulada do site do cliente');
assert(landingHtml.includes('assets/images/hero-avatar.jpg'), 'Landing Page carrega a foto humana acolhedora');
assert(landingHtml.includes('R$ 41,58') && landingHtml.includes('R$ 499,00'), 'Landing Page exibe tabela de preços anual/mensal');

// 2.3 Dashboard Desktop (Visão Geral)
const dashHtml = renderDashboard('overview');
assert(dashHtml.includes('Olá, Mariana! 👋'), 'Dashboard possui saudação humanizada da Mariana');
assert(dashHtml.includes('Seu início no Pinas Kit'), 'Dashboard possui o card de onboarding com progresso');
assert(dashHtml.includes('Próxima Ação Recomendada'), 'Dashboard possui o card dinâmico de próxima ação');
assert(dashHtml.includes('side-nav-buttons'), 'Sidebar possui a aba "Botões"');
assert(dashHtml.includes('side-nav-leads'), 'Sidebar possui a aba "Leads"');
assert(dashHtml.includes('mobile-bottom-nav'), 'Dashboard possui barra de navegação mobile dedicada');

// 2.4 Módulo "Botões" (CentralKit)
const buttonsHtml = renderButtonsView();
assert(buttonsHtml.includes('Meus Botões & Sites de Captação'), 'Tela de Botões possui título correto');
assert(buttonsHtml.includes('Cota de Sites'), 'Tela de Botões exibe cota do Plano Starter');
assert(buttonsHtml.includes('Glúteo Feminino') && buttonsHtml.includes('Endolaser'), 'Tela de Botões exibe os cards dos sites');
assert(buttonsHtml.includes('btn-copy-script-action'), 'Cards de Botões possuem botão para copiar script');
assert(buttonsHtml.includes('btn-test-widget-action'), 'Cards de Botões possuem botão para testar widget');
assert(buttonsHtml.includes('pk-site-url-card-box'), 'Cards de Botões possuem caixa de exibição do site vinculado');
assert(buttonsHtml.includes('btn-quick-edit-site-url'), 'Cards de Botões possuem botão para alterar site vinculado');

// 2.4.1 Módulo "Novo Botão" (Tela Completa CentralKit)
const newButtonHtml = renderNewButtonView();
assert(newButtonHtml.includes('new-btn-name'), 'Tela de Novo Botão possui campo de nome interno');
assert(newButtonHtml.includes('new-btn-site-url'), 'Tela de Novo Botão possui campo de Link ou Domínio do Site');
assert(newButtonHtml.includes('new-btn-whatsapp'), 'Tela de Novo Botão possui campo de número WhatsApp');
assert(newButtonHtml.includes('new-btn-question'), 'Tela de Novo Botão possui pergunta de qualificação');
assert(newButtonHtml.includes('🔥 Quente') && newButtonHtml.includes('❄️ Morno'), 'Tela de Novo Botão possui badges de temperatura');
assert(newButtonHtml.includes('new-btn-color-picker'), 'Tela de Novo Botão possui seletor de cor');
assert(newButtonHtml.includes('preview-floating-container'), 'Tela de Novo Botão possui moldura do mockup com widget flutuante');
assert(newButtonHtml.includes('preview-browser-url'), 'Mockup possui barra de endereço com o domínio do site');
assert(newButtonHtml.includes('preview-store-avatar'), 'Mockup possui avatar com iniciais do botão');
assert(newButtonHtml.includes('preview-floating-trigger-btn') && newButtonHtml.includes('M13.601 2.326A7.85'), 'Widget flutuante possui o logo oficial vetorizado do WhatsApp (SVG)');
assert(!newButtonHtml.includes('💬'), 'Widget flutuante não possui emoji genérico, exibindo o logo vetorizado');

// 2.4.2 Dashboard na Aba "new-button"
const dashNewButtonHtml = renderDashboard('new-button');
assert(dashNewButtonHtml.includes('Novo Botão de WhatsApp'), 'Dashboard exibe título "Novo Botão de WhatsApp"');
assert(dashNewButtonHtml.includes('new-button-view-container'), 'Dashboard renderiza o container de Novo Botão');

// 2.5 Módulo "Leads" (Tabela da Imagem 2)
const leadsHtml = renderLeadsView('Todos');
assert(leadsHtml.includes('Contatos capturados pelos formulários dos seus botões.'), 'Tela de Leads exibe subtítulo oficial da CentralKit');
assert(leadsHtml.includes('filter-lead-button'), 'Tabela de Leads possui o dropdown de filtro por botão');
assert(leadsHtml.includes('btn-export-excel-leads'), 'Tabela de Leads possui botão de exportar Excel');
assert(leadsHtml.includes('btn-scoring-rules'), 'Tabela de Leads possui botão de regras de pontuação');
assert(leadsHtml.includes('input-search-leads'), 'Tabela de Leads possui busca instantânea');
assert(leadsHtml.includes('filter-lead-temp'), 'Tabela de Leads possui filtro de temperatura');
assert(leadsHtml.includes('editable-lead-field'), 'Tabela de Leads possui células editáveis inline');
assert(leadsHtml.includes('Ana Livia Pereira de Sousa Paulo'), 'Tabela de Leads exibe os contatos da imagem');

// 2.5.1 Tela de Regras de Pontuação (Lead Scoring Engine)
const scoringHtml = renderLeadScoringView();
assert(scoringHtml.includes('Regras de Pontuação de Leads'), 'Tela de Regras de Pontuação possui título correto');
assert(scoringHtml.includes('slider-cold-max') && scoringHtml.includes('slider-warm-max'), 'Tela de Pontuação possui sliders de faixas');
assert(scoringHtml.includes('btn-save-scoring-rules'), 'Tela de Pontuação possui botão de salvar');
assert(scoringHtml.includes('btn-back-to-leads'), 'Tela de Pontuação possui botão de retorno para Leads');

// 2.5.2 Modal de Configurações e Automações de Leads
const leadSettingsHtml = renderLeadSettingsModal();
assert(leadSettingsHtml.includes('Configurações & Automações de Leads'), 'Modal de Configurações de Leads possui título oficial');
assert(leadSettingsHtml.includes('setting-auto-deal'), 'Modal possui switch de criação automática no CRM');
assert(leadSettingsHtml.includes('btn-save-lead-settings'), 'Modal possui botão de salvar configurações');

// 2.6 Modal de Qualificação
const qualModalHtml = renderQualificationModal();
assert(qualModalHtml.includes('Conte sobre seu momento.'), 'Modal de Qualificação possui título amigável');
assert(qualModalHtml.includes('custom-select-trigger'), 'Modal possui o seletor customizado sofisticado');
assert(qualModalHtml.includes('Preparar minha mensagem →'), 'Modal possui o botão de envio formatado');

// 2.7 Modal de Conexão de Anúncios
const adsModalHtml = renderConnectAdsModal();
assert(adsModalHtml.includes('Facebook Ads') && adsModalHtml.includes('Google Ads'), 'Modal de anúncios possui opções da Meta e Google');
assert(adsModalHtml.includes('OAuth 2.0 criptografado'), 'Modal possui selo de segurança e privacidade');

// 2.8 Modal do Construtor No-Code
const builderModalHtml = renderFormBuilderModal();
assert(builderModalHtml.includes('Construtor Visual No-Code'), 'Construtor possui cabeçalho de personalização');
assert(builderModalHtml.includes('btn-add-builder-option'), 'Construtor possui botão para adicionar novas opções');
assert(builderModalHtml.includes('Pré-visualização ao Vivo'), 'Construtor possui painel de Pré-visualização ao Vivo no Celular');
assert(builderModalHtml.includes('preview-options-container'), 'Construtor possui container reativo de opções no preview');
assert(builderModalHtml.includes('btn-reset-builder-defaults'), 'Construtor possui botão de restaurar textos padrão');
assert(builderModalHtml.includes('pk-builder-tag-chip'), 'Construtor possui tags rápidas para template do WhatsApp');

const builderButton1Html = renderFormBuilderModal(initialButtons[0]);
assert(builderButton1Html.includes('Personalizar: Glúteo Feminino'), 'Construtor carrega título específico do botão ao editar');

// 2.9 Modal de Vídeo Tour
const videoModalHtml = renderVideoTourModal();
assert(videoModalHtml.includes('Veja o Pinas Kit funcionando em 1 minuto'), 'Modal de Vídeo Tour possui título correto');
assert(videoModalHtml.includes('tour-play-btn'), 'Modal de Vídeo Tour possui botão de play');

// 2.10 Modal Copiar Script (Padrão CentralKit com Aba de Código e Aba de IA)
const copyModalHtml = renderCopyScriptModal();
assert(copyModalHtml.includes('Agora é só instalar no seu site'), 'Modal Copiar Script possui subtítulo oficial');
assert(copyModalHtml.includes('copy-script-code'), 'Modal Copiar Script possui o textarea com o código');
assert(copyModalHtml.includes('tab-btn-ai'), 'Modal Copiar Script possui a aba "Pedir para uma IA"');
assert(copyModalHtml.includes('copy-ai-prompt-code'), 'Modal Copiar Script possui o container do prompt formatado para IA');
assert(copyModalHtml.includes('btn-do-copy-ai-prompt'), 'Modal Copiar Script possui o botão de copiar prompt para IA');
assert(copyModalHtml.includes('copy-modal-site-url'), 'Modal Copiar Script exibe o site exclusivo autorizado');

// 2.10.1 Modal de Edição Rápida de Site (Vinculação Exclusiva)
const editSiteModalHtml = renderEditSiteModal();
assert(editSiteModalHtml.includes('edit-site-url-form'), 'Modal de Edição de Site possui formulário de atualização');
assert(editSiteModalHtml.includes('edit-site-url-input'), 'Modal de Edição de Site possui campo para digitar o link do site');
assert(editSiteModalHtml.includes('btn-save-edit-site'), 'Modal de Edição de Site possui botão de salvar e atualizar');

// 2.11 Drawer Lateral da Ficha do Lead
const drawerHtml = renderLeadDrawer(lead1);
assert(drawerHtml.includes('Ana Livia Pereira de Sousa Paulo'), 'Drawer exibe o nome completo do lead');
assert(drawerHtml.includes('Falar no WhatsApp'), 'Drawer possui botão direto para conversa no WhatsApp');
assert(drawerHtml.includes('Origem & Rastreamento de Anúncios'), 'Drawer possui seção de atribuição de tráfego e UTMs');
assert(drawerHtml.includes('Linha do Tempo do Lead'), 'Drawer possui linha do tempo de atividades');
assert(drawerHtml.includes('Anotações da Equipe'), 'Drawer possui bloco colaborativo de anotações');

// 2.12 Módulo de Campanhas & Atribuição de Tráfego (CampaignsView)
const campaignsHtml = renderCampaignsView();
assert(campaignsHtml.includes('Central de Anúncios & Atribuição de Tráfego'), 'CampaignsView exibe título oficial');
assert(campaignsHtml.includes('Diagnóstico Inteligente do Tráfego'), 'CampaignsView exibe card didático de diagnóstico');
assert(campaignsHtml.includes('sim-budget-slider'), 'CampaignsView possui slider interativo de projeção de ROI');
assert(campaignsHtml.includes('campaign-platform-filter'), 'CampaignsView possui botões de filtro por plataforma');
assert(campaignsHtml.includes('campaigns-data-table'), 'CampaignsView possui a tabela de campanhas');
assert(campaignsHtml.includes('btn-open-utm-builder'), 'CampaignsView possui botão do gerador de UTMs');
assert(campaignsHtml.includes('pk-btn-toggle-camp-status'), 'Tabela de campanhas possui botões interativos de alternar status');

// 2.13 Modal Gerador de Links Rastreados (UtmBuilderModal)
const utmModalHtml = renderUtmBuilderModal();
assert(utmModalHtml.includes('Gerador de Links Rastreados (UTMs)'), 'Modal UTM possui título correto');
assert(utmModalHtml.includes('utm-target-button'), 'Modal UTM possui dropdown de botões de destino');
assert(utmModalHtml.includes('utm-output-url'), 'Modal UTM possui área de saída do link gerado');
assert(utmModalHtml.includes('btn-copy-utm-url'), 'Modal UTM possui botão de copiar link rastreado');

// --------------------------------------------------------------------------
// 3. TESTES DE ARQUIVOS ESTÁTICOS & ASSETS
// --------------------------------------------------------------------------
console.log('\n📁 3. Testando Presença e Integridade de Imagens e Estilos:');

assert(fs.existsSync('public/assets/images/hero-avatar.jpg'), 'Foto humana do Hero (hero-avatar.jpg) existe no disco');
assert(fs.existsSync('public/assets/images/support-avatar.jpg'), 'Foto do suporte da Mariana (support-avatar.jpg) existe no disco');
assert(fs.existsSync('src/styles/tokens.css'), 'Arquivo tokens.css existe');
assert(fs.existsSync('src/styles/components.css'), 'Arquivo components.css existe');
assert(fs.existsSync('src/styles/layout.css'), 'Arquivo layout.css existe');

const tokensContent = fs.readFileSync('src/styles/tokens.css', 'utf8');
assert(tokensContent.includes('#7C3AED'), 'Tokens incluem o Violeta Principal (#7C3AED)');
assert(tokensContent.includes('#F8F7FC'), 'Tokens incluem o Fundo Claro do Modelo D (#F8F7FC)');
assert(tokensContent.includes('#10B981'), 'Tokens incluem o Verde Esmeralda do WhatsApp (#10B981)');
assert(tokensContent.includes('#09090B'), 'Tokens incluem o Fundo Escuro (#09090B)');

// --------------------------------------------------------------------------
// 4. VERIFICAÇÃO DE CONFORMIDADE COM O PLANO MESTRE V7.0
// --------------------------------------------------------------------------
console.log('\n🔒 4. Verificando Conformidade com o Plano Mestre v7.0:');

const planContent = fs.readFileSync('planejamento_pinas_kit.md', 'utf8');
assert(planContent.includes('PROTOCOLO DE AUDITORIA CONTÍNUA DE SEGURANÇA'), 'Plano contém a Regra 1: Auditoria de Segurança');
assert(planContent.includes('PROTOCOLO ZERO-BUG & TESTE INTEGRAL DE UI/UX'), 'Plano contém a Regra 2: Qualidade Zero-Bug');
assert(planContent.includes('Módulo "Botões" (Sites, Pastas de Captação e Links com Cota de Plano)'), 'Plano contém a especificação de Botões/Sites');
assert(planContent.includes('Módulo "Leads" (Tabela Completa CentralKit com Filtro por Botão)'), 'Plano contém a especificação da Tabela CentralKit');

// --------------------------------------------------------------------------
// RESULTADO FINAL
// --------------------------------------------------------------------------
console.log('\n============================================================');
console.log(`📊 RESULTADO FINAL: ${passCount} TESTES PASSARAM | ${failCount} FALHAS`);
console.log('============================================================');

if (failCount > 0) {
  console.error('\n🚨 Erros encontrados durante a bateria:');
  errors.forEach((err, idx) => {
    console.error(`  ${idx + 1}. [${err.testName}] - ${err.errorDetails}`);
  });
  process.exit(1);
} else {
  console.log('\n✨ TODOS OS SISTEMAS DA CENTRALKIT V7.0 ESTÃO 100% OPERACIONAIS E APROVADOS!\n');
}
