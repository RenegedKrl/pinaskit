/* ==========================================================================
   PINAS KIT — MÓDULO DE BOTÕES & SITES DE CAPTAÇÃO (CENTRALKIT V7.0)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderButtonsView() {
  const buttons = StorageService.getButtons();
  const maxButtons = 5; // Limite do Plano Starter
  const usedCount = buttons.length;
  const usagePercent = Math.min(Math.round((usedCount / maxButtons) * 100), 100);

  return `
    <div class="pk-buttons-view" id="buttons-view-container">
      <!-- CABEÇALHO DO MÓDULO -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary);">
            Meus Botões & Sites de Captação
          </h1>
          <p style="font-size: 14px; color: var(--pk-text-secondary); margin-top: 4px;">
            Cada botão representa um site, página ou campanha com seu próprio link, métricas e formulário de qualificação.
          </p>
        </div>

        <button class="pk-btn pk-btn-primary" id="btn-create-new-button">
          + Criar Novo Botão / Site
        </button>
      </div>

      <!-- CARD DE COTA DO PLANO (STARTER) -->
      <div class="pk-card" style="padding: 18px 24px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; border-left: 4px solid var(--pk-primary);">
        <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 260px;">
          <div style="width: 44px; height: 44px; border-radius: var(--pk-radius-full); background: var(--pk-primary-light); color: var(--pk-primary); display: grid; place-items: center; font-size: 20px;">
            📁
          </div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 14px; font-weight: 700; color: var(--pk-text-primary);">
                Cota de Sites: <strong>${usedCount} de ${maxButtons} botões ativos</strong>
              </span>
              <span style="font-size: 12px; font-weight: 600; color: var(--pk-primary);">${usagePercent}% utilizado</span>
            </div>
            <div class="pk-progress-bar-container" style="height: 8px; margin: 0;">
              <div class="pk-progress-bar-fill" style="width: ${usagePercent}%;"></div>
            </div>
          </div>
        </div>

        <div style="font-size: 12px; color: var(--pk-text-muted);">
          <span>Precisa de mais sites? </span>
          <a href="#precos" style="color: var(--pk-primary); font-weight: 600; text-decoration: underline;" id="btn-upgrade-plan-hint">
            Fazer Upgrade para o Pro
          </a>
        </div>
      </div>

      <!-- GRADE DE BOTÕES (SUBPASTAS / SITES) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;">
        ${buttons.map(btn => `
          <div class="pk-card pk-card-interactive btn-site-card" data-button-id="${btn.id}" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; position: relative;">
            
            <!-- Topo do Card -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="pk-badge pk-badge-purple" style="font-size: 11px;">
                  ${btn.category || 'Campanha WhatsApp'}
                </span>
                <span class="pk-badge pk-badge-green" style="font-size: 11px;">
                  ● ${btn.status || 'Ativo'}
                </span>
              </div>

              <h2 style="font-size: 18px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 6px;">
                ${btn.name}
              </h2>

              <!-- Link Direto / Slug -->
              <div style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-sm); font-size: 12px; color: var(--pk-text-secondary); margin-bottom: 12px;">
                <span style="opacity: 0.6;">🔗</span>
                <span style="font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                  pinaskit.com.br/b/${btn.slug}
                </span>
              </div>

              <!-- Destino WhatsApp -->
              <p style="font-size: 12px; color: var(--pk-text-muted); margin-bottom: 16px;">
                WhatsApp de destino: <strong style="color: var(--pk-text-primary);">+${btn.whatsappNumber}</strong>
              </p>

              <!-- 3 Métricas de Desempenho do Botão -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-md); text-align: center;">
                <div>
                  <span style="font-size: 11px; color: var(--pk-text-muted); display: block;">Cliques</span>
                  <strong style="font-size: 16px; color: var(--pk-text-primary);">${btn.clicks}</strong>
                </div>
                <div>
                  <span style="font-size: 11px; color: var(--pk-text-muted); display: block;">Leads</span>
                  <strong style="font-size: 16px; color: var(--pk-primary);">${btn.leadsCount}</strong>
                </div>
                <div>
                  <span style="font-size: 11px; color: var(--pk-text-muted); display: block;">Conversão</span>
                  <strong style="font-size: 16px; color: var(--pk-success);">${btn.conversionRate}</strong>
                </div>
              </div>
            </div>

            <!-- Ações do Botão -->
            <div style="border-top: 1px solid var(--pk-border); padding-top: 14px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; gap: 8px;">
                <button class="pk-btn pk-btn-primary pk-btn-sm btn-copy-script-action" data-button-id="${btn.id}" data-button-name="${btn.name}" data-slug="${btn.slug}" style="flex: 1;">
                  📋 Copiar Script
                </button>
                <button class="pk-btn pk-btn-outline pk-btn-sm btn-test-widget-action" data-button-id="${btn.id}" style="flex: 1;">
                  👁️ Testar Widget
                </button>
              </div>

              <div style="display: flex; gap: 8px;">
                <button class="pk-btn pk-btn-secondary pk-btn-sm btn-edit-form-action" data-button-id="${btn.id}" style="flex: 1; font-size: 12px;">
                  ⚙️ Personalizar Pergunta
                </button>
                <button class="pk-btn pk-btn-outline pk-btn-sm btn-view-leads-action" data-button-name="${btn.name}" style="flex: 1; font-size: 12px;">
                  📊 Ver Leads (${btn.leadsCount})
                </button>
              </div>
            </div>

          </div>
        `).join('')}
      </div>
    </div>
  `;
}
