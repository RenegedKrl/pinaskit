/* ==========================================================================
   PINAS KIT — PAINEL PRINCIPAL DO ASSINANTE (CENTRALKIT + MODELO D)
   ========================================================================== */

import { StorageService } from '../services/storage.js';
import { renderButtonsView } from './ButtonsView.js';
import { renderLeadsView } from './LeadsView.js';

export function renderDashboard(activeTab = 'overview', leadFilterButton = 'Todos') {
  const currentTheme = StorageService.getTheme();
  const connectedAds = StorageService.getConnectedAds();
  const leads = StorageService.getLeads();
  const buttons = StorageService.getButtons();

  return `
    <div class="pk-dashboard-wrapper" id="dashboard-view">
      <!-- SIDEBAR DESKTOP (CENTRALKIT STYLE) -->
      <aside class="pk-sidebar" id="dashboard-sidebar">
        <div>
          <!-- Logo Oficial -->
          <div class="pk-logo" style="margin-bottom: 12px; cursor: pointer;" id="side-brand-logo">
            <div class="pk-logo-icon">P</div>
            <span>Pinas Kit</span>
          </div>

          <!-- Menu de Navegação Oficial -->
          <nav class="pk-sidebar-menu">
            <div class="pk-sidebar-item ${activeTab === 'overview' ? 'is-active' : ''}" id="side-nav-overview" data-tab="overview">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Visão geral</span>
            </div>

            <!-- ⭐ ABA BOTÕES (CENTRALKIT) -->
            <div class="pk-sidebar-item ${activeTab === 'buttons' ? 'is-active' : ''}" id="side-nav-buttons" data-tab="buttons">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
              <span>Botões</span>
            </div>

            <!-- ⭐ ABA LEADS (IMAGEM 2) -->
            <div class="pk-sidebar-item ${activeTab === 'leads' ? 'is-active' : ''}" id="side-nav-leads" data-tab="leads">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Leads</span>
            </div>

            <div class="pk-sidebar-item ${activeTab === 'crm' ? 'is-active' : ''}" id="side-nav-crm" data-tab="crm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
              <span>CRM</span>
            </div>

            <div class="pk-sidebar-item ${activeTab === 'ads' ? 'is-active' : ''}" id="side-nav-ads" data-tab="ads">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <span>Anúncios</span>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Configurações</span>
          </div>
        </div>
      </aside>

      <!-- CONTEÚDO PRINCIPAL -->
      <main class="pk-main-content">
        <!-- CABEÇALHO SUPERIOR FIXO DO DASHBOARD -->
        <div class="pk-dash-header">
          <div>
            <h2 class="pk-dash-greeting" style="font-size: 22px; font-weight: 800; color: var(--pk-text-primary);">
              ${activeTab === 'overview' ? 'Olá, Mariana! 👋' : activeTab === 'buttons' ? 'Gerenciador de Botões' : activeTab === 'leads' ? 'Base Geral de Leads' : 'Painel de Controle'}
            </h2>
            <p class="pk-dash-subgreeting" style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 2px;">
              ${activeTab === 'overview' ? 'Vamos continuar configurando seu Pinas Kit?' : 'Workspace: Luana Albuquerque · Plano Starter'}
            </p>
          </div>

          <div class="pk-dash-user-bar">
            <!-- Alternador de Tema -->
            <button class="pk-theme-toggle" id="btn-dash-theme-toggle" title="Alternar Tema Claro/Escuro">
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
                <span style="display: block; line-height: 1.2; font-weight: 600;">Mariana</span>
                <span style="font-size: 11px; font-weight: 500; color: var(--pk-primary);">Plano Starter</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RENDERIZAÇÃO DA ABA ATIVA -->
        ${activeTab === 'buttons' 
          ? renderButtonsView() 
          : activeTab === 'leads'
          ? renderLeadsView(leadFilterButton)
          : `
            <!-- VISÃO GERAL (MODELO D OFICIAL) -->
            <div class="pk-overview-view">
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
                          <span style="font-weight: 600;">2. Crie seus botões de captação</span>
                          <p style="font-size: 12px; color: var(--pk-text-muted);">${buttons.length} botões configurados.</p>
                        </div>
                      </div>
                      <span style="font-size: 12px; color: var(--pk-success); font-weight: 600;">Pronto</span>
                    </div>

                    <!-- Passo 3 -->
                    <div class="pk-step-item is-current">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="pk-step-badge-current">3</span>
                        <div>
                          <span style="font-weight: 700; color: var(--pk-primary);">3. Acompanhe tudo aqui</span>
                          <p style="font-size: 12px; color: var(--pk-text-secondary);">Veja conversas, vendas e resultados em um só lugar.</p>
                        </div>
                      </div>
                      <button class="pk-btn pk-btn-primary pk-btn-sm" id="btn-step-open-buttons">
                        Ver Botões →
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
                <div class="pk-card pk-metric-card" style="cursor: pointer;" id="card-metric-leads">
                  <span class="pk-metric-label">Seus leads hoje</span>
                  <div class="pk-metric-value">${leads.length}</div>
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

              <!-- MEUS BOTÕES RECENTES (ATALHO RÁPIDO) -->
              <div class="pk-card" style="padding: 24px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <div>
                    <h3 style="font-size: 18px; font-weight: 700; color: var(--pk-text-primary);">Seus Botões de Captação Ativos</h3>
                    <p style="font-size: 13px; color: var(--pk-text-secondary);">Acesso rápido aos links e scripts instalados nos seus sites.</p>
                  </div>
                  <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-quick-all-buttons">
                    Ver todos os ${buttons.length} botões →
                  </button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
                  ${buttons.map(b => `
                    <div style="padding: 14px 16px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-md); display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong style="font-size: 14px; color: var(--pk-text-primary); display: block;">${b.name}</strong>
                        <span style="font-size: 12px; color: var(--pk-text-muted);">${b.clicks} cliques · ${b.leadsCount} leads</span>
                      </div>
                      <button class="pk-btn pk-btn-primary pk-btn-sm btn-quick-copy" data-slug="${b.slug}" data-name="${b.name}">
                        Copiar Link
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- BANNER DE AJUDA GUIADA (RODAPÉ) -->
              <div class="pk-card pk-help-banner">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <img src="/assets/images/support-avatar.jpg" alt="Suporte" class="pk-help-avatar"/>
                  <div>
                    <strong style="font-size: 15px; display: block; color: var(--pk-text-primary);">Precisa de ajuda?</strong>
                    <span style="font-size: 13px; color: var(--pk-text-secondary);">Nossa equipe de Customer Success está pronta para te orientar em português.</span>
                  </div>
                </div>

                <div class="pk-help-actions">
                  <button class="pk-btn pk-btn-whatsapp pk-btn-sm" id="btn-help-whatsapp">
                    Falar no WhatsApp
                  </button>
                  <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-help-tutorials">
                    ▶ Ver tutoriais
                  </button>
                  <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-help-faq">
                    ? Dúvidas Frequentes
                  </button>
                </div>
              </div>
            </div>
          `}
      </main>

      <!-- BARRA DE NAVEGAÇÃO INFERIOR DEDICADA PARA CELULAR (MOBILE BOTTOM NAV) -->
      <nav class="pk-mobile-nav" id="mobile-bottom-nav">
        <div class="pk-mobile-nav-item ${activeTab === 'overview' ? 'is-active' : ''}" data-mobile-tab="overview">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Início</span>
        </div>
        <div class="pk-mobile-nav-item ${activeTab === 'buttons' ? 'is-active' : ''}" data-mobile-tab="buttons">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
          <span>Botões</span>
        </div>
        <div class="pk-mobile-nav-item ${activeTab === 'leads' ? 'is-active' : ''}" data-mobile-tab="leads">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Leads</span>
        </div>
        <div class="pk-mobile-nav-item ${activeTab === 'crm' ? 'is-active' : ''}" data-mobile-tab="crm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
          <span>CRM</span>
        </div>
      </nav>
    </div>
  `;
}
