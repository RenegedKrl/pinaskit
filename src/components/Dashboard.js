/* ==========================================================================
   PINAS KIT — DASHBOARD DESKTOP & MOBILE (MODELO D: ASSISTIDO E DIDÁTICO)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderDashboard(activeFilter = 'Todos') {
  const leads = StorageService.getLeads();
  const connectedAds = StorageService.getConnectedAds();
  const currentTheme = StorageService.getTheme();

  // Filtragem dos leads conforme aba
  const filteredLeads = leads.filter(lead => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Novos') return lead.stage === 'Novo';
    if (activeFilter === 'Em conversa') return lead.stage === 'Em conversa';
    if (activeFilter === 'Venda') return lead.stage === 'Venda';
    return true;
  });

  return `
    <div class="pk-dashboard-wrapper" id="dashboard-view">
      <!-- SIDEBAR DESKTOP -->
      <aside class="pk-sidebar" id="dashboard-sidebar">
        <div>
          <!-- Logo -->
          <div class="pk-logo" style="margin-bottom: 8px;">
            <div class="pk-logo-icon">P</div>
            <span>Pinas Kit</span>
          </div>

          <!-- Menu de Navegação -->
          <nav class="pk-sidebar-menu">
            <div class="pk-sidebar-item is-active" id="side-home">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Início</span>
            </div>

            <div class="pk-sidebar-item" id="side-leads">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Leads</span>
            </div>

            <div class="pk-sidebar-item" id="side-conversations">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Conversas</span>
            </div>

            <div class="pk-sidebar-item" id="side-sales">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              <span>Vendas</span>
            </div>

            <div class="pk-sidebar-item" id="side-ads">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <span>Anúncios</span>
            </div>

            <div class="pk-sidebar-item" id="side-automation">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>Automação</span>
            </div>

            <div class="pk-sidebar-item" id="side-reports">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Relatórios</span>
            </div>
          </nav>
        </div>

        <!-- Rodapé da Sidebar -->
        <div style="border-top: 1px solid var(--pk-border); padding-top: 14px; display: flex; flex-direction: column; gap: 6px;">
          <div class="pk-sidebar-item" id="side-help">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Ajuda</span>
          </div>
          <div class="pk-sidebar-item" id="side-settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Configurações</span>
          </div>
        </div>
      </aside>

      <!-- CONTEÚDO PRINCIPAL -->
      <main class="pk-main-content">
        <!-- CABEÇALHO SUPERIOR DO DASHBOARD -->
        <div class="pk-dash-header">
          <div>
            <h1 class="pk-dash-greeting">Olá, Mariana! 👋</h1>
            <p class="pk-dash-subgreeting">Vamos continuar configurando seu Pinas Kit?</p>
          </div>

          <div class="pk-dash-user-bar">
            <!-- Alternador de Tema -->
            <button class="pk-theme-toggle" id="btn-dash-theme-toggle" title="Alternar Tema">
              ${currentTheme === 'dark' 
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>` 
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`}
            </button>

            <!-- Notificações -->
            <button class="pk-theme-toggle" id="btn-notifications" title="Notificações">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>

            <!-- Perfil da Mariana -->
            <div class="pk-user-pill">
              <img src="/assets/images/support-avatar.jpg" alt="Mariana" class="pk-user-avatar"/>
              <div>
                <span style="display: block; line-height: 1.2;">Mariana</span>
                <span style="font-size: 11px; font-weight: 500; color: var(--pk-primary);">Plano Starter</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ÁREA DE ONBOARDING & PRÓXIMA AÇÃO (LADO A LADO) -->
        <div class="pk-assist-grid">
          <!-- Card de Onboarding -->
          <div class="pk-card pk-card-onboarding">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 15px; font-weight: 700; color: var(--pk-text-primary);">Seu início no Pinas Kit</span>
              <span style="font-size: 13px; font-weight: 600; color: var(--pk-primary);">2 de 3 concluídos</span>
            </div>
            
            <div class="pk-progress-bar-container">
              <div class="pk-progress-bar-fill" style="width: 66%;"></div>
            </div>

            <div class="pk-step-list">
              <!-- Passo 1 -->
              <div class="pk-step-item is-completed">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="pk-step-badge-check">✓</span>
                  <div>
                    <span style="font-weight: 600;">1. Conecte seus anúncios</span>
                    <p style="font-size: 12px; color: var(--pk-text-muted);">Meta Ads conectado com sucesso.</p>
                  </div>
                </div>
                <span style="font-size: 12px; color: var(--pk-success); font-weight: 600;">Pronto</span>
              </div>

              <!-- Passo 2 -->
              <div class="pk-step-item is-completed">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="pk-step-badge-check">✓</span>
                  <div>
                    <span style="font-weight: 600;">2. Receba seus leads</span>
                    <p style="font-size: 12px; color: var(--pk-text-muted);">Formulário de captura ativo no site.</p>
                  </div>
                </div>
                <span style="font-size: 12px; color: var(--pk-success); font-weight: 600;">Pronto</span>
              </div>

              <!-- Passo 3 (Pendente / Próximo) -->
              <div class="pk-step-item" style="border: 1.5px solid var(--pk-primary); background-color: var(--pk-primary-light);">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="pk-step-badge-pending">3</span>
                  <div>
                    <span style="font-weight: 700; color: var(--pk-primary);">3. Acompanhe tudo aqui</span>
                    <p style="font-size: 12px; color: var(--pk-text-secondary);">Veja conversas, vendas e resultados em um só lugar.</p>
                  </div>
                </div>
                <button class="pk-btn pk-btn-primary pk-btn-sm" id="btn-step-test-modal">
                  Testar Captação →
                </button>
              </div>
            </div>
          </div>

          <!-- Card de Próxima Ação Recomendada -->
          <div class="pk-card pk-card-next-action">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 20px;">💡</span>
                <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9;">Próxima Ação Recomendada</span>
              </div>
              <h3 style="font-size: 20px; font-weight: 700; line-height: 1.3;">
                ${connectedAds.facebook ? 'Sua conta de anúncios está integrada!' : 'Conecte sua conta do Facebook Ads para começar a receber seus leads.'}
              </h3>
              <p style="font-size: 14px; opacity: 0.85; margin-top: 8px;">
                ${connectedAds.facebook ? 'Seus dados de gastos e cliques estão sendo sincronizados automaticamente.' : 'Leva menos de 2 minutos e é 100% seguro.'}
              </p>
            </div>

            <button class="pk-btn" id="btn-dash-connect-ads" style="margin-top: 18px;">
              ${connectedAds.facebook ? 'Gerenciar Conexões →' : 'Conectar agora →'}
            </button>
          </div>
        </div>

        <!-- 4 INDICADORES ESSENCIAIS -->
        <div class="pk-metrics-grid">
          <div class="pk-card pk-metric-card">
            <span class="pk-metric-label">Seus leads hoje</span>
            <div class="pk-metric-value">24</div>
            <span class="pk-metric-trend pk-trend-up">↑ 12% em relação a ontem</span>
          </div>

          <div class="pk-card pk-metric-card">
            <span class="pk-metric-label">Conversas em andamento</span>
            <div class="pk-metric-value">8</div>
            <span class="pk-metric-trend" style="color: var(--pk-primary);">● Em tempo real</span>
          </div>

          <div class="pk-card pk-metric-card">
            <span class="pk-metric-label">Vendas este mês</span>
            <div class="pk-metric-value">5</div>
            <span class="pk-metric-trend pk-trend-up">↑ 25% este mês</span>
          </div>

          <div class="pk-card pk-metric-card">
            <span class="pk-metric-label">Investimento em anúncios</span>
            <div class="pk-metric-value">R$ 120,00</div>
            <span class="pk-metric-trend pk-trend-up">↑ 18% investido</span>
          </div>
        </div>

        <!-- LISTA DE LEADS / CRM SIMPLES -->
        <div class="pk-card" style="padding: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
            <div>
              <h2 style="font-size: 20px; font-weight: 700; color: var(--pk-text-primary);">Meus contatos (leads)</h2>
              <p style="font-size: 13px; color: var(--pk-text-secondary);">Pessoas que demonstraram interesse e solicitaram atendimento.</p>
            </div>

            <!-- Ações e Filtros -->
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <div style="display: flex; gap: 4px; background-color: var(--pk-bg-subtle); padding: 4px; border-radius: var(--pk-radius-md);">
                <button class="pk-btn pk-btn-sm ${activeFilter === 'Todos' ? 'pk-btn-primary' : 'pk-btn-outline'}" data-filter="Todos">Todos (${leads.length})</button>
                <button class="pk-btn pk-btn-sm ${activeFilter === 'Novos' ? 'pk-btn-primary' : 'pk-btn-outline'}" data-filter="Novos">Novos</button>
                <button class="pk-btn pk-btn-sm ${activeFilter === 'Em conversa' ? 'pk-btn-primary' : 'pk-btn-outline'}" data-filter="Em conversa">Em conversa</button>
                <button class="pk-btn pk-btn-sm ${activeFilter === 'Venda' ? 'pk-btn-primary' : 'pk-btn-outline'}" data-filter="Venda">Vendas</button>
              </div>

              <button class="pk-btn pk-btn-whatsapp pk-btn-sm" id="btn-trigger-qualification-modal">
                + Novo Teste de Lead
              </button>
              <button class="pk-btn pk-btn-secondary pk-btn-sm" id="btn-export-excel">
                Exportar Excel
              </button>
            </div>
          </div>

          <!-- Cards de Contatos / Tabela Didática -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${filteredLeads.map(lead => `
              <div class="pk-card pk-card-interactive" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="width: 42px; height: 42px; border-radius: var(--pk-radius-full); background: var(--pk-primary-light); color: var(--pk-primary); display: grid; place-items: center; font-weight: 700;">
                    ${lead.name.charAt(0)}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-weight: 700; font-size: 15px; color: var(--pk-text-primary);">${lead.name}</span>
                      <span class="pk-badge ${lead.temperature === 'Quente' ? 'pk-badge-ruby' : 'pk-badge-amber'}" style="font-size: 10px; padding: 3px 8px;">
                        ${lead.temperature === 'Quente' ? '🔥 Quente' : '❄️ Morno'} (${lead.score} pts)
                      </span>
                    </div>
                    <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 2px;">
                      <strong>${lead.origin}</strong> · Campanha: <em>${lead.campaign}</em> · ${lead.time}
                    </p>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="pk-badge ${lead.stage === 'Venda' ? 'pk-badge-green' : lead.stage === 'Em conversa' ? 'pk-badge-blue' : 'pk-badge-purple'}">
                    ${lead.stage}
                  </span>
                  
                  <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Olá%20${encodeURIComponent(lead.name)}" target="_blank" class="pk-btn pk-btn-whatsapp pk-btn-sm" style="text-decoration: none;">
                    Abrir WhatsApp →
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- BANNER DE AJUDA GUIADA (RODAPÉ) -->
        <div class="pk-help-banner">
          <div class="pk-help-left">
            <img src="/assets/images/support-avatar.jpg" alt="Suporte Pinas Kit" class="pk-help-avatar"/>
            <div>
              <strong style="font-size: 15px; color: var(--pk-text-primary); display: block;">Precisa de ajuda?</strong>
              <span style="font-size: 13px; color: var(--pk-text-secondary);">Nossa equipe de especialistas está pronta para te orientar em cada passo.</span>
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="pk-btn pk-btn-whatsapp pk-btn-sm" id="btn-help-whatsapp">Falar no WhatsApp</button>
            <button class="pk-btn pk-btn-secondary pk-btn-sm" id="btn-help-tutorials">Ver tutoriais</button>
            <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-help-faq">Tirar dúvidas</button>
          </div>
        </div>
      </main>

      <!-- BARRA DE NAVEGAÇÃO MOBILE FIXA -->
      <nav class="pk-mobile-nav" id="mobile-bottom-nav">
        <div class="pk-mobile-nav-item is-active" id="mob-nav-home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span>Início</span>
        </div>
        <div class="pk-mobile-nav-item" id="mob-nav-leads">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span>Leads</span>
        </div>
        <div class="pk-mobile-nav-item" id="mob-nav-chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Conversas</span>
        </div>
        <div class="pk-mobile-nav-item" id="mob-nav-sales">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          <span>Vendas</span>
        </div>
      </nav>
    </div>
  `;
}
