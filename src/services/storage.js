/* ==========================================================================
   PINAS KIT — STORAGE & STATE SERVICE (CENTRALKIT V7.0)
   ========================================================================== */

const STORAGE_KEYS = {
  THEME: 'pk_theme',
  LEADS: 'pk_leads',
  BUTTONS: 'pk_buttons',
  FORM_CONFIG: 'pk_form_config',
  AD_ACCOUNTS: 'pk_ad_accounts',
  CAMPAIGNS: 'pk_campaigns',
  CURRENT_VIEW: 'pk_current_view',
  CURRENT_DASH_TAB: 'pk_current_dash_tab',
  SCORING_RULES: 'pk_scoring_rules',
  LEAD_AUTOMATION: 'pk_lead_automation',
  PRODUCTS: 'pk_products',
  DEALS: 'pk_deals'
};

// Configurações Padrão de Pontuação de Leads (Lead Scoring Engine - Modelo CentralKit)
const DEFAULT_SCORING_RULES = {
  thresholds: {
    coldMax: 30,    // 0 a 30: Frio
    warmMax: 70     // 31 a 70: Morno; > 70: Quente
  },
  pageViewPoints: 5,      // Pontos por página visualizada
  repeatVisitPoints: 15,  // Pontos por retorno/sessão separada
  paidAdBonus: 25,        // Bônus se veio de tráfego pago (Meta/Google Ads)
  emailBonus: 20,         // Bônus se informou e-mail
  formHotScore: 35,       // Opção de alta intenção
  formWarmScore: 25,      // Opção de intenção moderada
  formColdScore: 15       // Opção de curiosidade/longo prazo
};

const DEFAULT_LEAD_AUTOMATION = {
  autoCreateDeal: true,
  initialCrmStage: 'Novo',
  notifyOnHotLead: true
};

