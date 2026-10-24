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
import { renderVideoTourModal } from './components/VideoTourModal.js';
import { renderCopyScriptModal } from './components/CopyScriptModal.js';
import { renderLeadDrawer } from './components/LeadDrawer.js';
import { renderUtmBuilderModal } from './components/UtmBuilderModal.js';

class PinasKitApp {
  constructor() {
    this.currentView = StorageService.getCurrentView();
    this.currentDashTab = StorageService.getCurrentDashTab();
    this.leadFilterButton = 'Todos';
    this.activeButtonForEdit = null;
    this.isAnnualBilling = true;
    this.selectedLeadForDrawer = null;
    this.campaignPlatformFilter = 'Todas';
    this.campaignStatusFilter = 'Todas';
    this.campaignSearchQuery = '';
    this.init();
  }

  init() {
    // 1. Inicializa o tema salvo (Claro por padrão)
    const savedTheme = StorageService.getTheme();
    StorageService.setTheme(savedTheme);

    // 2. Renderiza a estrutura da aplicação
    this.render();

    // 3. Registra os ouvintes de eventos
    this.bindEvents();

    console.log('%c🚀 Pinas Kit v7.0 (CentralKit Architecture) ativo!', 'color: #7C3AED; font-weight: bold; font-size: 14px;');
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <!-- BARRA DE NAVEGAÇÃO SUPERIOR (DEMO & TESTES) -->
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
            📊 Painel do Assinante (CentralKit)
          </button>
        </div>
      </div>

      <!-- HEADER (Visível na Landing Page) -->
      <div id="header-container">
        ${this.currentView === 'landing' ? renderHeader(this.currentView) : ''}
      </div>

      <!-- CONTEÚDO DA TELA ATIVA -->
      <div id="view-container">
        ${this.currentView === 'landing' 
          ? renderLandingPage() 
          : renderDashboard(this.currentDashTab, this.leadFilterButton, this.activeButtonForEdit, this.campaignPlatformFilter, this.campaignStatusFilter, this.campaignSearchQuery)}
      </div>

      <!-- MODAIS DO SISTEMA -->
      <div id="modals-container">
        ${renderQualificationModal()}
        ${renderConnectAdsModal()}
        ${renderFormBuilderModal(this.activeButtonForEdit)}
        ${renderVideoTourModal()}
        ${renderCopyScriptModal()}
        ${renderLeadDrawer(this.selectedLeadForDrawer)}
        ${renderUtmBuilderModal()}
      </div>

      <!-- CONTAINER DE NOTIFICAÇÕES (TOASTS) -->
      <div class="pk-toast-container" id="toast-container"></div>
    `;
  }

  bindEvents() {
    // ------------------------------------------------------------------------
    // 1. ALTERNÂNCIA DE TELAS PRINCIPAIS (LANDING PAGE vs PAINEL)
    // ------------------------------------------------------------------------
    document.querySelectorAll('.pk-demo-tab[data-view]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Alternador de Tema Claro/Escuro
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

    // ------------------------------------------------------------------------
    // 2. EVENTOS DA LANDING PAGE COMERCIAL
    // ------------------------------------------------------------------------
    // CTAs que entram no Painel
    document.getElementById('btn-hero-start')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('btn-login-header')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('btn-start-header')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('btn-start-pricing')?.addEventListener('click', () => this.switchView('dashboard'));
    document.getElementById('btn-open-dash-preview')?.addEventListener('click', () => this.switchView('dashboard'));

    // Botão "▶ Ver como funciona (1 min)" -> ABRE O VÍDEO EXPLICATIVO!
    document.getElementById('btn-hero-demo')?.addEventListener('click', () => {
      this.openModal('video-tour-modal-overlay');
    });

    // Botão de simulação no site do cliente fictício -> Abre o formulário de qualificação!
    document.getElementById('btn-mock-client-site-widget')?.addEventListener('click', () => {
      this.openModal('qualification-modal-overlay');
    });

    // Alternador de Cobrança Mensal / Anual
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

    // ------------------------------------------------------------------------
    // 3. EVENTOS DO MODAL DE VÍDEO TOUR
    // ------------------------------------------------------------------------
    document.getElementById('btn-close-video-modal')?.addEventListener('click', () => this.closeModal('video-tour-modal-overlay'));
    document.getElementById('btn-close-video-modal-bottom')?.addEventListener('click', () => this.closeModal('video-tour-modal-overlay'));
    document.getElementById('btn-video-go-dashboard')?.addEventListener('click', () => {
      this.closeModal('video-tour-modal-overlay');
      this.switchView('dashboard');
    });
    document.getElementById('tour-play-btn')?.addEventListener('click', () => {
      this.showToast('▶️ Reproduzindo tour guiado: "Como capturar e qualificar leads no Pinas Kit"...');
    });

    // ------------------------------------------------------------------------
    // 4. EVENTOS DO PAINEL DO ASSINANTE (SIDEBAR & ABAS)
    // ------------------------------------------------------------------------
    // Navegação pela Sidebar Desktop
    const attachTabSwitch = (selector, tabName) => {
      document.querySelector(selector)?.addEventListener('click', () => {
        this.switchDashTab(tabName);
      });
    };
    attachTabSwitch('#side-nav-overview', 'overview');
    attachTabSwitch('#side-nav-buttons', 'buttons');
    attachTabSwitch('#side-nav-leads', 'leads');
    attachTabSwitch('#side-nav-conversations', 'conversations');
    attachTabSwitch('#side-nav-crm', 'conversations');
    attachTabSwitch('#side-nav-sales', 'sales');
    attachTabSwitch('#side-nav-ads', 'ads');
    attachTabSwitch('#side-nav-automation', 'automation');
    attachTabSwitch('#side-nav-reports', 'reports');
    attachTabSwitch('#side-brand-logo', 'overview');

    // Itens de rodapé da sidebar fixa
    document.getElementById('side-help')?.addEventListener('click', () => {
      this.openModal('video-tour-modal-overlay');
    });
    document.getElementById('side-settings')?.addEventListener('click', () => {
      this.openModal('connect-ads-modal-overlay');
    });

    // Ações internas das abas de Anúncios, Automação e Relatórios
    document.getElementById('btn-open-ads-modal')?.addEventListener('click', () => this.openModal('connect-ads-modal-overlay'));
    document.getElementById('btn-connect-google-ads')?.addEventListener('click', () => this.openModal('connect-ads-modal-overlay'));
    document.getElementById('btn-open-connect-ads-top')?.addEventListener('click', () => this.openModal('connect-ads-modal-overlay'));
    document.getElementById('btn-sync-ads-now')?.addEventListener('click', () => {
      this.showToast('🔄 Custos e cliques sincronizados com sucesso via API do Meta e Google Ads!');
    });
    document.getElementById('btn-edit-rules-auto')?.addEventListener('click', () => this.openModal('form-builder-modal-overlay'));
    document.getElementById('btn-export-reports')?.addEventListener('click', () => {
      this.showToast('📊 Exportando relatório executivo de ROI e conversões...');
    });

    // Navegação Mobile (Bottom Nav)
    document.querySelectorAll('[data-mobile-tab]').forEach(item => {
      item.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-mobile-tab');
        this.switchDashTab(tab);
      });
    });

    // Atalhos dentro da Visão Geral
    document.getElementById('btn-step-open-buttons')?.addEventListener('click', () => this.switchDashTab('buttons'));
    document.getElementById('btn-dash-connect-ads')?.addEventListener('click', () => this.openModal('connect-ads-modal-overlay'));
    document.getElementById('btn-quick-all-buttons')?.addEventListener('click', () => this.switchDashTab('buttons'));
    document.getElementById('card-metric-leads')?.addEventListener('click', () => this.switchDashTab('leads'));
    document.getElementById('card-metric-ads')?.addEventListener('click', () => this.switchDashTab('ads'));
    document.getElementById('metric-card-ad-leads')?.addEventListener('click', () => this.switchDashTab('leads'));

    // Botão de upgrade
    document.getElementById('btn-upgrade-plan-hint')?.addEventListener('click', () => {
      this.showToast('🚀 Abrindo planos Pro com botões e domínios ilimitados!');
    });

    // Copiar link rápido nos botões da visão geral
    document.querySelectorAll('.btn-quick-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.currentTarget.getAttribute('data-slug');
        const url = `https://pinaskit.com.br/b/${slug}`;
        this.safeCopyToClipboard(url, `📋 Link copiado: ${url}`);
      });
    });

    // Ajuda no Dashboard
    document.getElementById('btn-help-whatsapp')?.addEventListener('click', () => {
      window.open('https://wa.me/5511999999999?text=Ol%C3%A1!%20Preciso%20de%20ajuda%20no%20Pinas%20Kit', '_blank');
    });
    document.getElementById('btn-help-tutorials')?.addEventListener('click', () => {
      this.openModal('video-tour-modal-overlay');
    });
    document.getElementById('btn-help-faq')?.addEventListener('click', () => {
      this.switchView('landing');
      setTimeout(() => {
        document.getElementById('duvidas')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    // ------------------------------------------------------------------------
    // 5. EVENTOS DO MÓDULO DE BOTÕES (CENTRALKIT)
    // ------------------------------------------------------------------------
    // Criar Novo Botão -> Vai para a tela completa CentralKit de Novo Botão
    document.getElementById('btn-create-new-button')?.addEventListener('click', () => {
      this.activeButtonForEdit = null;
      this.switchDashTab('new-button');
    });

    // ------------------------------------------------------------------------
    // 5.1. EVENTOS DA TELA DE NOVO BOTÃO & PREVIEW AO VIVO (PADRÃO CENTRALKIT)
    // ------------------------------------------------------------------------
    // Voltar para a lista de botões
    const backToButtons = () => {
      this.activeButtonForEdit = null;
      this.switchDashTab('buttons');
    };
    document.getElementById('btn-back-to-buttons')?.addEventListener('click', backToButtons);
    document.getElementById('btn-cancel-new-button-bottom')?.addEventListener('click', backToButtons);

    // 1. ALTERNADOR DE ABAS DE PRÉ-VISUALIZAÇÃO (BOTÃO FLUTUANTE vs FORMULÁRIO NA PÁGINA)
    const tabFloat = document.getElementById('btn-preview-mode-float');
    const tabForm = document.getElementById('btn-preview-mode-form');
    const floatContainer = document.getElementById('preview-mode-float-container');
    const formContainer = document.getElementById('preview-mode-form-container');

    if (tabFloat && tabForm && floatContainer && formContainer) {
      tabFloat.addEventListener('click', () => {
        floatContainer.style.display = 'block';
        formContainer.style.display = 'none';
        tabFloat.style.background = 'var(--pk-primary)';
        tabFloat.style.color = '#FFF';
        tabForm.style.background = 'transparent';
        tabForm.style.color = 'var(--pk-text-secondary)';
      });

      tabForm.addEventListener('click', () => {
        floatContainer.style.display = 'none';
        formContainer.style.display = 'block';
        tabForm.style.background = 'var(--pk-primary)';
        tabForm.style.color = '#FFF';
        tabFloat.style.background = 'transparent';
        tabFloat.style.color = 'var(--pk-text-secondary)';
      });
    }

    // 2. REATIVIDADE DO BOTÃO FLUTUANTE
    const newBtnNameInput = document.getElementById('new-btn-name');
    const previewStoreName = document.getElementById('preview-store-name');
    const previewStoreAvatar = document.getElementById('preview-store-avatar');
    if (newBtnNameInput && previewStoreName) {
      newBtnNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim() || 'Meu Botão';
        previewStoreName.textContent = val;
        if (previewStoreAvatar) {
          const initials = val.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'PK';
          previewStoreAvatar.textContent = initials;
        }
      });
    }

    const newBtnGreetingInput = document.getElementById('new-btn-greeting');
    const previewGreeting = document.getElementById('preview-floating-greeting');
    if (newBtnGreetingInput && previewGreeting) {
      newBtnGreetingInput.addEventListener('input', (e) => {
        previewGreeting.textContent = e.target.value || 'Confirme seus dados para iniciar a conversa';
      });
    }

    const newBtnCtaInput = document.getElementById('new-btn-cta-text');
    const previewActionBtn = document.getElementById('preview-floating-action-btn');
    const previewActionText = document.getElementById('preview-floating-action-text');
    if (newBtnCtaInput) {
      newBtnCtaInput.addEventListener('input', (e) => {
        const val = e.target.value || 'Falar no WhatsApp';
        if (previewActionText) previewActionText.textContent = val;
        else if (previewActionBtn) previewActionBtn.textContent = val;
      });
    }

    // Cores (Color Picker, Hex Input e Presets Rápidos)
    const newBtnColorPicker = document.getElementById('new-btn-color-picker');
    const newBtnColorHex = document.getElementById('new-btn-color-hex');
    const previewTriggerBtn = document.getElementById('preview-floating-trigger-btn');

    const updatePreviewColor = (hex) => {
      if (!hex) return;
      if (newBtnColorPicker) newBtnColorPicker.value = hex;
      if (newBtnColorHex) newBtnColorHex.value = hex;
      if (previewTriggerBtn) {
        previewTriggerBtn.style.backgroundColor = hex;
        previewTriggerBtn.style.boxShadow = `0 6px 18px ${hex}73`;
      }
      if (previewActionBtn) previewActionBtn.style.backgroundColor = hex;
      if (previewStoreAvatar) previewStoreAvatar.style.backgroundColor = hex;
    };

    if (newBtnColorPicker) {
      newBtnColorPicker.addEventListener('input', (e) => updatePreviewColor(e.target.value));
    }
    if (newBtnColorHex) {
      newBtnColorHex.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (val && !val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          updatePreviewColor(val);
        }
      });
    }
    document.querySelectorAll('.btn-color-preset').forEach(preset => {
      preset.addEventListener('click', (e) => {
        const col = e.currentTarget.getAttribute('data-color');
        if (col) updatePreviewColor(col);
      });
    });

    // Posição na Tela (Canto inferior esquerdo vs direito)
    const floatingContainer = document.getElementById('preview-floating-container');
    document.querySelectorAll('input[name="new-btn-position"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (!floatingContainer) return;
        if (e.target.value === 'left') {
          floatingContainer.style.left = '20px';
          floatingContainer.style.right = 'auto';
          floatingContainer.style.alignItems = 'flex-start';
        } else {
          floatingContainer.style.right = '20px';
          floatingContainer.style.left = 'auto';
          floatingContainer.style.alignItems = 'flex-end';
        }
      });
    });

    // Checkbox de Botão Ativo
    const statusCheckbox = document.getElementById('new-btn-status');
    if (statusCheckbox && floatingContainer) {
      statusCheckbox.addEventListener('change', (e) => {
        floatingContainer.style.opacity = e.target.checked ? '1' : '0.25';
        floatingContainer.style.pointerEvents = e.target.checked ? 'auto' : 'none';
      });
    }

    // Toggle Balão / Popup no Mockup
    const floatingPopup = document.getElementById('preview-floating-popup');
    if (previewTriggerBtn && floatingPopup) {
      previewTriggerBtn.addEventListener('click', () => {
        const isHidden = floatingPopup.style.display === 'none';
        floatingPopup.style.display = isHidden ? 'block' : 'none';
      });
    }
    document.getElementById('preview-close-popup-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (floatingPopup) floatingPopup.style.display = 'none';
    });

    // 3. REATIVIDADE DO FORMULÁRIO DE QUALIFICAÇÃO NO RODAPÉ
    const formTitleInput = document.getElementById('new-form-title');
    const previewFormTitle = document.getElementById('preview-live-form-title');
    if (formTitleInput && previewFormTitle) {
      formTitleInput.addEventListener('input', (e) => {
        previewFormTitle.textContent = e.target.value.trim() || 'Conte sobre seu momento.';
      });
    }

    const formSubtitleInput = document.getElementById('new-form-subtitle');
    const previewFormSubtitle = document.getElementById('preview-live-form-subtitle');
    if (formSubtitleInput && previewFormSubtitle) {
      formSubtitleInput.addEventListener('input', (e) => {
        previewFormSubtitle.textContent = e.target.value.trim() || 'Preencha os campos para receber uma avaliação personalizada.';
      });
    }

    const formQuestionInput = document.getElementById('new-btn-question');
    const previewFormQuestion = document.getElementById('preview-live-form-question');
    if (formQuestionInput && previewFormQuestion) {
      formQuestionInput.addEventListener('input', (e) => {
        previewFormQuestion.textContent = e.target.value.trim() || 'O que melhor descreve seu momento?';
      });
    }

    const formCtaInput = document.getElementById('new-form-cta-text');
    const previewFormCtaText = document.getElementById('preview-live-form-cta-text');
    if (formCtaInput && previewFormCtaText) {
      formCtaInput.addEventListener('input', (e) => {
        previewFormCtaText.textContent = e.target.value.trim() || 'Preparar minha mensagem →';
      });
    }

    // Atualização Dinâmica das Opções no Preview
    const updateNewButtonOptionsPreview = () => {
      const container = document.getElementById('preview-live-form-options');
      if (!container) return;
      const rows = document.querySelectorAll('.new-btn-option-row');
      container.innerHTML = Array.from(rows).map((row, idx) => {
        const label = row.querySelector('.new-opt-label')?.value.trim() || `Opção ${idx + 1}`;
        const badge = row.querySelector('.new-opt-badge')?.value || '🔥 Quente';
        const badgeClass = badge.includes('Quente') ? 'pk-badge-hot' : badge.includes('Frio') ? 'pk-badge-cold' : 'pk-badge-warm';
        return `
          <div class="pk-preview-option-item ${idx === 0 ? 'is-selected' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border: 1.5px solid ${idx === 0 ? 'var(--pk-primary)' : 'var(--pk-border)'}; border-radius: 8px; background: ${idx === 0 ? 'rgba(124,58,237,0.06)' : 'var(--pk-bg-subtle)'};">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${idx === 0 ? 'var(--pk-primary)' : 'var(--pk-border)'}; display: grid; place-items: center;">
                ${idx === 0 ? '<div style="width: 6px; height: 6px; border-radius: 50%; background: var(--pk-primary);"></div>' : ''}
              </div>
              <span class="preview-live-opt-label" style="font-size: 12px; font-weight: 600; color: var(--pk-text-primary);">
                ${label}
              </span>
            </div>
            <span class="pk-badge ${badgeClass}" style="font-size: 10px; padding: 2px 6px;">
              ${badge}
            </span>
          </div>
        `;
      }).join('');
    };

    const attachOptionEvents = () => {
      document.querySelectorAll('.new-opt-label').forEach(inp => {
        inp.removeEventListener('input', updateNewButtonOptionsPreview);
        inp.addEventListener('input', updateNewButtonOptionsPreview);
      });
      document.querySelectorAll('.new-opt-badge').forEach(sel => {
        sel.removeEventListener('change', updateNewButtonOptionsPreview);
        sel.addEventListener('change', updateNewButtonOptionsPreview);
      });
      document.querySelectorAll('.btn-remove-new-option').forEach(btn => {
        btn.onclick = (e) => {
          const row = e.currentTarget.closest('.new-btn-option-row');
          const allRows = document.querySelectorAll('.new-btn-option-row');
          if (allRows.length > 1 && row) {
            row.remove();
            // Re-numerar
            document.querySelectorAll('.new-btn-option-row').forEach((r, i) => {
              const numSpan = r.querySelector('span');
              if (numSpan) numSpan.textContent = `${i + 1}.`;
            });
            updateNewButtonOptionsPreview();
          } else {
            this.showToast('⚠️ Mantenha pelo menos uma opção de qualificação.');
          }
        };
      });
    };
    attachOptionEvents();

    // Botão "+ Adicionar Nova Opção"
    document.getElementById('btn-add-new-option')?.addEventListener('click', () => {
      const list = document.getElementById('new-btn-options-list');
      if (!list) return;
      const count = list.querySelectorAll('.new-btn-option-row').length + 1;
      const newRow = document.createElement('div');
      newRow.className = 'new-btn-option-row';
      newRow.style.cssText = 'display: grid; grid-template-columns: 24px 1fr 140px 32px; gap: 8px; align-items: center; background: var(--pk-bg-subtle); border: 1px solid var(--pk-border); border-radius: 8px; padding: 6px 10px;';
      newRow.innerHTML = `
        <span style="font-size: 13px; font-weight: 800; color: var(--pk-primary); text-align: center;">${count}.</span>
        <input type="text" class="pk-input new-opt-label" value="" placeholder="Descreva a nova opção..." required style="padding: 7px 10px; font-size: 12.5px;"/>
        <select class="pk-input new-opt-badge" style="padding: 7px 8px; font-size: 11.5px; cursor: pointer;">
          <option value="🔥 Quente">🔥 Quente (+30)</option>
          <option value="❄️ Morno" selected>❄️ Morno (+20)</option>
          <option value="🧊 Frio">🧊 Frio (+10)</option>
        </select>
        <button type="button" class="btn-remove-new-option" title="Remover opção" style="border: none; background: none; color: #EF4444; cursor: pointer; font-size: 14px; padding: 4px; display: grid; place-items: center;">
          🗑️
        </button>
      `;
      list.appendChild(newRow);
      attachOptionEvents();
      updateNewButtonOptionsPreview();
      const input = newRow.querySelector('.new-opt-label');
      if (input) input.focus();
    });

    // Chips de Tags para o Template WhatsApp
    document.querySelectorAll('.new-form-tag-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const tag = e.currentTarget.getAttribute('data-tag');
        const textarea = document.getElementById('new-form-template');
        if (textarea && tag) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          textarea.value = text.substring(0, start) + tag + text.substring(end);
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + tag.length;
        }
      });
    });

    // 4. SUBMISSÃO DO FORMULÁRIO COMPLETO (SALVAR BOTÃO & FORMULÁRIO)
    const newBtnForm = document.getElementById('new-button-form');
    if (newBtnForm) {
      newBtnForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = newBtnForm.getAttribute('data-edit-id');
        const name = document.getElementById('new-btn-name')?.value.trim() || 'Novo Botão';
        const whatsapp = document.getElementById('new-btn-whatsapp')?.value.trim().replace(/\D/g, '') || '5511999999999';
        const greeting = document.getElementById('new-btn-greeting')?.value.trim() || 'Confirme seus dados para iniciar a conversa';
        const floatCta = document.getElementById('new-btn-cta-text')?.value.trim() || 'Falar no WhatsApp';
        const color = document.getElementById('new-btn-color-hex')?.value.trim() || '#25D366';
        const position = document.querySelector('input[name="new-btn-position"]:checked')?.value || 'right';
        const isActive = document.getElementById('new-btn-status')?.checked ?? true;

        // Configurações do Formulário de Página
        const formTitle = document.getElementById('new-form-title')?.value.trim() || 'Conte sobre seu momento.';
        const formSubtitle = document.getElementById('new-form-subtitle')?.value.trim() || 'Preencha os campos para receber uma avaliação personalizada.';
        const formQuestion = document.getElementById('new-btn-question')?.value.trim() || 'Qual região você gostaria de tratar?';
        const formCta = document.getElementById('new-form-cta-text')?.value.trim() || 'Preparar minha mensagem →';
        const formTemplate = document.getElementById('new-form-template')?.value.trim() || 'Olá! Meu nome é {nome}. Momento: {momento}. Detalhes: {mensagem}';

        // Opções de Qualificação
        const options = [];
        document.querySelectorAll('.new-btn-option-row').forEach((row, idx) => {
          const labelInput = row.querySelector('.new-opt-label');
          const badgeSelect = row.querySelector('.new-opt-badge');
          if (labelInput && labelInput.value.trim()) {
            const badge = badgeSelect ? badgeSelect.value : '🔥 Quente';
            const score = badge.includes('Quente') ? 35 : badge.includes('Morno') ? 25 : 15;
            options.push({
              id: String(idx + 1),
              label: labelInput.value.trim(),
              badge,
              score
            });
          }
        });

        const slug = name.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const buttonData = {
          id: editId || `btn-${Date.now()}`,
          name,
          slug: slug || `btn-${Date.now()}`,
          category: 'Campanha WhatsApp',
          siteUrl: `https://${slug || 'site'}.com.br`,
          whatsappNumber: whatsapp,
          status: isActive ? 'Ativo' : 'Pausado',
          clicks: 0,
          leadsCount: 0,
          conversionRate: '0.0%',
          style: {
            color,
            position,
            ctaText: floatCta,
            greeting
          },
          formConfig: {
            title: formTitle,
            subtitle: formSubtitle,
            buttonText: formCta,
            questionLabel: formQuestion,
            options: options.length ? options : [
              { id: '1', label: 'Quero atendimento imediato', score: 35, badge: '🔥 Quente' },
              { id: '2', label: 'Gostaria de tirar dúvidas', score: 25, badge: '❄️ Morno' }
            ],
            whatsappTemplate: formTemplate
          }
        };

        const savedButton = StorageService.saveButton(buttonData);
        this.activeButtonForEdit = null;
        this.showToast(`🎉 Botão & Formulário "${name}" salvos com sucesso!`);
        this.switchDashTab('buttons');

        // Abre imediatamente o modal com o script embed e link de teste real!
        setTimeout(() => {
          this.openCopyScriptModal(savedButton.id, savedButton.name, savedButton.slug);
        }, 150);
      });
    }

    // Ações em cada Card de Botão
    document.querySelectorAll('.btn-copy-script-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnId = e.currentTarget.getAttribute('data-button-id');
        const btnName = e.currentTarget.getAttribute('data-button-name');
        const slug = e.currentTarget.getAttribute('data-slug');
        this.openCopyScriptModal(btnId, btnName, slug);
      });
    });

    document.querySelectorAll('.btn-test-widget-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnId = e.currentTarget.getAttribute('data-button-id');
        const button = StorageService.getButtonById(btnId);
        if (button && button.formConfig) {
          StorageService.saveFormConfig(button.formConfig);
        }
        this.openModal('qualification-modal-overlay');
      });
    });

    document.querySelectorAll('.btn-edit-form-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnId = e.currentTarget.getAttribute('data-button-id');
        const button = StorageService.getButtonById(btnId);
        this.activeButtonForEdit = button;
        this.render();
        this.bindEvents();
        this.openModal('form-builder-modal-overlay');
      });
    });

    document.querySelectorAll('.btn-view-leads-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnName = e.currentTarget.getAttribute('data-button-name');
        this.leadFilterButton = btnName;
        this.switchDashTab('leads');
      });
    });

    // ------------------------------------------------------------------------
    // 6. EVENTOS DO MÓDULO DE LEADS (IMAGEM 2)
    // ------------------------------------------------------------------------
    // Filtro por Botão no topo da tabela
    const filterBtnSelect = document.getElementById('filter-lead-button');
    if (filterBtnSelect) {
      filterBtnSelect.addEventListener('change', (e) => {
        this.leadFilterButton = e.target.value;
        this.render();
        this.bindEvents();
      });
    }

    // Exportar Excel
    const triggerExport = () => {
      this.showToast('📊 Exportando base de contatos em planilha segura (criptografia AES-256)...');
    };
    document.getElementById('btn-export-excel-leads')?.addEventListener('click', triggerExport);
    document.getElementById('btn-scoring-rules')?.addEventListener('click', () => {
      this.openModal('form-builder-modal-overlay');
    });
    document.getElementById('btn-leads-settings')?.addEventListener('click', () => {
      this.openModal('connect-ads-modal-overlay');
    });

    // Exclusão de Lead
    document.querySelectorAll('.btn-lead-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const leadId = e.currentTarget.getAttribute('data-id');
        if (confirm('Deseja realmente remover este lead?')) {
          StorageService.deleteLead(leadId);
          this.showToast('🗑️ Lead removido com sucesso.');
          this.render();
          this.bindEvents();
        }
      });
    });

    // Abertura do Drawer da Ficha Completa do Lead
    const handleOpenLeadDrawer = (leadId) => {
      const lead = StorageService.getLeadById(leadId);
      if (lead) {
        this.selectedLeadForDrawer = lead;
        this.render();
        this.bindEvents();
        const drawer = document.getElementById('lead-drawer-overlay');
        if (drawer) {
          drawer.classList.add('is-active');
          document.body.style.overflow = 'hidden';
        }
      }
    };

    document.querySelectorAll('.lead-clickable-name, .btn-lead-analytics, .btn-open-lead-drawer').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        handleOpenLeadDrawer(id);
      });
    });

    // Eventos de Fechamento do Drawer
    const closeLeadDrawer = () => {
      const drawer = document.getElementById('lead-drawer-overlay');
      if (drawer) {
        drawer.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    };
    document.getElementById('btn-close-lead-drawer')?.addEventListener('click', closeLeadDrawer);
    document.getElementById('lead-drawer-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'lead-drawer-overlay') closeLeadDrawer();
    });

    // Copiar Telefone no Drawer
    document.getElementById('drawer-btn-copy-phone')?.addEventListener('click', (e) => {
      const phone = e.currentTarget.getAttribute('data-phone');
      if (phone) {
        this.safeCopyToClipboard(phone, `📋 Telefone copiado: ${phone}`);
      }
    });

    // Alteração de Estágio no Pipeline CRM via Pills
    document.querySelectorAll('.pk-stage-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const leadId = e.currentTarget.getAttribute('data-lead-id');
        const newStage = e.currentTarget.getAttribute('data-stage');
        const updatedLead = StorageService.updateLeadStage(leadId, newStage, 'Mariana');
        if (updatedLead) {
          this.selectedLeadForDrawer = updatedLead;
          this.showToast(`🎯 Estágio atualizado para "${newStage}"!`);
          this.render();
          this.bindEvents();
          document.getElementById('lead-drawer-overlay')?.classList.add('is-active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Salvar Nova Anotação da Equipe na Ficha do Lead
    document.getElementById('drawer-note-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const leadId = e.currentTarget.getAttribute('data-lead-id');
      const input = document.getElementById('drawer-note-input');
      const text = input ? input.value.trim() : '';
      if (text) {
        const updatedLead = StorageService.addLeadNote(leadId, text, 'Mariana');
        if (updatedLead) {
          this.selectedLeadForDrawer = updatedLead;
          this.showToast('📝 Anotação interna salva na ficha!');
          this.render();
          this.bindEvents();
          document.getElementById('lead-drawer-overlay')?.classList.add('is-active');
          document.body.style.overflow = 'hidden';
        }
      }
    });

    // Checkbox selecionar todos
    document.getElementById('check-all-leads')?.addEventListener('change', (e) => {
      const checked = e.target.checked;
      document.querySelectorAll('.check-single-lead').forEach(cb => cb.checked = checked);
    });

    // ------------------------------------------------------------------------
    // 7. EVENTOS DO MODAL COPIAR SCRIPT (ABAS CÓDIGO vs PEDIR PARA UMA IA)
    // ------------------------------------------------------------------------
    document.getElementById('btn-close-copy-modal')?.addEventListener('click', () => this.closeModal('copy-script-modal-overlay'));
    
    // Alternância de Abas: Código vs Pedir para uma IA
    document.querySelectorAll('.pk-script-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.pk-script-tab').forEach(t => t.classList.remove('is-active'));
        e.currentTarget.classList.add('is-active');

        const targetId = e.currentTarget.getAttribute('data-target');
        const codePane = document.getElementById('copy-tab-code');
        const aiPane = document.getElementById('copy-tab-ai');

        if (targetId === 'copy-tab-code') {
          if (codePane) codePane.style.display = 'block';
          if (aiPane) aiPane.style.display = 'none';
        } else {
          if (codePane) codePane.style.display = 'none';
          if (aiPane) aiPane.style.display = 'block';
        }
      });
    });

    document.getElementById('btn-do-copy-script')?.addEventListener('click', () => {
      const code = document.getElementById('copy-script-code')?.value;
      this.safeCopyToClipboard(code, '✅ Código do script copiado! Cole antes de </body>.');
    });

    document.getElementById('btn-do-copy-url')?.addEventListener('click', () => {
      const url = document.getElementById('copy-direct-url')?.value;
      this.safeCopyToClipboard(url, '✅ Link direto copiado com sucesso!');
    });

    document.getElementById('btn-do-copy-ai-prompt')?.addEventListener('click', () => {
      const promptText = document.getElementById('copy-ai-prompt-code')?.value;
      this.safeCopyToClipboard(promptText, '🤖 Prompt copiado com sucesso! Cole no ChatGPT, Claude ou Cursor.');
    });

    // ------------------------------------------------------------------------
    // 8. EVENTOS DO FORMULÁRIO DE QUALIFICAÇÃO ("CONTE SOBRE SEU MOMENTO")
    // ------------------------------------------------------------------------
    // Fechar Modal
    document.getElementById('btn-close-qual-modal')?.addEventListener('click', () => this.closeModal('qualification-modal-overlay'));

    // Custom Dropdown
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
        const moment = document.getElementById('selected-moment-value')?.value || 'Quero mais informações';
        const goals = document.getElementById('lead-goals')?.value;

        if (!name || !phone) {
          alert('Por favor, preencha nome e WhatsApp.');
          return;
        }

        // Salva novo lead no Storage associado ao botão atual
        const currentBtn = this.leadFilterButton !== 'Todos' ? this.leadFilterButton : 'Glúteo Feminino';
        const newLead = StorageService.addLead({
          name: name,
          phone: phone.startsWith('+55') ? phone : `+55 ${phone}`,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
          button: currentBtn,
          origin: 'Meta Ads',
          campaign: 'Campanha_Outubro_Feed',
          temperature: 'Quente',
          score: 45,
          notes: `Momento: ${moment}. Detalhes: ${goals || 'Nenhum detalhe adicional informado.'}`
        });

        this.closeModal('qualification-modal-overlay');
        this.showToast(`✨ Sucesso! Lead "${name}" capturado e salvo na base de contatos!`);

        // Redireciona para o WhatsApp
        const waText = encodeURIComponent(`Olá! Meu nome é ${name}. Vi o site e meu momento atual é: ${moment}. Detalhes: ${goals || 'Quero agendar uma conversa'}`);
        const waUrl = `https://wa.me/5511975374960?text=${waText}`;

        setTimeout(() => {
          window.open(waUrl, '_blank');
          if (this.currentView === 'dashboard') {
            this.render();
            this.bindEvents();
          }
        }, 500);
      });
    }

    // ------------------------------------------------------------------------
    // 9. EVENTOS DO CONSTRUTOR NO-CODE COM LIVE PREVIEW EM TEMPO REAL
    // ------------------------------------------------------------------------
    const closeBuilderModal = () => this.closeModal('form-builder-modal-overlay');
    document.getElementById('btn-close-builder-modal')?.addEventListener('click', closeBuilderModal);
    document.getElementById('btn-cancel-builder')?.addEventListener('click', closeBuilderModal);

    // Função de sincronização da pré-visualização em tempo real (Phone Mockup)
    const updateBuilderLivePreview = () => {
      const titleInput = document.getElementById('builder-title');
      const subtitleInput = document.getElementById('builder-subtitle');
      const questionInput = document.getElementById('builder-question');
      const btnTextInput = document.getElementById('builder-btn-text');

      const previewTitle = document.getElementById('preview-form-title');
      const previewSubtitle = document.getElementById('preview-form-subtitle');
      const previewQuestion = document.getElementById('preview-question-label');
      const previewCtaBtn = document.getElementById('preview-cta-btn');
      const previewOptionsContainer = document.getElementById('preview-options-container');

      if (previewTitle && titleInput) {
        previewTitle.textContent = titleInput.value.trim() || 'Conte sobre seu momento.';
      }
      if (previewSubtitle && subtitleInput) {
        previewSubtitle.textContent = subtitleInput.value.trim() || 'Preencha os campos para receber uma avaliação personalizada.';
      }
      if (previewQuestion && questionInput) {
        previewQuestion.textContent = questionInput.value.trim() || 'O que melhor descreve seu momento?';
      }
      if (previewCtaBtn && btnTextInput) {
        previewCtaBtn.textContent = `💬 ${btnTextInput.value.trim() || 'Preparar minha mensagem →'}`;
      }

      if (previewOptionsContainer) {
        const optionRows = document.querySelectorAll('.builder-option-row');
        if (optionRows.length === 0) {
          previewOptionsContainer.innerHTML = '<div style="font-size: 11px; color: var(--pk-text-muted); text-align: center; padding: 10px;">Nenhuma opção cadastrada. Adicione opções ao lado.</div>';
        } else {
          previewOptionsContainer.innerHTML = Array.from(optionRows).map((row, idx) => {
            const label = row.querySelector('.builder-opt-label')?.value || 'Opção sem título';
            const badge = row.querySelector('.builder-opt-badge')?.value || '🔥 Quente';
            const badgeClass = badge.includes('Quente') ? 'pk-badge-hot' : badge.includes('Frio') ? 'pk-badge-cold' : 'pk-badge-warm';
            const isSelected = idx === 0;

            return `
              <div class="pk-preview-option-item ${isSelected ? 'is-selected' : ''}" data-preview-index="${idx}">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${isSelected ? 'var(--pk-primary)' : 'var(--pk-border)'}; display: grid; place-items: center;">
                    ${isSelected ? '<div style="width: 6px; height: 6px; border-radius: 50%; background: var(--pk-primary);"></div>' : ''}
                  </div>
                  <span class="preview-opt-text" style="font-size: 12px; font-weight: 600; color: var(--pk-text-primary);">
                    ${label}
                  </span>
                </div>
                <span class="pk-badge ${badgeClass}" style="font-size: 10px; padding: 2px 6px;">
                  ${badge}
                </span>
              </div>
            `;
          }).join('');

          // Permite clicar nas opções dentro do preview para testar interativamente
          previewOptionsContainer.querySelectorAll('.pk-preview-option-item').forEach(item => {
            item.addEventListener('click', () => {
              previewOptionsContainer.querySelectorAll('.pk-preview-option-item').forEach(it => {
                it.classList.remove('is-selected');
                const circle = it.querySelector('div[style*="border-radius: 50%"]');
                if (circle) {
                  circle.style.borderColor = 'var(--pk-border)';
                  circle.innerHTML = '';
                }
              });
              item.classList.add('is-selected');
              const activeCircle = item.querySelector('div[style*="border-radius: 50%"]');
              if (activeCircle) {
                activeCircle.style.borderColor = 'var(--pk-primary)';
                activeCircle.innerHTML = '<div style="width: 6px; height: 6px; border-radius: 50%; background: var(--pk-primary);"></div>';
              }
            });
          });
        }
      }
    };

    // Vincular inputs principais ao Live Preview (input, change e keyup)
    ['builder-title', 'builder-subtitle', 'builder-question', 'builder-btn-text'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateBuilderLivePreview);
        el.addEventListener('change', updateBuilderLivePreview);
        el.addEventListener('keyup', updateBuilderLivePreview);
      }
    });

    // Função para reatribuir listeners nas opções dinâmicas
    const bindOptionRowListeners = (row) => {
      row.querySelector('.builder-opt-label')?.addEventListener('input', updateBuilderLivePreview);
      row.querySelector('.builder-opt-badge')?.addEventListener('change', updateBuilderLivePreview);
      row.querySelector('.pk-btn-remove-opt')?.addEventListener('click', () => {
        row.remove();
        updateBuilderLivePreview();
        document.querySelectorAll('.builder-option-row').forEach((r, i) => {
          const numSpan = r.querySelector('span');
          if (numSpan) numSpan.textContent = `${i + 1}.`;
        });
      });
    };

    document.querySelectorAll('.builder-option-row').forEach(bindOptionRowListeners);

    // Botão "+ Adicionar Nova Opção"
    document.getElementById('btn-add-builder-option')?.addEventListener('click', () => {
      const list = document.getElementById('builder-options-list');
      if (!list) return;
      const count = list.children.length;
      const row = document.createElement('div');
      row.className = 'builder-option-row';
      row.setAttribute('data-index', count);
      row.style.cssText = 'background: var(--pk-bg-card); border: 1px solid var(--pk-border); border-radius: 8px; padding: 8px 12px; display: grid; grid-template-columns: 24px 1fr 140px 32px; align-items: center; gap: 8px;';
      row.innerHTML = `
        <span style="font-size: 13px; font-weight: 800; color: var(--pk-primary); text-align: center;">${count + 1}.</span>
        <input type="text" class="pk-input builder-opt-label" placeholder="Nova opção..." value="Nova opção de atendimento" style="padding: 7px 10px; font-size: 13px;" required/>
        <select class="pk-input builder-opt-badge" style="padding: 7px 8px; font-size: 12px; cursor: pointer;">
          <option value="🔥 Quente" selected>🔥 Quente (+30)</option>
          <option value="❄️ Morno">❄️ Morno (+20)</option>
          <option value="🧊 Frio">🧊 Frio (+10)</option>
        </select>
        <button type="button" class="pk-btn-remove-opt" data-index="${count}" style="background: none; border: none; color: var(--pk-danger); font-size: 16px; cursor: pointer; padding: 4px; text-align: center;" title="Remover Opção">
          🗑️
        </button>
      `;
      list.appendChild(row);
      bindOptionRowListeners(row);
      updateBuilderLivePreview();
    });

    // Inserção rápida de Tags no template do WhatsApp
    document.querySelectorAll('.pk-builder-tag-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const tag = e.currentTarget.getAttribute('data-tag');
        const textarea = document.getElementById('builder-template');
        if (textarea && tag) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          textarea.value = text.substring(0, start) + ' ' + tag + ' ' + text.substring(end);
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + tag.length + 2;
          this.showToast(`🏷️ Tag ${tag} inserida no template!`);
        }
      });
    });

    // Botão "Restaurar Textos Padrão"
    document.getElementById('btn-reset-builder-defaults')?.addEventListener('click', () => {
      const titleInput = document.getElementById('builder-title');
      const subtitleInput = document.getElementById('builder-subtitle');
      const questionInput = document.getElementById('builder-question');
      const btnTextInput = document.getElementById('builder-btn-text');
      const templateInput = document.getElementById('builder-template');

      if (titleInput) titleInput.value = 'Conte sobre seu momento.';
      if (subtitleInput) subtitleInput.value = 'Preencha os campos para receber uma avaliação personalizada.';
      if (questionInput) questionInput.value = 'O que melhor descreve seu momento?';
      if (btnTextInput) btnTextInput.value = 'Preparar minha mensagem →';
      if (templateInput) templateInput.value = 'Olá! Meu nome é {nome}. Momento: {momento}. Detalhes: {mensagem}';

      updateBuilderLivePreview();
      this.showToast('↺ Textos restaurados para o padrão.');
    });

    // Submissão do Formulário do Construtor
    document.getElementById('form-builder-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('builder-title')?.value || 'Conte sobre seu momento.';
      const subtitle = document.getElementById('builder-subtitle')?.value || 'Preencha os campos para receber uma avaliação personalizada.';
      const question = document.getElementById('builder-question')?.value || 'O que melhor descreve seu momento?';
      const buttonText = document.getElementById('builder-btn-text')?.value || 'Preparar minha mensagem →';
      const template = document.getElementById('builder-template')?.value || 'Olá! Meu nome é {nome}. Momento: {momento}. Detalhes: {mensagem}';

      const optionRows = document.querySelectorAll('.builder-option-row');
      const options = [];
      optionRows.forEach((row, idx) => {
        const label = row.querySelector('.builder-opt-label')?.value;
        const badge = row.querySelector('.builder-opt-badge')?.value || '🔥 Quente';
        if (label) {
          options.push({
            id: String(idx + 1),
            label: label.trim(),
            score: badge.includes('Quente') ? 35 : badge.includes('Morno') ? 25 : 15,
            badge: badge
          });
        }
      });

      const updatedConfig = {
        title,
        subtitle,
        buttonText,
        questionLabel: question,
        options: options.length > 0 ? options : [
          { id: '1', label: 'Quero agendamento rápido', score: 35, badge: '🔥 Quente' },
          { id: '2', label: 'Desejo tirar dúvidas de valores', score: 25, badge: '❄️ Morno' }
        ],
        whatsappNumber: '5511975374960',
        whatsappTemplate: template
      };

      if (this.activeButtonForEdit) {
        this.activeButtonForEdit.formConfig = updatedConfig;
        StorageService.saveButton(this.activeButtonForEdit);
      } else {
        StorageService.saveButton({
          name: question.length > 25 ? question.slice(0, 25) + '...' : question,
          slug: `botao-${Date.now().toString().slice(-4)}`,
          category: 'Novo Site / Campanha',
          siteUrl: 'https://seusite.com.br',
          whatsappNumber: '5511975374960',
          formConfig: updatedConfig
        });
      }

      StorageService.saveFormConfig(updatedConfig);
      this.closeModal('form-builder-modal-overlay');
      this.showToast('✨ Formulário salvo e publicado com sucesso!');
      this.render();
      this.bindEvents();
    });

    // ------------------------------------------------------------------------
    // 10. EVENTOS DO MODAL DE CONEXÃO DE ANÚNCIOS
    // ------------------------------------------------------------------------
    document.getElementById('btn-close-ads-modal')?.addEventListener('click', () => this.closeModal('connect-ads-modal-overlay'));
    
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

    // ------------------------------------------------------------------------
    // 11. EVENTOS DO MÓDULO DE CAMPANHAS & GERADOR DE LINKS COM UTM
    // ------------------------------------------------------------------------
    // Abrir Modal de UTMs
    document.getElementById('btn-open-utm-builder')?.addEventListener('click', () => this.openUtmModal());
    document.getElementById('btn-create-campaign-shortcut')?.addEventListener('click', () => this.openUtmModal());
    document.getElementById('btn-close-utm-modal')?.addEventListener('click', () => this.closeModal('utm-builder-modal-overlay'));

    // Abrir UTM já pré-preenchido com dados de uma campanha existente
    document.querySelectorAll('.btn-open-utm-with-camp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const camp = e.currentTarget.getAttribute('data-camp') || '';
        const targetBtn = e.currentTarget.getAttribute('data-button') || '';
        this.openUtmModal(camp, targetBtn);
      });
    });

    // Alternar canal / medium chips no modal de UTM
    document.querySelectorAll('.utm-medium-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.utm-medium-chip').forEach(c => c.classList.remove('is-active'));
        e.currentTarget.classList.add('is-active');
        const medium = e.currentTarget.getAttribute('data-medium') || 'stories';
        const hiddenMedium = document.getElementById('utm-medium-value');
        if (hiddenMedium) hiddenMedium.value = medium;
        this.updateUtmOutputUrl();
      });
    });

    // Atualização reativa de inputs no modal de UTM
    ['utm-target-button', 'utm-campaign-input', 'utm-content-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updateUtmOutputUrl());
        el.addEventListener('change', () => this.updateUtmOutputUrl());
      }
    });
    document.querySelectorAll('input[name="utm-source-choice"]').forEach(radio => {
      radio.addEventListener('change', () => this.updateUtmOutputUrl());
    });

    // Copiar link rastreado no modal de UTM
    document.getElementById('btn-copy-utm-url')?.addEventListener('click', () => {
      const url = document.getElementById('utm-output-url')?.value;
      if (url) {
        this.safeCopyToClipboard(url, '📋 Link rastreado com UTM copiado com sucesso! Cole no seu anúncio.');
      }
    });

    // Filtros de Plataforma em Campanhas
    document.querySelectorAll('.campaign-platform-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.campaignPlatformFilter = e.currentTarget.getAttribute('data-platform');
        this.render();
        this.bindEvents();
      });
    });

    // Filtro de Status em Campanhas
    document.getElementById('campaign-status-filter')?.addEventListener('change', (e) => {
      this.campaignStatusFilter = e.target.value;
      this.render();
      this.bindEvents();
    });

    // Busca rápida de campanhas
    const campSearchInput = document.getElementById('campaign-search-input');
    if (campSearchInput) {
      campSearchInput.addEventListener('input', (e) => {
        this.campaignSearchQuery = e.target.value;
        const q = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.campaign-row').forEach(row => {
          const text = row.innerText.toLowerCase();
          row.style.display = (!q || text.includes(q)) ? '' : 'none';
        });
      });
    }

    // Alternar status da campanha (Ativa / Pausada)
    document.querySelectorAll('.pk-btn-toggle-camp-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const updated = StorageService.toggleCampaignStatus(id);
        if (updated) {
          this.showToast(`Campanha "${updated.name}" agora está ${updated.status}!`);
          this.render();
          this.bindEvents();
        }
      });
    });

    // Ver Leads da campanha no CRM
    document.querySelectorAll('.btn-view-camp-leads').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget.getAttribute('data-button');
        this.leadFilterButton = targetBtn || 'Todos';
        this.switchDashTab('leads');
        this.showToast(`👥 Exibindo contatos capturados pelo botão "${targetBtn}"!`);
      });
    });

    // Simulador de Investimento & Retorno (Slider Interativo)
    const simSlider = document.getElementById('sim-budget-slider');
    if (simSlider) {
      const updateSim = () => {
        const budget = Number(simSlider.value);
        const metrics = StorageService.getAggregatedAdMetrics();
        const avgCpl = metrics.avgCplRaw > 0 ? metrics.avgCplRaw : 15;
        const roi = metrics.overallRoiRaw > 0 ? metrics.overallRoiRaw : 4.8;
        const leadsEst = Math.round(budget / avgCpl);
        const revEst = Math.round(budget * roi);

        const bDisp = document.getElementById('sim-budget-display');
        const lDisp = document.getElementById('sim-leads-display');
        const rDisp = document.getElementById('sim-revenue-display');
        const bBadge = document.getElementById('sim-roi-badge');

        if (bDisp) bDisp.textContent = budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (lDisp) lDisp.textContent = `+${leadsEst} leads`;
        if (rDisp) rDisp.textContent = revEst.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (bBadge) bBadge.textContent = `${roi}x ROI Estimado`;
      };
      simSlider.addEventListener('input', updateSim);
      updateSim();
    }
  }

  openUtmModal(prefillCampaign = '', prefillButton = '') {
    if (prefillCampaign) {
      const campInput = document.getElementById('utm-campaign-input');
      if (campInput) campInput.value = prefillCampaign;
    }
    if (prefillButton) {
      const btnSelect = document.getElementById('utm-target-button');
      if (btnSelect) {
        for (let i = 0; i < btnSelect.options.length; i++) {
          if (btnSelect.options[i].getAttribute('data-name') === prefillButton) {
            btnSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
    this.updateUtmOutputUrl();
    this.openModal('utm-builder-modal-overlay');
  }

  updateUtmOutputUrl() {
    const targetSelect = document.getElementById('utm-target-button');
    const baseUrl = targetSelect ? targetSelect.value : 'https://clinicaestetica.com.br/gluteo-feminino';
    const sourceRadio = document.querySelector('input[name="utm-source-choice"]:checked');
    const source = sourceRadio ? sourceRadio.value : 'meta_ads';
    const medium = document.getElementById('utm-medium-value')?.value || 'stories';
    const campaign = document.getElementById('utm-campaign-input')?.value.trim() || 'campanha-outubro';
    const content = document.getElementById('utm-content-input')?.value.trim() || '';

    const finalUrl = StorageService.generateUtmUrl({
      baseUrl,
      utmSource: source,
      utmMedium: medium,
      utmCampaign: campaign,
      utmContent: content
    });

    const output = document.getElementById('utm-output-url');
    if (output) output.value = finalUrl;
  }

  switchView(view) {
    this.currentView = view;
    StorageService.setCurrentView(view);
    this.render();
    this.bindEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  switchDashTab(tab) {
    this.currentDashTab = tab;
    StorageService.setCurrentDashTab(tab);
    this.render();
    this.bindEvents();
  }

  openCopyScriptModal(buttonId, buttonName, slug) {
    const titleEl = document.getElementById('copy-modal-button-name');
    const scriptEl = document.getElementById('copy-script-code');
    const urlEl = document.getElementById('copy-direct-url');
    const aiPromptEl = document.getElementById('copy-ai-prompt-code');

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const scriptSrc = isLocal ? `${window.location.origin}/embed.js` : 'https://pinaskit.com.br/embed.js';
    const scriptTag = `<script async src="${scriptSrc}" data-pinaskit="${buttonId}"></script>`;

    if (titleEl) titleEl.textContent = buttonName;
    if (scriptEl) scriptEl.value = scriptTag;
    if (urlEl) urlEl.value = `https://pinaskit.com.br/b/${slug}`;

    const liveTestBtn = document.getElementById('btn-open-live-test');
    if (liveTestBtn) {
      liveTestBtn.href = `/teste-widget.html?button=${buttonId}`;
    }

    if (aiPromptEl) {
      aiPromptEl.value = `Preciso adicionar um widget de botão flutuante de WhatsApp e formulário de qualificação do Pinas Kit ao meu site.

Insira o script abaixo em todas as páginas, uma única vez, imediatamente antes do fechamento da tag </body>. Se o site usa um framework (React, Next.js, Vue, Astro, WordPress, Shopify, Elementor, etc.), adicione-o no HTML base/layout:

${scriptTag}

Regras importantes:
- Não altere nem remova o atributo data-pinaskit (ele identifica seu botão e rastreia UTMs de anúncios do Meta Ads e Google Ads).
- Não é preciso criar nenhum HTML/CSS/JS adicional: o próprio script renderiza o botão flutuante de WhatsApp e o formulário de qualificação ao final da página.
- O widget se atualiza sozinho pelo painel; não é preciso mexer no código depois.`;
    }

    // Ativa a primeira aba (Código) por padrão
    document.querySelectorAll('.pk-script-tab').forEach(t => t.classList.remove('is-active'));
    document.getElementById('tab-btn-code')?.classList.add('is-active');
    const codePane = document.getElementById('copy-tab-code');
    const aiPane = document.getElementById('copy-tab-ai');
    if (codePane) codePane.style.display = 'block';
    if (aiPane) aiPane.style.display = 'none';

    this.openModal('copy-script-modal-overlay');
  }

  openModal(modalOverlayId) {
    const modal = document.getElementById(modalOverlayId);
    if (modal) {
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalOverlayId) {
    const modal = document.getElementById(modalOverlayId);
    if (modal) {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'pk-toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-fading');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  safeCopyToClipboard(text, successMsg) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          if (successMsg) this.showToast(successMsg);
        })
        .catch(() => {
          this.fallbackCopyText(text);
          if (successMsg) this.showToast(successMsg);
        });
    } else {
      this.fallbackCopyText(text);
      if (successMsg) this.showToast(successMsg);
    }
  }

  fallbackCopyText(text) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (_) {}
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new PinasKitApp();
});
