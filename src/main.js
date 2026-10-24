/* ==========================================================================
   PINAS KIT — APLICAÇÃO PRINCIPAL & CONTROLADOR DE EVENTOS
   ========================================================================== */

import { StorageService } from './services/storage.js';
import { renderHeader } from './components/Header.js';
import { renderLandingPage } from './components/LandingPage.js';
import { renderDashboard } from './components/Dashboard.js';
import { renderQualificationModal } from './components/QualificationModal.js';
import { renderConnectAdsModal } from './components/ConnectAdsModal.js';
import { renderFormBuilderModal } from './components/FormBuilderModal.js';

class PinasKitApp {
  constructor() {
    this.currentView = StorageService.getCurrentView();
    this.activeFilter = 'Todos';
    this.isAnnualBilling = true;
    this.init();
  }

  init() {
    // 1. Inicializa o tema salvo
    const savedTheme = StorageService.getTheme();
    StorageService.setTheme(savedTheme);

    // 2. Renderiza a estrutura da aplicação
    this.render();

    // 3. Registra os ouvintes de eventos
    this.bindEvents();

    console.log('%c🚀 Pinas Kit v7.0 iniciado com sucesso!', 'color: #7C3AED; font-weight: bold; font-size: 14px;');
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <!-- BARRA DE DEMONSTRAÇÃO E TESTES (TOPO) -->
      <div class="pk-demo-bar" id="demo-top-bar">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">🟣</span>
          <strong>Pinas Kit v7.0</strong>
          <span style="opacity: 0.6; font-size: 11px;">(Modelo D: Assistido & Didático)</span>
        </div>

        <div class="pk-demo-switcher">
          <button class="pk-demo-tab ${this.currentView === 'landing' ? 'is-active' : ''}" data-view="landing">
            🌐 Landing Page
          </button>
          <button class="pk-demo-tab ${this.currentView === 'dashboard' ? 'is-active' : ''}" data-view="dashboard">
            📊 Dashboard CRM (Mariana)
          </button>
          <button class="pk-demo-tab" id="top-btn-open-qual">
            💬 Testar Formulário Roxo
          </button>
          <button class="pk-demo-tab" id="top-btn-open-builder">
            🛠️ Construtor No-Code
          </button>
        </div>
      </div>

      <!-- HEADER (Visível na Landing Page) -->
      <div id="header-container">
        ${this.currentView === 'landing' ? renderHeader(this.currentView) : ''}
      </div>

      <!-- CONTEÚDO DA TELA ATIVA -->
      <div id="view-container">
        ${this.currentView === 'landing' ? renderLandingPage() : renderDashboard(this.activeFilter)}
      </div>

      <!-- MODAIS DO SISTEMA -->
      <div id="modals-container">
        ${renderQualificationModal()}
        ${renderConnectAdsModal()}
        ${renderFormBuilderModal()}
      </div>

      <!-- CONTAINER DE TOASTS -->
      <div class="pk-toast-container" id="toast-container"></div>
    `;
  }

  bindEvents() {
    // Alternância de Telas pela barra superior
    document.querySelectorAll('.pk-demo-tab[data-view]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Botões no topo para abrir os modais
    document.getElementById('top-btn-open-qual')?.addEventListener('click', () => this.openModal('qualification-modal-overlay'));
    document.getElementById('top-btn-open-builder')?.addEventListener('click', () => this.openModal('form-builder-modal-overlay'));

    // Botão de alternância de tema (Sol/Lua)
    const attachThemeToggle = (btnId) => {
      document.getElementById(btnId)?.addEventListener('click', () => {
        const current = StorageService.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        StorageService.setTheme(next);
        this.showToast(next === 'dark' ? '🌙 Modo Escuro ativado' : '☀️ Modo Claro ativado');
        this.render();
        this.bindEvents();
      });
    };
    attachThemeToggle('btn-theme-toggle');
    attachThemeToggle('btn-dash-theme-toggle');

    // CTAs da Landing Page para o Dashboard
    document.getElementById('btn-hero-start')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('btn-hero-demo')?.addEventListener('click', () => this.openModal('qualification-modal-overlay'));
    document.getElementById('btn-open-dash-preview')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('btn-login-header')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('btn-start-header')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('btn-start-pricing')?.addEventListener('click', () => this.switchView('dashboard'));

    // Alternador de Cobrança Mensal / Anual na Landing Page
    document.getElementById('btn-toggle-billing')?.addEventListener('click', () => {
      this.isAnnualBilling = !this.isAnnualBilling;
      const dot = document.getElementById('billing-toggle-dot');
      const amount = document.getElementById('price-card-amount');
      const periodLabel = document.getElementById('price-card-period-label');
      const subtext = document.getElementById('price-card-subtext');

      if (this.isAnnualBilling) {
        if (dot) dot.style.transform = 'translateX(24px)';
        if (amount) amount.textContent = 'R$ 41,58';
        if (periodLabel) periodLabel.textContent = 'No plano anual';
        if (subtext) subtext.textContent = 'Cobrado R$ 499,00 por ano (17% de desconto)';
      } else {
        if (dot) dot.style.transform = 'translateX(0px)';
        if (amount) amount.textContent = 'R$ 49,90';
        if (periodLabel) periodLabel.textContent = 'No plano mensal';
        if (subtext) subtext.textContent = 'Cobrado R$ 49,90 todo mês. Cancele quando quiser.';
      }
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        const answer = item.querySelector('.faq-answer');
        const chevron = item.querySelector('.faq-chevron');
        if (!answer) return;

        const isOpen = answer.style.display === 'block';
        answer.style.display = isOpen ? 'none' : 'block';
        if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    });

    // Eventos do Dashboard
    document.getElementById('btn-step-test-modal')?.addEventListener('click', () => this.openModal('qualification-modal-overlay'));
    document.getElementById('btn-dash-connect-ads')?.addEventListener('click', () => this.openModal('connect-ads-modal-overlay'));
    document.getElementById('btn-trigger-qualification-modal')?.addEventListener('click', () => this.openModal('qualification-modal-overlay'));

    // Filtros de Leads no Dashboard
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeFilter = e.currentTarget.getAttribute('data-filter');
        this.render();
        this.bindEvents();
      });
    });

    // Exportar Excel
    document.getElementById('btn-export-excel')?.addEventListener('click', () => {
      this.showToast('📊 Exportando planilha segura com proteção de dados AES-256...');
    });

    // Ajuda no Dashboard
    document.getElementById('btn-help-whatsapp')?.addEventListener('click', () => {
      window.open('https://wa.me/5511999999999?text=Ol%C3%A1!%20Preciso%20de%20ajuda%20no%20Pinas%20Kit', '_blank');
    });
    document.getElementById('btn-help-tutorials')?.addEventListener('click', () => {
      this.showToast('🎥 Abrindo tutoriais passo a passo do Pinas Kit...');
    });
    document.getElementById('btn-help-faq')?.addEventListener('click', () => {
      this.switchView('landing');
      setTimeout(() => {
        document.getElementById('duvidas')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    // Sidebar e Mobile Nav triggers
    document.getElementById('side-home')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('side-leads')?.addEventListener('click', () => {
      document.querySelector('.pk-metrics-grid')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('side-ads')?.addEventListener('click', () => this.openModal('connect-ads-modal-overlay'));
    document.getElementById('side-help')?.addEventListener('click', () => this.openModal('connect-ads-modal-overlay'));
    document.getElementById('side-settings')?.addEventListener('click', () => this.openModal('form-builder-modal-overlay'));

    // Custom Dropdown no Modal de Qualificação
    const selectTrigger = document.getElementById('custom-select-trigger');
    const selectMenu = document.getElementById('custom-select-menu');
    const selectArrow = document.getElementById('select-arrow');
    const hiddenSelectVal = document.getElementById('selected-moment-value');
    const selectedText = document.getElementById('selected-option-text');

    if (selectTrigger && selectMenu) {
      selectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = selectMenu.classList.contains('is-open');
        selectMenu.classList.toggle('is-open', !isOpen);
        selectTrigger.classList.toggle('is-open', !isOpen);
        if (selectArrow) selectArrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      });

      document.querySelectorAll('.pk-select-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = option.getAttribute('data-value');
          if (hiddenSelectVal) hiddenSelectVal.value = val;
          if (selectedText) selectedText.textContent = val;
          selectMenu.classList.remove('is-open');
          selectTrigger.classList.remove('is-open');
          if (selectArrow) selectArrow.style.transform = 'rotate(0deg)';

          document.querySelectorAll('.pk-select-option').forEach(opt => opt.classList.remove('is-selected'));
          option.classList.add('is-selected');
        });
      });

      // Fechar dropdown ao clicar fora
      document.addEventListener('click', () => {
        selectMenu?.classList.remove('is-open');
        selectTrigger?.classList.remove('is-open');
        if (selectArrow) selectArrow.style.transform = 'rotate(0deg)';
      });
    }

    // Submissão do Formulário de Qualificação
    const qualForm = document.getElementById('qualification-form');
    if (qualForm) {
      qualForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('lead-name')?.value;
        const phone = document.getElementById('lead-phone')?.value;
        const moment = document.getElementById('selected-moment-value')?.value || 'Quero crescer na carreira';
        const goals = document.getElementById('lead-goals')?.value;

        if (!name || !phone) {
          alert('Por favor, preencha nome e WhatsApp.');
          return;
        }

        // Salva novo lead no Storage
        const newLead = StorageService.addLead({
          name: name,
          phone: `+55 ${phone}`,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
          button: 'Formulário Qualificação',
          origin: 'Meta Ads',
          campaign: 'Campanha_Outubro_Feed',
          temperature: 'Quente',
          score: 45,
          notes: `Momento: ${moment}. Detalhes: ${goals || 'Nenhum detalhe adicional informado.'}`
        });

        this.closeModal('qualification-modal-overlay');
        this.showToast(`✨ Sucesso! Lead "${name}" capturado e salvo no CRM com segurança!`);

        // Formata mensagem para WhatsApp
        const waText = encodeURIComponent(`Olá! Meu nome é ${name}. Vi o site e meu momento atual é: ${moment}. Objetivos: ${goals || 'Quero mais informações'}`);
        const waUrl = `https://wa.me/5511999999999?text=${waText}`;

        // Abre WhatsApp após 600ms
        setTimeout(() => {
          window.open(waUrl, '_blank');
          if (this.currentView === 'dashboard') {
            this.render();
            this.bindEvents();
          }
        }, 600);
      });
    }

    // Fechar modais
    document.getElementById('btn-close-qual-modal')?.addEventListener('click', () => this.closeModal('qualification-modal-overlay'));
    document.getElementById('btn-close-ads-modal')?.addEventListener('click', () => this.closeModal('connect-ads-modal-overlay'));
    document.getElementById('btn-close-builder-modal')?.addEventListener('click', () => this.closeModal('form-builder-modal-overlay'));
    document.getElementById('btn-cancel-builder')?.addEventListener('click', () => this.closeModal('form-builder-modal-overlay'));

    // Modal de Conexão de Anúncios (Toggles)
    const adsState = StorageService.getConnectedAds();
    const handleAdsToggle = (btnId, key, platformName) => {
      document.getElementById(btnId)?.addEventListener('click', () => {
        adsState[key] = !adsState[key];
        StorageService.setConnectedAds(adsState);
        this.showToast(adsState[key] ? `✅ ${platformName} conectado com sucesso!` : `⚠️ ${platformName} desconectado.`);
        this.render();
        this.bindEvents();
        this.openModal('connect-ads-modal-overlay');
      });
    };
    handleAdsToggle('btn-toggle-meta-connect', 'facebook', 'Facebook Ads');
    handleAdsToggle('btn-toggle-insta-connect', 'instagram', 'Instagram Ads');
    handleAdsToggle('btn-toggle-google-connect', 'google', 'Google Ads');

    document.getElementById('btn-finish-ads-connect')?.addEventListener('click', () => {
      this.closeModal('connect-ads-modal-overlay');
      this.showToast('🚀 Integrações atualizadas e sincronizando métricas!');
      if (this.currentView === 'dashboard') {
        this.render();
        this.bindEvents();
      }
    });

    // Construtor No-Code: Adicionar Opção
    document.getElementById('btn-add-builder-option')?.addEventListener('click', () => {
      const list = document.getElementById('builder-options-list');
      if (!list) return;
      const count = list.children.length;
      const row = document.createElement('div');
      row.className = 'pk-card builder-option-row';
      row.style.cssText = 'padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;';
      row.innerHTML = `
        <span style="font-size: 14px; font-weight: 700; color: var(--pk-primary);">${count + 1}.</span>
        <input type="text" class="pk-input builder-opt-label" placeholder="Nova opção..." style="padding: 8px 12px; font-size: 13px;" required/>
        <select class="pk-input builder-opt-badge" style="width: 130px; padding: 8px; font-size: 13px;">
          <option value="🔥 Quente">🔥 Quente (+30)</option>
          <option value="❄️ Morno">❄️ Morno (+20)</option>
          <option value="🧊 Frio">🧊 Frio (+10)</option>
        </select>
        <button type="button" class="pk-btn-remove-opt" style="color: var(--pk-danger); font-size: 16px; cursor: pointer; padding: 4px;" title="Remover Opção">🗑️</button>
      `;
      row.querySelector('.pk-btn-remove-opt')?.addEventListener('click', () => row.remove());
      list.appendChild(row);
    });

    // Construtor No-Code: Remover Opções Existentes
    document.querySelectorAll('.pk-btn-remove-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.builder-option-row');
        if (row) row.remove();
      });
    });

    // Construtor No-Code: Salvar Configuração
    document.getElementById('form-builder-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const question = document.getElementById('builder-question')?.value;
      const template = document.getElementById('builder-template')?.value;
      const optionRows = document.querySelectorAll('.builder-option-row');
      
      const options = [];
      optionRows.forEach((row, idx) => {
        const label = row.querySelector('.builder-opt-label')?.value;
        const badge = row.querySelector('.builder-opt-badge')?.value || '🔥 Quente';
        if (label) {
          options.push({
            id: String(idx + 1),
            label: label,
            score: badge.includes('Quente') ? 30 : badge.includes('Morno') ? 20 : 10,
            badge: badge
          });
        }
      });

      StorageService.saveFormConfig({
        title: 'Conte sobre seu momento.',
        subtitle: 'Preencha os campos para gerar uma mensagem de apresentação sob medida.',
        buttonText: 'Preparar minha mensagem →',
        questionLabel: question,
        options: options,
        whatsappNumber: '5511999999999',
        whatsappTemplate: template
      });

      this.closeModal('form-builder-modal-overlay');
      this.showToast('✅ Formulário e opções atualizados com sucesso!');
      this.render();
      this.bindEvents();
    });
  }

  switchView(view) {
    this.currentView = view;
    StorageService.setCurrentView(view);
    this.render();
    this.bindEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openModal(modalOverlayId) {
    const modal = document.getElementById(modalOverlayId);
    if (modal) modal.classList.add('is-active');
  }

  closeModal(modalOverlayId) {
    const modal = document.getElementById(modalOverlayId);
    if (modal) modal.classList.remove('is-active');
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'pk-toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }
}

// Inicia aplicação após DOM pronto
document.addEventListener('DOMContentLoaded', () => {
  window.pinasApp = new PinasKitApp();
});
