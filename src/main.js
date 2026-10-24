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
        ${renderFormBuilderModal()}
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
        navigator.clipboard?.writeText(url);
        this.showToast(`📋 Link copiado: ${url}`);
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
    // Criar Novo Botão -> Abre o Construtor No-Code
    document.getElementById('btn-create-new-button')?.addEventListener('click', () => {
      this.activeButtonForEdit = null;
      document.getElementById('builder-question').value = 'O que melhor descreve seu momento?';
      this.openModal('form-builder-modal-overlay');
    });

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
        if (button && button.formConfig) {
          const qInput = document.getElementById('builder-question');
          if (qInput) qInput.value = button.formConfig.questionLabel;
        }
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
        navigator.clipboard?.writeText(phone);
        this.showToast(`📋 Telefone copiado: ${phone}`);
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
    // 7. EVENTOS DO MODAL COPIAR SCRIPT
    // ------------------------------------------------------------------------
    document.getElementById('btn-close-copy-modal')?.addEventListener('click', () => this.closeModal('copy-script-modal-overlay'));
    
    document.getElementById('btn-do-copy-script')?.addEventListener('click', () => {
      const code = document.getElementById('copy-script-code')?.value;
      navigator.clipboard?.writeText(code);
      this.showToast('✅ Código do widget copiado! Cole no seu site.');
    });

    document.getElementById('btn-do-copy-url')?.addEventListener('click', () => {
      const url = document.getElementById('copy-direct-url')?.value;
      navigator.clipboard?.writeText(url);
      this.showToast('✅ Link direto copiado com sucesso!');
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
    // 9. EVENTOS DO CONSTRUTOR NO-CODE
    // ------------------------------------------------------------------------
    document.getElementById('btn-close-builder-modal')?.addEventListener('click', () => this.closeModal('form-builder-modal-overlay'));

    // Adicionar nova opção
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

    document.querySelectorAll('.pk-btn-remove-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.builder-option-row');
        if (row) row.remove();
      });
    });

    // Salvar Configuração do Construtor
    document.getElementById('form-builder-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const question = document.getElementById('builder-question')?.value;
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

      const updatedConfig = {
        title: 'Conte sobre seu momento.',
        subtitle: 'Preencha os campos para gerar uma mensagem de apresentação sob medida.',
        buttonText: 'Preparar minha mensagem →',
        questionLabel: question,
        options: options.length > 0 ? options : [
          { id: '1', label: 'Quero crescer na minha carreira', score: 25, badge: '🔥 Quente' },
          { id: '2', label: 'Estou pensando em mudar de área', score: 20, badge: '❄️ Morno' }
        ],
        whatsappNumber: '5511975374960',
        whatsappTemplate: 'Olá! Meu nome é {nome}. Momento: {momento}. Detalhes: {mensagem}'
      };

      // Se estiver editando um botão específico, salva nele
      if (this.activeButtonForEdit) {
        this.activeButtonForEdit.formConfig = updatedConfig;
        StorageService.saveButton(this.activeButtonForEdit);
      } else {
        // Cria um novo botão no sistema
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
      this.showToast('✅ Botão e formulário de qualificação salvos com sucesso!');
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

    if (titleEl) titleEl.textContent = `Instalar Botão: ${buttonName}`;
    if (scriptEl) scriptEl.value = `<script src="https://pinaskit.com.br/widget.js" data-button-id="${buttonId}" defer></script>`;
    if (urlEl) urlEl.value = `https://pinaskit.com.br/b/${slug}`;

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
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new PinasKitApp();
});
