/* ==========================================================================
   PINAS KIT — STORAGE & STATE SERVICE (CENTRALKIT V7.0)
   ========================================================================== */

const STORAGE_KEYS = {
  THEME: 'pk_theme',
  LEADS: 'pk_leads',
  BUTTONS: 'pk_buttons',
  FORM_CONFIG: 'pk_form_config',
  AD_ACCOUNTS: 'pk_ad_accounts',
  CURRENT_VIEW: 'pk_current_view',
  CURRENT_DASH_TAB: 'pk_current_dash_tab'
};

// Botões / Sites Iniciais (Pastas de Captação)
const INITIAL_BUTTONS = [
  {
    id: 'btn-1',
    name: 'Glúteo Feminino',
    slug: 'gluteo-feminino',
    category: 'Procedimento Estético',
    siteUrl: 'https://clinicaestetica.com.br/gluteo-feminino',
    whatsappNumber: '5511975374960',
    status: 'Ativo',
    clicks: 410,
    leadsCount: 45,
    conversionRate: '10.9%',
    formConfig: {
      title: 'Conte sobre seu momento.',
      subtitle: 'Preencha os campos para receber uma avaliação personalizada.',
      buttonText: 'Preparar minha mensagem →',
      questionLabel: 'Qual é o seu objetivo principal hoje?',
      options: [
        { id: '1', label: 'Quero tonificação e aumento de volume', score: 35, badge: '🔥 Quente' },
        { id: '2', label: 'Gostaria de entender valores e parcelamento', score: 25, badge: '❄️ Morno' },
        { id: '3', label: 'Tenho interesse para os próximos meses', score: 15, badge: '🧊 Frio' }
      ],
      whatsappTemplate: 'Olá! Meu nome é {nome}. Vi o site sobre Glúteo Feminino e meu objetivo é: {momento}. Detalhes: {mensagem}'
    }
  },
  {
    id: 'btn-2',
    name: 'Endolaser',
    slug: 'endolaser',
    category: 'Laser & Gordura Localizada',
    siteUrl: 'https://clinicaestetica.com.br/endolaser',
    whatsappNumber: '5511981814586',
    status: 'Ativo',
    clicks: 189,
    leadsCount: 19,
    conversionRate: '10.0%',
    formConfig: {
      title: 'Conte sobre seu momento.',
      subtitle: 'Preencha para tirar dúvidas sobre o procedimento de Endolaser.',
      buttonText: 'Falar com especialista →',
      questionLabel: 'Qual região você gostaria de tratar?',
      options: [
        { id: '1', label: 'Papada ou pescoço', score: 30, badge: '🔥 Quente' },
        { id: '2', label: 'Abdômen ou flancos', score: 30, badge: '🔥 Quente' },
        { id: '3', label: 'Apenas pesquisando valores no momento', score: 10, badge: '🧊 Frio' }
      ],
      whatsappTemplate: 'Olá! Meu nome é {nome}. Quero saber mais sobre Endolaser para: {momento}.'
    }
  },
  {
    id: 'btn-3',
    name: 'Consulta Médica',
    slug: 'consulta-medica',
    category: 'Consultório & Avaliação',
    siteUrl: 'https://drmedico.com.br/agendamento',
    whatsappNumber: '5511964906555',
    status: 'Ativo',
    clicks: 342,
    leadsCount: 28,
    conversionRate: '8.1%',
    formConfig: {
      title: 'Conte sobre seu momento.',
      subtitle: 'Agende sua primeira consulta com nosso especialista.',
      buttonText: 'Agendar Consulta no WhatsApp →',
      questionLabel: 'O que melhor descreve sua necessidade médica?',
      options: [
        { id: '1', label: 'Consulta de urgência / dor aguda', score: 40, badge: '🔥 Quente' },
        { id: '2', label: 'Check-up de rotina ou acompanhamento', score: 25, badge: '❄️ Morno' },
        { id: '3', label: 'Segunda opinião médica', score: 30, badge: '🔥 Quente' }
      ],
      whatsappTemplate: 'Olá Dr.! Meu nome é {nome}. Vi seu site e gostaria de agendar uma consulta para: {momento}.'
    }
  }
];

