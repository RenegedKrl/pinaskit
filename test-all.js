/* ==========================================================================
   PINAS KIT — SUÍTE DE TESTES AUTOMATIZADOS (ZERO-BUG PROTOCOL)
   ========================================================================== */

import { StorageService } from './src/services/storage.js';
import { renderHeader } from './src/components/Header.js';
import { renderLandingPage } from './src/components/LandingPage.js';
import { renderDashboard } from './src/components/Dashboard.js';
import { renderQualificationModal } from './src/components/QualificationModal.js';
import { renderConnectAdsModal } from './src/components/ConnectAdsModal.js';
import { renderFormBuilderModal } from './src/components/FormBuilderModal.js';
import fs from 'fs';
import path from 'path';

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
console.log('🧪 INICIANDO PROTOCOLO ZERO-BUG & TESTE INTEGRAL DO PINAS KIT');
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

// 1.2 Leads iniciais e adição de novo lead
const initialLeads = StorageService.getLeads();
assert(Array.isArray(initialLeads) && initialLeads.length >= 4, 'Carregamento de leads iniciais demonstrativos');
assert(initialLeads[0].name.includes('Ana Livia'), 'Primeiro lead inicial identificado corretamente');

const addedLead = StorageService.addLead({
  name: 'Carlos Eduardo Teste',
  phone: '+55 11 98888-7777',
  email: 'carlos@teste.com',
  button: 'Formulário Qualificação',
  origin: 'Meta Ads',
  campaign: 'Campanha_Outubro_Feed',
  temperature: 'Quente',
  score: 45
});
assert(addedLead && addedLead.name === 'Carlos Eduardo Teste', 'Adição de novo lead no CRM');
const updatedLeads = StorageService.getLeads();
assert(updatedLeads[0].id === addedLead.id, 'Novo lead inserido no topo da lista com prioridade');

// 1.3 Configuração do Formulário Dinâmico
const formConfig = StorageService.getFormConfig();
assert(formConfig.questionLabel === 'O que melhor descreve seu momento?', 'Pergunta padrão do formulário carregada');
assert(Array.isArray(formConfig.options) && formConfig.options.length === 4, '4 opções dinâmicas padrão carregadas');

// Salvar nova configuração
formConfig.questionLabel = 'Qual serviço você busca hoje?';
StorageService.saveFormConfig(formConfig);
assert(StorageService.getFormConfig().questionLabel === 'Qual serviço você busca hoje?', 'Atualização do formulário pelo Construtor No-Code');

// 1.4 Contas de Anúncio
assert(StorageService.getConnectedAds().facebook === false, 'Estado inicial de anúncios desconectado');
StorageService.setConnectedAds({ facebook: true, instagram: true, google: false });
assert(StorageService.getConnectedAds().facebook === true, 'Conexão simulada do Facebook Ads persistida');

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
assert(landingHtml.includes('assets/images/hero-avatar.jpg'), 'Landing Page carrega a foto humana acolhedora');
assert(landingHtml.includes('R$ 41,58') && landingHtml.includes('R$ 499,00'), 'Landing Page exibe tabela de preços anual/mensal');
assert(landingHtml.includes('Antes de começar') && landingHtml.includes('Preciso saber programar'), 'Landing Page possui seção de FAQ sanfona');

// 2.3 Dashboard Desktop
const dashHtml = renderDashboard('Todos');
assert(dashHtml.includes('Olá, Mariana! 👋'), 'Dashboard possui saudação humanizada da Mariana');
assert(dashHtml.includes('Seu início no Pinas Kit'), 'Dashboard possui o card de onboarding com progresso');
assert(dashHtml.includes('Próxima Ação Recomendada'), 'Dashboard possui o card dinâmico de próxima ação');
assert(dashHtml.includes('Seus leads hoje') && dashHtml.includes('24'), 'Métrica 1: Leads hoje (24)');
assert(dashHtml.includes('Conversas em andamento') && dashHtml.includes('8'), 'Métrica 2: Conversas em andamento (8)');
assert(dashHtml.includes('Vendas este mês') && dashHtml.includes('5'), 'Métrica 3: Vendas este mês (5)');
assert(dashHtml.includes('Investimento em anúncios') && dashHtml.includes('R$ 120,00'), 'Métrica 4: Investimento em anúncios (R$ 120,00)');
assert(dashHtml.includes('Precisa de ajuda?'), 'Dashboard possui o banner inferior de suporte guiado');
assert(dashHtml.includes('mobile-bottom-nav'), 'Dashboard possui barra de navegação mobile dedicada');

// 2.4 Modal de Qualificação
const qualModalHtml = renderQualificationModal();
assert(qualModalHtml.includes('Conte sobre seu momento.'), 'Modal de Qualificação possui título amigável');
assert(qualModalHtml.includes('custom-select-trigger'), 'Modal possui o seletor customizado sofisticado');
assert(qualModalHtml.includes('Preparar minha mensagem →'), 'Modal possui o botão de envio formatado');

// 2.5 Modal de Conexão de Anúncios
const adsModalHtml = renderConnectAdsModal();
assert(adsModalHtml.includes('Facebook Ads') && adsModalHtml.includes('Google Ads'), 'Modal de anúncios possui opções da Meta e Google');
assert(adsModalHtml.includes('OAuth 2.0 criptografado'), 'Modal possui selo de segurança e privacidade');

// 2.6 Modal do Construtor No-Code
const builderModalHtml = renderFormBuilderModal();
assert(builderModalHtml.includes('Construtor Visual No-Code'), 'Construtor possui cabeçalho de personalização');
assert(builderModalHtml.includes('btn-add-builder-option'), 'Construtor possui botão para adicionar novas opções');

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
assert(planContent.includes('Modelo D — Assistido, Didático, Premium e Extremamente Intuitivo'), 'Plano contém a especificação Modelo D');
assert(planContent.includes('workspace_ad_integrations'), 'Plano contém a arquitetura Multi-Tenant de Meta/Google Ads');

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
  console.log('\n✨ TODOS OS SISTEMAS ESTÃO 100% OPERACIONAIS E CONFORME O PLANO!\n');
}