// Formatação e conversão de moeda BRL (Centavos <-> R$)
export function formatCurrencyBRL(cents) {
  return ((cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function parseCurrencyToCents(str) {
  if (!str) return 0;
  if (typeof str === 'number') return Math.round(str * 100);
  const clean = str.replace(/[^\d,.-]/g, '').trim();
  if (!clean) return 0;
  const numStr = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean;
  const val = Number(numStr);
  return Number.isFinite(val) ? Math.round(val * 100) : 0;
}

// Catálogo Oficial de Produtos e Serviços (/painel/crm/produtos - Modelo CentralKit)
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Mentoria de Carreira Individual',
    kind: 'service',
    price_cents: 250000,
    created_at: '2026-10-10'
  },
  {
    id: 'prod-2',
    name: 'Protocolo Glúteo Max',
    kind: 'service',
    price_cents: 180000,
    created_at: '2026-10-12'
  },
  {
    id: 'prod-3',
    name: 'Sessão Endolaser Facial & Papada',
    kind: 'service',
    price_cents: 320000,
    created_at: '2026-10-05'
  },
  {
    id: 'prod-4',
    name: 'Kit Home Care Pós-Procedimento',
    kind: 'product',
    price_cents: 35000,
    created_at: '2026-10-15'
  },
  {
    id: 'prod-5',
    name: 'Consulta Médica de Avaliação Especializada',
    kind: 'service',
    price_cents: 45000,
    created_at: '2026-10-08'
  }
];

// Oportunidades & Negócios no CRM (/painel/crm - 5 Etapas CentralKit)
const INITIAL_DEALS = [
  {
    id: 'deal-1',
    title: 'Mentoria Executiva - Ana Paula',
    leadId: 'lead-1',
    contactName: 'Ana Livia Pereira de Sousa Paulo',
    contactPhone: '+55 11 97537-4960',
    contactEmail: 'analivia.sousa@gmail.com',
    stage: 'Novo',
    status: 'open',
    price_cents: 250000,
    productId: 'prod-1',
    productName: 'Mentoria de Carreira Individual',
    assignedTo: 'Mariana',
    notes: 'Interessada no alinhamento para transição de carreira nos próximos meses.',
    updated_at: '2026-10-24T14:30:00Z',
    created_at: '2026-10-24T10:16:00Z'
  },
  {
    id: 'deal-2',
    title: 'Harmonização Corporal - Andreza',
    leadId: 'lead-2',
    contactName: 'Andreza Ferreira',
    contactPhone: '+55 11 98181-4586',
    contactEmail: 'andreza.estetica@outlook.com',
    stage: 'Qualificação',
    status: 'open',
    price_cents: 180000,
    productId: 'prod-2',
    productName: 'Protocolo Glúteo Max',
    assignedTo: 'Mariana',
    notes: 'Gostaria de entender valores e parcelamento no cartão.',
    updated_at: '2026-10-23T11:20:00Z',
    created_at: '2026-10-23T09:15:00Z'
  },
  {
    id: 'deal-3',
    title: 'Endolaser Facial - Carlos Eduardo',
    leadId: 'lead-3',
    contactName: 'Carlos Eduardo Mendes',
    contactPhone: '+55 11 96490-6555',
    contactEmail: 'carlos.mendes@empresa.com.br',
    stage: 'Proposta',
    status: 'open',
    price_cents: 320000,
    productId: 'prod-3',
    productName: 'Sessão Endolaser Facial & Papada',
    assignedTo: 'Mariana',
    notes: 'Proposta detalhada enviada no WhatsApp. Aguardando retorno.',
    updated_at: '2026-10-15T10:00:00Z',
    created_at: '2026-10-14T16:00:00Z'
  },
  {
    id: 'deal-4',
    title: 'Mentoria Aceleração - Juliana Costa',
    leadId: 'lead-4',
    contactName: 'Juliana Costa',
    contactPhone: '+55 11 97788-9900',
    contactEmail: 'juliana.costa@techlead.io',
    stage: 'Negociação',
    status: 'open',
    price_cents: 250000,
    productId: 'prod-1',
    productName: 'Mentoria de Carreira Individual',
    assignedTo: 'Mariana',
    notes: 'Alinhando datas para as sessões quinzenais.',
    updated_at: '2026-10-24T08:45:00Z',
    created_at: '2026-10-22T14:00:00Z'
  },
  {
    id: 'deal-5',
    title: 'Checkup & Consulta - Dr. Roberto',
    leadId: 'lead-5',
    contactName: 'Roberto Alves de Toledo',
    contactPhone: '+55 11 91234-5678',
    contactEmail: 'roberto.alves@consultoria.com',
    stage: 'Fechamento',
    status: 'won',
    price_cents: 45000,
    productId: 'prod-5',
    productName: 'Consulta Médica de Avaliação Especializada',
    assignedTo: 'Mariana',
    notes: 'Fechamento concluído. Pagamento via PIX confirmado!',
    updated_at: '2026-10-23T17:00:00Z',
    created_at: '2026-10-21T11:30:00Z'
  },
  {
    id: 'deal-6',
    title: 'Tratamento Corporal - Camila',
    leadId: 'lead-6',
    contactName: 'Camila Rocha',
    contactPhone: '+55 11 99911-2233',
    contactEmail: 'camila.rocha@uol.com.br',
    stage: 'Qualificação',
    status: 'lost',
    lostReason: 'Preço',
    price_cents: 180000,
    productId: 'prod-2',
    productName: 'Protocolo Glúteo Max',
    assignedTo: 'Mariana',
    notes: 'Achei acima do orçamento no momento. Entrar em contato na Black Friday.',
    updated_at: '2026-10-20T16:00:00Z',
    created_at: '2026-10-19T13:00:00Z'
  }
];

// Campanhas de Anúncios Iniciais (Meta & Google Ads com Atribuição de Tráfego)
const INITIAL_CAMPAIGNS = [
  {
    id: 'camp-1',
    name: 'Glúteo Feminino - Feed & Stories SP',
    platform: 'meta',
    platformName: 'Meta Ads',
    status: 'Ativa',
    spend: 450.00,
    clicks: 380,
    impressions: 14200,
    cpc: 1.18,
    targetButton: 'Glúteo Feminino',
    targetUrl: 'https://clinicaestetica.com.br/gluteo-feminino',
    utmCampaign: 'campanha-gluteo-outubro',
    utmSource: 'meta_ads',
    utmMedium: 'feed_stories',
    leadsCount: 30,
    hotLeadsCount: 18,
    salesCount: 4,
    revenue: 5000.00,
    createdAt: '2026-10-01'
  },
  {
    id: 'camp-2',
    name: 'Endolaser Facial & Papada - Pesquisa',
    platform: 'google',
    platformName: 'Google Ads',
    status: 'Ativa',
    spend: 600.00,
    clicks: 210,
    impressions: 5800,
    cpc: 2.85,
    targetButton: 'Endolaser',
    targetUrl: 'https://clinicaestetica.com.br/endolaser',
    utmCampaign: 'endolaser-rosto-corpo',
    utmSource: 'google_ads',
    utmMedium: 'cpc',
    leadsCount: 12,
    hotLeadsCount: 5,
    salesCount: 2,
    revenue: 5600.00,
    createdAt: '2026-10-05'
  },
  {
    id: 'camp-3',
    name: 'Limpeza de Pele & Botox Express',
    platform: 'meta',
    platformName: 'Meta Ads',
    status: 'Ativa',
    spend: 150.00,
    clicks: 180,
    impressions: 8400,
    cpc: 0.83,
    targetButton: 'Glúteo Feminino',
    targetUrl: 'https://clinicaestetica.com.br/gluteo-feminino',
    utmCampaign: 'botox-express-promo',
    utmSource: 'meta_ads',
    utmMedium: 'reels',
    leadsCount: 25,
    hotLeadsCount: 14,
    salesCount: 5,
    revenue: 4250.00,
    createdAt: '2026-10-10'
  },
  {
    id: 'camp-4',
    name: 'Depilação a Laser - Verão Sem Dor',
    platform: 'meta',
    platformName: 'Meta Ads',
    status: 'Ativa',
    spend: 320.00,
    clicks: 240,
    impressions: 9600,
    cpc: 1.33,
    targetButton: 'Depilação á Laser',
    targetUrl: 'https://clinicaestetica.com.br/depilacao-laser',
    utmCampaign: 'depilacao-laser-verao',
    utmSource: 'meta_ads',
    utmMedium: 'stories',
    leadsCount: 20,
    hotLeadsCount: 11,
    salesCount: 3,
    revenue: 4470.00,
    createdAt: '2026-10-08'
  },
  {
    id: 'camp-5',
    name: 'Consulta Médica Preventiva & Check-up',
    platform: 'google',
    platformName: 'Google Ads',
    status: 'Pausada',
    spend: 180.00,
    clicks: 95,
    impressions: 3100,
    cpc: 1.89,
    targetButton: 'Consulta Médica',
    targetUrl: 'https://drmedico.com.br/agendamento',
    utmCampaign: 'consulta-checkup-sp',
    utmSource: 'google_ads',
    utmMedium: 'cpc',
    leadsCount: 8,
    hotLeadsCount: 3,
    salesCount: 1,
    revenue: 450.00,
    createdAt: '2026-10-02'
  }
];

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
  },
  {
    id: 'btn-1792870382402',
    name: 'Mentoria de Carreira',
    slug: 'mentoria-de-carreira',
    category: 'Mentoria & Coaching Profissional',
    siteUrl: 'https://brunamentoriadecarreira.vercel.app',
    whatsappNumber: '5511941713647',
    status: 'Ativo',
    clicks: 120,
    leadsCount: 14,
    conversionRate: '11.6%',
    formConfig: {
      title: 'Aplicação para Mentoria',
      subtitle: 'Preencha os campos para iniciar o alinhamento com a mentoria. Retorno em até 24 horas úteis.',
      buttonText: 'Enviar Aplicação',
      questionLabel: 'Qual é o seu objetivo principal hoje?',
      options: [
        { id: '1', label: 'Transição de Carreira e Novos Desafios', score: 35, badge: '🔥 Quente' },
        { id: '2', label: 'Gostaria de entender valores e parcelamento', score: 25, badge: '❄️ Morno' },
        { id: '3', label: 'Tenho interesse para os próximos meses', score: 15, badge: '🧊 Frio' }
      ],
      whatsappTemplate: 'Olá Bruna! Meu nome é {nome}. Vi o site da Mentoria de Carreira e meu objetivo é: {momento}.'
    }
  }
];