// Leads Iniciais (Fielmente baseados na tela de Leads da CentralKit - Imagem 2)
const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Ana Livia Pereira de Sousa Paulo',
    phone: '+55 11 97537-4960',
    email: '-',
    button: 'Glúteo Feminino',
    origin: 'Google Ads',
    campaign: 'Google_Pesquisa_SP',
    temperature: 'Morno',
    score: 31,
    interactions: 1,
    lastVisit: '15/10/2026, 10:16',
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
    interactions: 1,
    lastVisit: '15/10/2026, 08:10',
    stage: 'Novo',
    notes: 'Perguntou sobre valores de parcelamento.'
  },
  {
    id: 'lead-3',
    name: 'VITORIA DE FREITAS',
    phone: '+55 11 96490-6555',
    email: '-',
    button: 'Depilação á Laser',
    origin: 'Google Ads',
    campaign: 'Google_Campanha_Feminina',
    temperature: 'Morno',
    score: 27,
    interactions: 1,
    lastVisit: '12/10/2026, 16:59',
    stage: 'Em conversa',
    notes: 'Quer saber sobre pacotes de 10 sessões.'
  },
  {
    id: 'lead-4',
    name: 'Luana',
    phone: '+55 11 91755-5108',
    email: '-',
    button: 'Glúteo Feminino',
    origin: 'Google',
    campaign: 'Orgânico_Busca_Direta',
    temperature: 'Frio',
    score: 12,
    interactions: 1,
    lastVisit: '09/10/2026, 14:12',
    stage: 'Novo',
    notes: 'Visitou a página e preencheu nome e telefone.'
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

  getCurrentDashTab() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_DASH_TAB) || 'overview';
  },

  setCurrentDashTab(tab) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DASH_TAB, tab);
  },

  // --- GERENCIAMENTO DE BOTÕES (CENTRALKIT) ---
  getButtons() {
    const data = localStorage.getItem(STORAGE_KEYS.BUTTONS);
    return data ? JSON.parse(data) : INITIAL_BUTTONS;
  },

  getButtonById(id) {
    const buttons = this.getButtons();
    return buttons.find(b => b.id === id) || buttons[0];
  },

  saveButton(buttonData) {
    const buttons = this.getButtons();
    const existingIndex = buttons.findIndex(b => b.id === buttonData.id);
    if (existingIndex >= 0) {
      buttons[existingIndex] = { ...buttons[existingIndex], ...buttonData };
    } else {
      buttons.push({
        id: `btn-${Date.now()}`,
        clicks: 0,
        leadsCount: 0,
        conversionRate: '0.0%',
        status: 'Ativo',
        ...buttonData
      });
    }
    localStorage.setItem(STORAGE_KEYS.BUTTONS, JSON.stringify(buttons));
    return buttons;
  },

  deleteButton(id) {
    let buttons = this.getButtons();
    buttons = buttons.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BUTTONS, JSON.stringify(buttons));
    return buttons;
  },

  // --- GERENCIAMENTO DE LEADS (CENTRALKIT) ---
  getLeads(buttonFilter = 'Todos', stageFilter = 'Todos') {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    const leads = data ? JSON.parse(data) : INITIAL_LEADS;
    return leads.filter(lead => {
      const matchButton = buttonFilter === 'Todos' || lead.button === buttonFilter;
      const matchStage = stageFilter === 'Todos' || lead.stage === stageFilter;
      return matchButton && matchStage;
    });
  },

  addLead(leadData) {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    const leads = data ? JSON.parse(data) : INITIAL_LEADS;
    const newLead = {
      id: `lead-${Date.now()}`,
      interactions: 1,
      lastVisit: 'Agora mesmo',
      stage: 'Novo',
      ...leadData
    };
    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));

    // Incrementa estatística do botão correspondente
    if (leadData.button) {
      const buttons = this.getButtons();
      const targetBtn = buttons.find(b => b.name === leadData.button);
      if (targetBtn) {
        targetBtn.leadsCount = (targetBtn.leadsCount || 0) + 1;
        targetBtn.clicks = (targetBtn.clicks || 0) + 1;
        targetBtn.conversionRate = `${((targetBtn.leadsCount / targetBtn.clicks) * 100).toFixed(1)}%`;
        localStorage.setItem(STORAGE_KEYS.BUTTONS, JSON.stringify(buttons));
      }
    }

    return newLead;
  },

  deleteLead(id) {
    let leads = this.getLeads();
    leads = leads.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    return leads;
  },

  // --- CONFIGURAÇÃO GLOBAL DE FORMULÁRIO (PADRÃO FALLBACK) ---
  getFormConfig() {
    const data = localStorage.getItem(STORAGE_KEYS.FORM_CONFIG);
    return data ? JSON.parse(data) : INITIAL_BUTTONS[0].formConfig;
  },

  saveFormConfig(config) {
    localStorage.setItem(STORAGE_KEYS.FORM_CONFIG, JSON.stringify(config));
  },

  // --- INTEGRAÇÕES DE ANÚNCIOS (META & GOOGLE) ---
  getConnectedAds() {
    const data = localStorage.getItem(STORAGE_KEYS.AD_ACCOUNTS);
    return data ? JSON.parse(data) : { facebook: false, instagram: false, google: false };
  },

  setConnectedAds(adsState) {
    localStorage.setItem(STORAGE_KEYS.AD_ACCOUNTS, JSON.stringify(adsState));
  }
};
