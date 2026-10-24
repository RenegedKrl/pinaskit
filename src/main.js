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

class PinasKitApp {
  constructor() {
    this.currentView = StorageService.getCurrentView();
    this.currentDashTab = StorageService.getCurrentDashTab();
    this.leadFilterButton = 'Todos';
    this.activeButtonForEdit = null;
    this.isAnnualBilling = true;
    this.selectedLeadForDrawer = null;
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
          : renderDashboard(this.currentDashTab, this.leadFilterButton)}
      </div>

      <!-- MODAIS DO SISTEMA -->
      <div id="modals-container">
        ${renderQualificationModal()}
        ${renderConnectAdsModal()}
        ${renderFormBuilderModal(this.activeButtonForEdit)}
        ${renderVideoTourModal()}
        ${renderCopyScriptModal()}
        ${renderLeadDrawer(this.selectedLeadForDrawer)}
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
      this.switchDashTab('new-button');
    });

    // ------------------------------------------------------------------------
    // 5.1. EVENTOS DA TELA DE NOVO BOTÃO & PREVIEW AO VIVO (PADRÃO CENTRALKIT)
    // ------------------------------------------------------------------------
    // Voltar para a lista de botões
    const backToButtons = () => {
      this.switchDashTab('buttons');
    };
    document.getElementById('btn-back-to-buttons')?.addEventListener('click', backToButtons);
    document.getElementById('btn-cancel-new-button-bottom')?.addEventListener('click', backToButtons);

    // Reatividade do Mockup / Preview ao vivo:
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
        if (previewActionText) {
          previewActionText.textContent = val;
        } else if (previewActionBtn) {
          previewActionBtn.textContent = val;
        }
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

    // Submissão do Formulário de Criação de Botão
    const newBtnForm = document.getElementById('new-button-form');
    if (newBtnForm) {
      newBtnForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-btn-name')?.value.trim() || 'Novo Botão';
        const whatsapp = document.getElementById('new-btn-whatsapp')?.value.trim().replace(/\D/g, '') || '5511999999999';
        const prefilled = document.getElementById('new-btn-prefilled')?.value.trim() || '';
        const ctaText = document.getElementById('new-btn-cta-text')?.value.trim() || 'Falar no WhatsApp';
        const greeting = document.getElementById('new-btn-greeting')?.value.trim() || 'Confirme seus dados para iniciar a conversa';
        const question = document.getElementById('new-btn-question')?.value.trim() || 'Qual região você gostaria de tratar?';
        const color = document.getElementById('new-btn-color-hex')?.value.trim() || '#25D366';
        const position = document.querySelector('input[name="new-btn-position"]:checked')?.value || 'right';
        const isActive = document.getElementById('new-btn-status')?.checked ?? true;

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

        const newButton = StorageService.saveButton({
          id: `btn-${Date.now()}`,
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
            ctaText,
            greeting
          },
          formConfig: {
            title: greeting,
            subtitle: 'Preencha os campos para receber uma avaliação personalizada.',
            buttonText: ctaText,
            questionLabel: question,
            options: options.length ? options : [
              { id: '1', label: 'Quero atendimento imediato', score: 35, badge: '🔥 Quente' },
              { id: '2', label: 'Gostaria de tirar dúvidas', score: 25, badge: '❄️ Morno' }
            ],
            whatsappTemplate: prefilled ? `${prefilled} [Objetivo: {momento}]` : 'Olá! Vim pelo site. Meu objetivo é: {momento}.'
          }
        });

        this.showToast(`🎉 Botão "${name}" criado com sucesso!`);
        this.switchDashTab('buttons');
        // Abre imediatamente o modal com o script embed e prompt para IA!
        setTimeout(() => {
          this.openCopyScriptModal(newButton.id, newButton.name, newButton.slug);
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

    const scriptTag = `<script async src="https://pinaskit.com.br/embed.js" data-pinaskit="${buttonId}" data-api="https://api.pinaskit.com.br/v1"></script>`;

    if (titleEl) titleEl.textContent = buttonName;
    if (scriptEl) scriptEl.value = scriptTag;
    if (urlEl) urlEl.value = `https://pinaskit.com.br/b/${slug}`;

    if (aiPromptEl) {
      aiPromptEl.value = `Preciso adicionar um widget de botão flutuante de WhatsApp ao meu site.

Insira o script abaixo em todas as páginas, uma única vez, imediatamente antes do fechamento da tag </body>. Se o site usa um framework (React, Next.js, Vue, Astro, WordPress, Shopify, etc.), adicione-o no HTML base/layout para carregar em todas as páginas:

${scriptTag}

Regras importantes:
- Não altere nem remova os atributos data-pinaskit e data-api (eles identificam o botão e rastreiam UTMs de anúncios).
- Não é preciso criar nenhum HTML/CSS/JS adicional: o próprio script renderiza o botão flutuante e o formulário de qualificação.
- O widget aparece como um botão flutuante no canto da tela e se atualiza sozinho; não é preciso mexer no código depois.`;
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
