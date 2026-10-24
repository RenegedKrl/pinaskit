/* ==========================================================================
   PINAS KIT — STORAGE & STATE SERVICE
   ========================================================================== */

const STORAGE_KEYS = {
  THEME: 'pk_theme',
  LEADS: 'pk_leads',
  FORM_CONFIG: 'pk_form_config',
  AD_ACCOUNTS: 'pk_ad_accounts',
  CURRENT_VIEW: 'pk_current_view'
};

// Configuração padrão do formulário dinâmico
const DEFAULT_FORM_CONFIG = {
  title: 'Conte sobre seu momento.',
  subtitle: 'Preencha os campos para gerar uma mensagem de apresentação sob medida.',
  buttonText: 'Preparar minha mensagem →',
  questionLabel: 'O que melhor descreve seu momento?',
  options: [
    { id: '1', label: 'Quero crescer na minha carreira', score: 25, badge: '🔥 Quente' },
    { id: '2', label: 'Estou pensando em mudar de área', score: 20, badge: '❄️ Morno' },
    { id: '3', label: 'Quero melhorar meu posicionamento', score: 30, badge: '🔥 Quente' },
    { id: '4', label: 'Quero entender minhas possibilidades', score: 10, badge: '🧊 Frio' }
  ],
  whatsappNumber: '5511999999999',
  whatsappTemplate: 'Olá! Meu nome é {nome}. Vi o site e meu momento atual é: {momento}. Gostaria de falar sobre: {mensagem}'
};

// Leads iniciais demonstrativos (claramente identificados)
const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Ana Livia Pereira de Sousa Paulo',
    phone: '+55 11 97537-4960',
    email: 'analivia@email.com',
    button: 'Glúteo Feminino',
    origin: 'Google Ads',
    campaign: 'Google_Pesquisa_SP',
    temperature: 'Morno',
    score: 31,
    time: 'Hoje, 10:16',
    stage: 'Em conversa',
    notes: 'Interessada no procedimento estético para novembro.'
  },
  {
    id: 'lead-2',
    name: 'Andreza',
    phone: '+55 11 98181-4586',
    email: '-',
    button: 'Endolaser',
    origin: 'Google Ads',
    campaign: 'Google_Display_SP',
    temperature: 'Morno',
    score: 29,
    time: 'Hoje, 08:10',
    stage: 'Novo',
    notes: 'Perguntou sobre valores de parcelamento.'
  },
  {
    id: 'lead-3',
    name: 'Vitória de Freitas',
    phone: '+55 11 96490-6555',
    email: '-',
    button: 'Depilação a Laser',
    origin: 'Meta Ads',
    campaign: 'Insta_Stories_Criativo02',
    temperature: 'Quente',
    score: 52,
    time: 'Ontem, 16:59',
    stage: 'Venda',
    notes: 'Agendou sessão experimental para sexta-feira.'
  },
  {
    id: 'lead-4',
    name: 'Camila Souza',
    phone: '+55 11 91755-5108',
    email: '-',
    button: 'Mentoria de Carreira',
    origin: 'Instagram',
    campaign: 'Bio_Instagram',
    temperature: 'Quente',
    score: 48,
    time: 'Há 5 min',
    stage: 'Novo',
    notes: 'Escolheu a opção: Quero crescer na minha carreira.'
  }
];

export const StorageService = {
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.body.setAttribute('data-theme', theme);
  },

  getCurrentView() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_VIEW) || 'landing';
  },

  setCurrentView(view) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, view);
  },

  getLeads() {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    return data ? JSON.parse(data) : INITIAL_LEADS;
  },

  addLead(leadData) {
    const leads = this.getLeads();
    const newLead = {
      id: `lead-${Date.now()}`,
      time: 'Agora mesmo',
      stage: 'Novo',
      ...leadData
    };
    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    return newLead;
  },

  getFormConfig() {
    const data = localStorage.getItem(STORAGE_KEYS.FORM_CONFIG);
    return data ? JSON.parse(data) : DEFAULT_FORM_CONFIG;
  },

  saveFormConfig(config) {
    localStorage.setItem(STORAGE_KEYS.FORM_CONFIG, JSON.stringify(config));
  },

  getConnectedAds() {
    const data = localStorage.getItem(STORAGE_KEYS.AD_ACCOUNTS);
    return data ? JSON.parse(data) : { facebook: false, instagram: false, google: false };
  },

  setConnectedAds(adsState) {
    localStorage.setItem(STORAGE_KEYS.AD_ACCOUNTS, JSON.stringify(adsState));
  }
};
