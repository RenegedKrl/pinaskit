/* ==========================================================================
   PINAS KIT — MÓDULO DE BOTÕES & SITES DE CAPTAÇÃO (CENTRALKIT V7.0)
   MODELO D: ASSISTIDO, DIDÁTICO E ULTRA-INTUITIVO
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
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
              Meus Botões & Sites de Captação
            </h1>
            <span class="pk-badge pk-badge-purple" style="font-size: 11px; font-weight: 700;">CentralKit v7.0</span>
          </div>
          <p style="font-size: 14px; color: var(--pk-text-secondary); margin-top: 6px;">
            Cada botão é um kit completo para o seu site: <strong>Botão Flutuante de WhatsApp</strong> no canto da tela + <strong>Formulário de Qualificação</strong> no final da página.
          </p>
        </div>

        <button class="pk-btn pk-btn-primary" id="btn-create-new-button" style="font-weight: 700; box-shadow: 0 4px 14px rgba(124,58,237,0.35);">
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
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;">
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

              <h2 style="font-size: 19px; font-weight: 800; color: var(--pk-text-primary); margin-bottom: 6px;">
                ${btn.name}
              </h2>

              <!-- Link Direto / Slug -->
              <div style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-sm); font-size: 12px; color: var(--pk-text-secondary); margin-bottom: 8px;">
                <span style="opacity: 0.6;">🔗</span>
                <span style="font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                  pinaskit.com.br/b/${btn.slug}
                </span>
              </div>

              <!-- Site Vinculado Exclusivo -->
              <div class="pk-site-url-card-box" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 10px; background: rgba(124, 58, 237, 0.05); border: 1.5px solid rgba(124, 58, 237, 0.22); border-radius: var(--pk-radius-sm); font-size: 12px; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; flex: 1;">
                  <span style="font-size: 14px;">🌐</span>
                  <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                    <span style="font-size: 9.5px; font-weight: 800; color: var(--pk-primary); text-transform: uppercase; letter-spacing: 0.5px; display: block; line-height: 1.1;">Site Vinculado Exclusivo</span>
                    ${btn.siteUrl ? `
                      <a href="${btn.siteUrl}" target="_blank" rel="noopener noreferrer" class="btn-linked-website-link" style="font-size: 11.5px; font-weight: 700; color: var(--pk-text-primary); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;" title="${btn.siteUrl}">
                        ${btn.siteUrl.replace(/^https?:\/\//, '')} ↗
                      </a>
                    ` : `
                      <span style="font-size: 11.5px; color: var(--pk-text-muted); font-style: italic;">Nenhum site configurado</span>
                    `}
                  </div>
                </div>
                <button type="button" class="pk-btn pk-btn-ghost pk-btn-xs btn-quick-edit-site-url" data-button-id="${btn.id}" data-site-url="${btn.siteUrl || ''}" data-button-name="${btn.name}" title="Alterar o link do site deste botão" style="font-size: 11px; font-weight: 700; color: var(--pk-primary); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(124, 58, 237, 0.25); background: var(--pk-bg-card); cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                  ✏️ Alterar Site
                </button>
              </div>

              <!-- Destino WhatsApp -->
              <p style="font-size: 12px; color: var(--pk-text-muted); margin-bottom: 12px;">
                WhatsApp de destino: <strong style="color: var(--pk-text-primary);">+${btn.whatsappNumber}</strong>
              </p>

              <!-- PAINEL DOS 2 COMPONENTES ATIVOS NO SITE -->
              <div style="display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; background: var(--pk-bg-subtle); border: 1px solid var(--pk-border); border-radius: 8px; margin-bottom: 14px; font-size: 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="display: flex; align-items: center; gap: 6px; color: var(--pk-text-primary); font-weight: 600;">
                    <span>🟢</span> Botão Flutuante:
                  </span>
                  <span style="color: #10B981; font-weight: 700; font-size: 11.5px;">
                    Ativo (${btn.style?.position === 'left' ? 'Canto Esquerdo' : 'Canto Direito'})
                  </span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="display: flex; align-items: center; gap: 6px; color: var(--pk-text-primary); font-weight: 600;">
                    <span>📋</span> Formulário no Rodapé:
                  </span>
                  <span style="color: var(--pk-primary); font-weight: 700; font-size: 11.5px;">
                    ${btn.formConfig?.options?.length || 3} opções de triagem
                  </span>
                </div>
              </div>

              <!-- 3 Métricas de Desempenho do Botão -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; background-color: var(--pk-bg-card); border: 1px solid var(--pk-border); border-radius: var(--pk-radius-md); text-align: center;">
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
                <button class="pk-btn pk-btn-primary pk-btn-sm btn-copy-script-action" data-button-id="${btn.id}" data-button-name="${btn.name}" data-slug="${btn.slug}" style="flex: 1.1; font-weight: 700;">
                  📋 Copiar Script
                </button>
                <a href="/teste-widget.html?button=${btn.id}" target="_blank" class="pk-btn pk-btn-outline pk-btn-sm btn-test-widget-action btn-live-site-action" data-button-id="${btn.id}" style="flex: 0.9; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600;" title="Abrir página de teste com este widget ativo">
                  🚀 Testar no Site
                </a>
              </div>

              <div style="display: flex; gap: 8px;">
                <button class="pk-btn pk-btn-secondary pk-btn-sm btn-edit-form-action" data-button-id="${btn.id}" style="flex: 1.1; font-size: 12px; font-weight: 600;">
                  ⚙️ Personalizar Pergunta
                </button>
                <button class="pk-btn pk-btn-outline pk-btn-sm btn-view-leads-action" data-button-name="${btn.name}" style="flex: 0.9; font-size: 12px;">
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