// Leads Iniciais (Fielmente baseados na tela de Leads da CentralKit - Imagem 2 com enriquecimento completo)
const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Ana Livia Pereira de Sousa Paulo',
    phone: '+55 11 97537-4960',
    email: 'analivia.sousa@gmail.com',
    button: 'Glúteo Feminino',
    origin: 'Google Ads',
    campaign: 'Google_Pesquisa_SP',
    utmSource: 'google_ads',
    utmMedium: 'cpc',
    utmCampaign: 'campanha-gluteo-outubro',
    utmContent: 'criativo-responsivo-texto-01',
    utmTerm: 'harmonizacao gluteo sp centro',
    temperature: 'Morno',
    score: 31,
    interactions: 1,
    lastVisit: '15/10/2026, 10:16',
    stage: 'Em conversa',
    qualQuestion: 'Qual o seu objetivo principal com o tratamento?',
    qualAnswer: 'Quero modelar e aumentar o volume (+30 pts)',
    userMessage: 'Olá! Gostaria de agendar uma avaliação presencial no sábado.',
    activityNotes: [
      {
        id: 'note-1',
        author: 'Mariana',
        text: 'Lead super interessada, pediu retorno via WhatsApp na quinta-feira após às 14h.',
        date: '15/10/2026, 10:25'
      }
    ],
    timeline: [
      {
        time: '15/10/2026, 10:25',
        icon: '📝',
        title: 'Anotação interna adicionada',
        desc: 'Interessada no procedimento para novembro, prefere sábado.'
      },
      {
        time: '15/10/2026, 10:20',
        icon: '💬',
        title: 'Conversa no WhatsApp iniciada',
        desc: 'Contato respondido via WhatsApp (+55 11 97537-4960)'
      },
      {
        time: '15/10/2026, 10:16',
        icon: '📋',
        title: 'Formulário de Qualificação preenchido',
        desc: 'Pontuação: 31 pontos · Temperatura: Morno'
      },
      {
        time: '15/10/2026, 10:14',
        icon: '🎯',
        title: 'Clique no Anúncio Google Ads',
        desc: 'Termo: "harmonizacao gluteo sp centro" (CPC: R$ 2,40)'
      }
    ]
  },
  {
    id: 'lead-2',
    name: 'Andreza',
    phone: '+55 11 98181-4586',
    email: 'andreza.estetica@outlook.com',
    button: 'Endolaser',
    origin: 'Google Ads',
    campaign: 'Google_Display_SP',
    utmSource: 'google_ads',
    utmMedium: 'display',
    utmCampaign: 'endolaser-rosto-corpo',
    utmContent: 'banner-antes-depois-300x250',
    utmTerm: 'endolaser papada sp',
    temperature: 'Morno',
    score: 29,
    interactions: 1,
    lastVisit: '15/10/2026, 08:10',
    stage: 'Novo',
    qualQuestion: 'Qual região você gostaria de tratar?',
    qualAnswer: 'Papada ou pescoço (+30 pts)',
    userMessage: 'Gostaria de saber valores e quantas sessões são recomendadas.',
    activityNotes: [
      {
        id: 'note-2',
        author: 'Mariana',
        text: 'Perguntou sobre valores de parcelamento no cartão em até 12x.',
        date: '15/10/2026, 08:15'
      }
    ],
    timeline: [
      {
        time: '15/10/2026, 08:10',
        icon: '📋',
        title: 'Contato capturado no site',
        desc: 'Botão Endolaser Facial (Score: 29 pontos)'
      },
      {
        time: '15/10/2026, 08:08',
        icon: '🎯',
        title: 'Clique em Anúncio Google Display',
        desc: 'Campanha Endolaser Rosto & Corpo'
      }
    ]
  },
  {
    id: 'lead-3',
    name: 'VITORIA DE FREITAS',
    phone: '+55 11 96490-6555',
    email: 'vitoria.freitas@gmail.com',
    button: 'Depilação á Laser',
    origin: 'Meta Ads',
    campaign: 'Instagram_Stories_Promo',
    utmSource: 'meta_ads',
    utmMedium: 'stories',
    utmCampaign: 'depilacao-laser-verao',
    utmContent: 'video-reels-depilacao-laser',
    utmTerm: 'depilacao laser sem dor',
    temperature: 'Quente',
    score: 52,
    interactions: 2,
    lastVisit: '12/10/2026, 16:59',
    stage: 'Em conversa',
    qualQuestion: 'Qual área do corpo você deseja iniciar?',
    qualAnswer: 'Corpo inteiro / Pacote VIP (+40 pts)',
    userMessage: 'Quero saber se tem horário disponível para iniciar esta semana ainda.',
    activityNotes: [
      {
        id: 'note-3',
        author: 'Mariana',
        text: 'Cliente pronta para fechar o pacote de 10 sessões.',
        date: '12/10/2026, 17:10'
      }
    ],
    timeline: [
      {
        time: '12/10/2026, 17:05',
        icon: '🔥',
        title: 'Lead classificado como Quente (52 pts)',
        desc: 'Alta intenção de compra identificada'
      },
      {
        time: '12/10/2026, 16:59',
        icon: '🎯',
        title: 'Clique no Anúncio Meta Ads (Instagram Stories)',
        desc: 'Campanha Depilação a Laser Verão'
      }
    ]
  },
  {
    id: 'lead-4',
    name: 'Luana',
    phone: '+55 11 91755-5108',
    email: '-',
    button: 'Glúteo Feminino',
    origin: 'Google',
    campaign: 'Orgânico_Busca_Direta',
    utmSource: 'organico',
    utmMedium: 'direto',
    utmCampaign: 'busca-organica-google',
    utmContent: '-',
    utmTerm: 'clinica luana albuquerque',
    temperature: 'Frio',
    score: 12,
    interactions: 1,
    lastVisit: '09/10/2026, 14:12',
    stage: 'Novo',
    qualQuestion: 'Qual o seu objetivo principal com o tratamento?',
    qualAnswer: 'Apenas pesquisando valores no momento (+10 pts)',
    userMessage: 'Olá, apenas dando uma olhada.',
    activityNotes: [],
    timeline: [
      {
        time: '09/10/2026, 14:12',
        icon: '🧊',
        title: 'Lead capturado (Frio - 12 pts)',
        desc: 'Apenas pesquisando preços no momento'
      }
    ]
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
    let savedButton;
    if (existingIndex >= 0) {
      savedButton = { ...buttons[existingIndex], ...buttonData };
      buttons[existingIndex] = savedButton;
    } else {
      savedButton = {
        id: buttonData.id || `btn-${Date.now()}`,
        clicks: 0,
        leadsCount: 0,
        conversionRate: '0.0%',
        status: buttonData.status || 'Ativo',
        ...buttonData
      };
      buttons.push(savedButton);
    }
    localStorage.setItem(STORAGE_KEYS.BUTTONS, JSON.stringify(buttons));
    return savedButton;
  },

  deleteButton(id) {
    let buttons = this.getButtons();
    buttons = buttons.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BUTTONS, JSON.stringify(buttons));
    return buttons;
  },

  updateButtonSiteUrl(id, siteUrl) {
    const buttons = this.getButtons();
    const btn = buttons.find(b => b.id === id);
    if (btn) {
      btn.siteUrl = (siteUrl || '').trim();
      localStorage.setItem(STORAGE_KEYS.BUTTONS, JSON.stringify(buttons));
      return btn;
    }
    return null;
  },

  // --- GERENCIAMENTO DE LEADS (CENTRALKIT) ---
  async syncRemoteLeads() {
    try {
      if (typeof window === 'undefined' || !window.fetch) return;
      const res = await fetch('/api/leads');
      if (res.ok) {
        const remoteLeads = await res.json();
        if (Array.isArray(remoteLeads) && remoteLeads.length > 0) {
          const current = this.getLeads();
          const existingIds = new Set(current.map(l => l.id));
          let changed = false;
          for (const rl of remoteLeads) {
            if (!existingIds.has(rl.id)) {
              current.unshift(rl);
              changed = true;
            }
          }
          if (changed) {
            localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(current));
          }
        }
      }
    } catch (_) {}
  },

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

  getLeadById(id) {
    const leads = this.getLeads();
    return leads.find(l => l.id === id) || null;
  },

  updateLead(id, updates) {
    let leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx !== -1) {
      leads[idx] = { ...leads[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      return leads[idx];
    }
    return null;
  },

  updateLeadField(id, field, value) {
    return this.updateLead(id, { [field]: value });
  },

  deleteLeads(ids) {
    let leads = this.getLeads();
    const idSet = new Set(ids);
    leads = leads.filter(l => !idSet.has(l.id));
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    return leads;
  },

  updateLeadStage(id, newStage, author = 'Mariana') {
    const lead = this.getLeadById(id);
    if (!lead) return null;
    const oldStage = lead.stage || 'Novo';
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('pt-BR')}, ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const timeline = lead.timeline || [];
    timeline.unshift({
      time: timeStr,
      icon: '🔄',
      title: `Estágio alterado para "${newStage}"`,
      desc: `Atualizado por ${author} (anterior: ${oldStage})`
    });

    return this.updateLead(id, { stage: newStage, timeline });
  },

  addLeadNote(id, noteText, author = 'Mariana') {
    const lead = this.getLeadById(id);
    if (!lead) return null;
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('pt-BR')}, ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const notes = lead.activityNotes || [];
    const newNote = {
      id: `note-${Date.now()}`,
      author,
      text: noteText,
      date: timeStr
    };
    notes.unshift(newNote);

    const timeline = lead.timeline || [];
    timeline.unshift({
      time: timeStr,
      icon: '📝',
      title: `Nova anotação de ${author}`,
      desc: noteText.length > 60 ? noteText.slice(0, 60) + '...' : noteText
    });

    return this.updateLead(id, { activityNotes: notes, timeline });
  },

  // --- CONFIGURAÇÃO GLOBAL DE FORMULÁRIO (PADRÃO FALLBACK) ---
  getFormConfig() {
    const data = localStorage.getItem(STORAGE_KEYS.FORM_CONFIG);
    return data ? JSON.parse(data) : INITIAL_BUTTONS[0].formConfig;
  },

  saveFormConfig(config) {
    localStorage.setItem(STORAGE_KEYS.FORM_CONFIG, JSON.stringify(config));
  },

  // --- REGRAS DE PONTUAÇÃO DE LEADS (LEAD SCORING ENGINE) ---
  getScoringRules() {
    const data = localStorage.getItem(STORAGE_KEYS.SCORING_RULES);
    return data ? JSON.parse(data) : DEFAULT_SCORING_RULES;
  },

  saveScoringRules(rules) {
    const current = this.getScoringRules();
    const merged = { ...current, ...rules };
    localStorage.setItem(STORAGE_KEYS.SCORING_RULES, JSON.stringify(merged));
    return merged;
  },

  // --- AUTOMAÇÕES DE LEADS & CRM ---
  getLeadAutomationSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.LEAD_AUTOMATION);
    return data ? JSON.parse(data) : DEFAULT_LEAD_AUTOMATION;
  },

  saveLeadAutomationSettings(settings) {
    const current = this.getLeadAutomationSettings();
    const merged = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.LEAD_AUTOMATION, JSON.stringify(merged));
    return merged;
  },

  // --- INTEGRAÇÕES DE ANÚNCIOS (META & GOOGLE) ---
  getConnectedAds() {
    const data = localStorage.getItem(STORAGE_KEYS.AD_ACCOUNTS);
    return data ? JSON.parse(data) : { facebook: false, instagram: false, google: false };
  },

  setConnectedAds(adsState) {
    localStorage.setItem(STORAGE_KEYS.AD_ACCOUNTS, JSON.stringify(adsState));
  },

  // --- MÓDULO DE CAMPANHAS & ATRIBUIÇÃO DE TRÁFEGO ---
  getCampaigns(platformFilter = 'Todas', statusFilter = 'Todas', searchQuery = '') {
    const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    let campaigns = data ? JSON.parse(data) : INITIAL_CAMPAIGNS;

    // Enriquece cada campanha com cálculos dinâmicos de CPL, ROI e Taxa de Conversão
    campaigns = campaigns.map(camp => {
      const spend = Number(camp.spend) || 0;
      const clicks = Number(camp.clicks) || 0;
      const impressions = Number(camp.impressions) || 0;
      const leadsCount = Number(camp.leadsCount) || 0;
      const salesCount = Number(camp.salesCount) || 0;
      const revenue = Number(camp.revenue) || 0;

      // Custo Real por Lead (CPL)
      const cpl = leadsCount > 0 ? (spend / leadsCount) : spend;

      // Retorno sobre o Investimento em Anúncios (ROI / ROAS)
      const roi = spend > 0 ? (revenue / spend) : 0;

      // Custo por Clique (CPC)
      const cpc = clicks > 0 ? (spend / clicks) : 0;

      // Taxa de Conversão de Cliques em Leads no WhatsApp
      const convRate = clicks > 0 ? ((leadsCount / clicks) * 100).toFixed(1) : '0.0';

      // Classificação de Desempenho (Modelo D: Visual & Didático)
      let tier = { badge: '✨ Saudável', class: 'pk-badge-success', tip: 'Campanha gerando contatos com bom custo-benefício.' };
      if (roi >= 4.0) {
        tier = { badge: '🔥 Super ROI', class: 'pk-badge-hot', tip: 'Excelente retorno! Recomendado escalar o orçamento.' };
      } else if (cpl > 40.0) {
        tier = { badge: '⚠️ Custo Alto', class: 'pk-badge-warm', tip: 'Custo por contato elevado. Teste novos criativos ou públicos.' };
      } else if (camp.status === 'Pausada') {
        tier = { badge: '⏸️ Pausada', class: 'pk-badge-cold', tip: 'Campanha inativa no gerenciador de anúncios.' };
      }

      return {
        ...camp,
        spend,
        clicks,
        impressions,
        leadsCount,
        salesCount,
        revenue,
        cpl: cpl.toFixed(2),
        roi: roi.toFixed(1),
        cpc: cpc.toFixed(2),
        convRate,
        tier
      };
    });

    // Filtros
    return campaigns.filter(c => {
      const matchPlatform = platformFilter === 'Todas' 
        || (platformFilter === 'meta' && c.platform === 'meta')
        || (platformFilter === 'google' && c.platform === 'google')
        || c.platform === platformFilter;

      const matchStatus = statusFilter === 'Todas' || c.status === statusFilter;

      const q = (searchQuery || '').toLowerCase().trim();
      const matchSearch = !q 
        || c.name.toLowerCase().includes(q) 
        || (c.targetButton && c.targetButton.toLowerCase().includes(q))
        || (c.utmCampaign && c.utmCampaign.toLowerCase().includes(q));

      return matchPlatform && matchStatus && matchSearch;
    });
  },

  getCampaignById(id) {
    const list = this.getCampaigns('Todas', 'Todas');
    return list.find(c => c.id === id) || null;
  },

  saveCampaign(campaignData) {
    const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    let campaigns = data ? JSON.parse(data) : INITIAL_CAMPAIGNS;
    const idx = campaigns.findIndex(c => c.id === campaignData.id);

    let saved;
    if (idx >= 0) {
      saved = { ...campaigns[idx], ...campaignData };
      campaigns[idx] = saved;
    } else {
      saved = {
        id: campaignData.id || `camp-${Date.now()}`,
        status: 'Ativa',
        clicks: 0,
        impressions: 0,
        leadsCount: 0,
        salesCount: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0],
        ...campaignData
      };
      campaigns.unshift(saved);
    }
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    return saved;
  },

  toggleCampaignStatus(id) {
    const camp = this.getCampaignById(id);
    if (!camp) return null;
    const nextStatus = camp.status === 'Ativa' ? 'Pausada' : 'Ativa';
    return this.saveCampaign({ ...camp, status: nextStatus });
  },

  getAggregatedAdMetrics() {
    const all = this.getCampaigns('Todas', 'Todas');
    const active = all.filter(c => c.status === 'Ativa');

    const totalSpend = all.reduce((sum, c) => sum + c.spend, 0);
    const totalLeads = all.reduce((sum, c) => sum + c.leadsCount, 0);
    const totalHotLeads = all.reduce((sum, c) => sum + (c.hotLeadsCount || 0), 0);
    const totalClicks = all.reduce((sum, c) => sum + c.clicks, 0);
    const totalSales = all.reduce((sum, c) => sum + c.salesCount, 0);
    const totalRevenue = all.reduce((sum, c) => sum + c.revenue, 0);

    const avgCpl = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : '0.00';
    const overallRoi = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : '0.0';
    const avgConvRate = totalClicks > 0 ? ((totalLeads / totalClicks) * 100).toFixed(1) : '0.0';

    // Campanha campeã (menor CPL e pelo menos 10 leads)
    const sortedByCpl = [...all].filter(c => c.leadsCount >= 10).sort((a, b) => Number(a.cpl) - Number(b.cpl));
    const bestCampaign = sortedByCpl[0] || all[0] || null;

    return {
      totalSpend: totalSpend.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      totalSpendRaw: totalSpend,
      totalLeads,
      totalHotLeads,
      totalClicks,
      totalSales,
      totalRevenue: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      totalRevenueRaw: totalRevenue,
      avgCpl: `R$ ${avgCpl}`,
      avgCplRaw: Number(avgCpl),
      overallRoi: `${overallRoi}x`,
      overallRoiRaw: Number(overallRoi),
      avgConvRate: `${avgConvRate}%`,
      bestCampaign,
      activeCampaignsCount: active.length,
      totalCampaignsCount: all.length
    };
  },

  generateUtmUrl({ baseUrl, utmSource, utmMedium, utmCampaign, utmContent, utmTerm }) {
    if (!baseUrl) return '';
    try {
      const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
      if (utmSource) url.searchParams.set('utm_source', utmSource);
      if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) url.searchParams.set('utm_campaign', utmCampaign);
      if (utmContent) url.searchParams.set('utm_content', utmContent);
      if (utmTerm) url.searchParams.set('utm_term', utmTerm);
      return url.toString();
    } catch {
      // Fallback para URL simples
      const params = [];
      if (utmSource) params.push(`utm_source=${encodeURIComponent(utmSource)}`);
      if (utmMedium) params.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
      if (utmCampaign) params.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
      if (utmContent) params.push(`utm_content=${encodeURIComponent(utmContent)}`);
      if (utmTerm) params.push(`utm_term=${encodeURIComponent(utmTerm)}`);
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${params.length ? separator + params.join('&') : ''}`;
    }
  },

  // --- GERENCIAMENTO DE PRODUTOS E SERVIÇOS (CENTRALKIT /painel/crm/produtos) ---
  getProducts() {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  saveProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: productData.id || `prod-${Date.now()}`,
      name: productData.name?.trim() || 'Novo Item',
      kind: productData.kind || 'service',
      price_cents: Number(productData.price_cents) || 0,
      created_at: productData.created_at || new Date().toISOString().split('T')[0]
    };
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  updateProduct(id, patch) {
    let products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...patch };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return products[idx];
    }
    return null;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return products;
  },

  // --- GERENCIAMENTO DE NEGÓCIOS & FUNIL KANBAN (CENTRALKIT /painel/crm) ---
  getDeals(statusFilter = 'open', searchQuery = '') {
    const data = localStorage.getItem(STORAGE_KEYS.DEALS);
    let deals = data ? JSON.parse(data) : INITIAL_DEALS;

    if (statusFilter && statusFilter !== 'all') {
      deals = deals.filter(d => d.status === statusFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      deals = deals.filter(d => {
        const full = `${d.title} ${d.contactName} ${d.contactPhone} ${d.contactEmail} ${d.productName || ''} ${d.assignedTo || ''}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return full.includes(q);
      });
    }

    return deals;
  },

  getDealById(id) {
    const deals = this.getDeals('all');
    return deals.find(d => d.id === id) || null;
  },

  saveDeal(dealData) {
    const deals = this.getDeals('all');
    const newDeal = {
      id: dealData.id || `deal-${Date.now()}`,
      title: dealData.title || 'Nova Oportunidade',
      leadId: dealData.leadId || null,
      contactName: dealData.contactName || 'Contato sem nome',
      contactPhone: dealData.contactPhone || '',
      contactEmail: dealData.contactEmail || '',
      stage: dealData.stage || 'Novo',
      status: dealData.status || 'open',
      price_cents: Number(dealData.price_cents) || 0,
      productId: dealData.productId || null,
      productName: dealData.productName || '',
      assignedTo: dealData.assignedTo || 'Mariana',
      notes: dealData.notes || '',
      updated_at: new Date().toISOString(),
      created_at: dealData.created_at || new Date().toISOString()
    };
    deals.unshift(newDeal);
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
    return newDeal;
  },

  updateDeal(id, patch) {
    let deals = this.getDeals('all');
    const idx = deals.findIndex(d => d.id === id);
    if (idx !== -1) {
      deals[idx] = { 
        ...deals[idx], 
        ...patch, 
        updated_at: new Date().toISOString() 
      };
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
      return deals[idx];
    }
    return null;
  },

  updateDealStage(id, newStage) {
    return this.updateDeal(id, { stage: newStage });
  },

  markDealWon(id) {
    return this.updateDeal(id, { status: 'won', stage: 'Fechamento' });
  },

  markDealLost(id, reason = 'Outro', notes = '') {
    return this.updateDeal(id, { 
      status: 'lost', 
      lostReason: reason,
      notes: notes ? `${notes} (Motivo: ${reason})` : `Perdido por: ${reason}`
    });
  },

  deleteDeal(id) {
    let deals = this.getDeals('all');
    deals = deals.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
    return deals;
  },

  createDealFromLead(leadId, productId = null) {
    const lead = this.getLeadById(leadId);
    if (!lead) return null;

    let product = null;
    if (productId) {
      product = this.getProductById(productId);
    } else {
      const products = this.getProducts();
      product = products.find(p => p.name.toLowerCase().includes(lead.button?.toLowerCase() || '')) || products[0];
    }

    const newDeal = this.saveDeal({
      title: `${lead.button || 'Atendimento'} - ${lead.name}`,
      leadId: lead.id,
      contactName: lead.name,
      contactPhone: lead.phone,
      contactEmail: lead.email,
      stage: 'Novo',
      status: 'open',
      productId: product?.id || null,
      productName: product?.name || 'Consulta / Atendimento',
      price_cents: product?.price_cents || 250000,
      assignedTo: 'Mariana',
      notes: `Convertido a partir do Lead (${lead.temperature || 'Novo'}). Mensagem: ${lead.userMessage || 'Aplicação via site'}`
    });

    return newDeal;
  },

  getAggregatedCrmMetrics() {
    const all = this.getDeals('all');
    const open = all.filter(d => d.status === 'open');
    const won = all.filter(d => d.status === 'won');
    const lost = all.filter(d => d.status === 'lost');

    const totalOpenCents = open.reduce((sum, d) => sum + (d.price_cents || 0), 0);
    const totalWonCents = won.reduce((sum, d) => sum + (d.price_cents || 0), 0);
    const avgTicketCents = won.length > 0 ? Math.round(totalWonCents / won.length) : (all.length > 0 ? Math.round((totalOpenCents + totalWonCents) / all.length) : 0);
    const convRate = (won.length + lost.length) > 0 ? ((won.length / (won.length + lost.length)) * 100).toFixed(1) : (all.length > 0 ? ((won.length / all.length) * 100).toFixed(1) : '0.0');

    return {
      totalOpenFormatted: formatCurrencyBRL(totalOpenCents),
      totalWonFormatted: formatCurrencyBRL(totalWonCents),
      avgTicketFormatted: formatCurrencyBRL(avgTicketCents),
      conversionRate: `${convRate}%`,
      openCount: open.length,
      wonCount: won.length,
      lostCount: lost.length,
      totalCount: all.length
    };
  }
};
