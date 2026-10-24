/* ==========================================================================
   PINAS KIT — MÓDULO DE CAMPANHAS & ATRIBUIÇÃO DE TRÁFEGO (CENTRALKIT V7.0)
   MODELO D: ASSISTIDO, DIDÁTICO E ULTRA-INTUITIVO
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderCampaignsView(platformFilter = 'Todas', statusFilter = 'Todas', searchQuery = '') {
  const campaigns = StorageService.getCampaigns(platformFilter, statusFilter, searchQuery);
  const metrics = StorageService.getAggregatedAdMetrics();
  const connectedAds = StorageService.getConnectedAds();

  return `
    <div class="pk-campaigns-view" id="campaigns-view-container">
      <!-- CABEÇALHO DO MÓDULO -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
              Central de Anúncios & Atribuição de Tráfego
            </h1>
            <span class="pk-badge pk-badge-purple" style="font-size: 11px; font-weight: 700;">Multi-Tenant Ads</span>
          </div>
          <p style="font-size: 14px; color: var(--pk-text-secondary); margin-top: 6px;">
            Descubra exatamente quanto você investiu, quantos contatos chegaram no WhatsApp e qual anúncio gerou mais vendas.
          </p>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-open-utm-builder" style="font-weight: 600;">
            🏷️ Gerador de Links UTM
          </button>
          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-open-connect-ads-top" style="font-weight: 600;">
            🔗 Conexões (${connectedAds.facebook ? 'Meta ✓' : 'Meta ✕'} · ${connectedAds.google ? 'Google ✓' : 'Google ✕'})
          </button>
          <button class="pk-btn pk-btn-primary pk-btn-sm" id="btn-create-campaign-shortcut" style="font-weight: 700; box-shadow: 0 4px 14px rgba(124,58,237,0.35);">
            + Rastrear Nova Campanha
          </button>
        </div>
      </div>

      <!-- 4 INDICADORES ESSENCIAIS DE TRÁFEGO (MODELO D) -->
      <div class="pk-metrics-grid" style="margin-bottom: 24px;">
        <!-- Card 1: Investimento Total -->
        <div class="pk-card pk-metric-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="pk-metric-label">Investimento Total</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.1); color: #2563EB; display: grid; place-items: center; font-size: 16px;">
              💳
            </div>
          </div>
          <div class="pk-metric-value">${metrics.totalSpend}</div>
          <span class="pk-metric-trend pk-trend-up">↑ 14% investido no mês</span>
        </div>

        <!-- Card 2: Contatos no WhatsApp -->
        <div class="pk-card pk-metric-card" style="cursor: pointer;" id="metric-card-ad-leads">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="pk-metric-label">Contatos no WhatsApp</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); color: var(--pk-success); display: grid; place-items: center; font-size: 16px;">
              💬
            </div>
          </div>
          <div class="pk-metric-value">${metrics.totalLeads} leads</div>
          <span class="pk-metric-trend" style="color: var(--pk-danger); font-weight: 600;">
            🔥 ${metrics.totalHotLeads} contatos quentes
          </span>
        </div>

        <!-- Card 3: Custo por Contato Real (CPL) -->
        <div class="pk-card pk-metric-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="pk-metric-label">Custo Médio por Contato</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(124, 58, 237, 0.1); color: var(--pk-primary); display: grid; place-items: center; font-size: 16px;">
              🎯
            </div>
          </div>
          <div class="pk-metric-value" style="color: var(--pk-primary);">${metrics.avgCpl}</div>
          <span class="pk-metric-trend pk-trend-up">Taxa de conversão: ${metrics.avgConvRate}</span>
        </div>

        <!-- Card 4: Retorno em Vendas (ROI) -->
        <div class="pk-card pk-metric-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="pk-metric-label">Retorno em Vendas (ROI)</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(245, 158, 11, 0.1); color: #D97706; display: grid; place-items: center; font-size: 16px;">
              💰
            </div>
          </div>
          <div class="pk-metric-value" style="color: var(--pk-success);">${metrics.overallRoi}</div>
          <span class="pk-metric-trend" style="color: var(--pk-success); font-weight: 600;">
            ${metrics.totalRevenue} faturados
          </span>
        </div>
      </div>

      <!-- CARD ASSISTIDO DE DIAGNÓSTICO INTELIGENTE & SIMULADOR DE ROI (LADO A LADO) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px; margin-bottom: 24px;">
        <!-- 1. Diagnóstico Inteligente de Tráfego -->
        <div class="pk-card" style="padding: 20px; border-left: 4px solid var(--pk-primary); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
              <span style="font-size: 18px;">💡</span>
              <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--pk-primary);">
                Diagnóstico Inteligente do Tráfego
              </span>
            </div>
            
            <h3 style="font-size: 17px; font-weight: 700; color: var(--pk-text-primary); line-height: 1.4; margin-bottom: 8px;">
              ${metrics.bestCampaign 
                ? `Sua campanha campeã é "${metrics.bestCampaign.name}"`
                : 'Suas campanhas estão conectadas e acumulando dados.'}
            </h3>

            <p style="font-size: 13.5px; color: var(--pk-text-secondary); line-height: 1.5;">
              ${metrics.bestCampaign
                ? `Ela está gerando contatos por apenas <strong>R$ ${metrics.bestCampaign.cpl}</strong> no WhatsApp com um retorno estimado de <strong>${metrics.bestCampaign.roi}x</strong> em vendas! Recomendamos priorizar o orçamento nesta campanha.`
                : 'Conecte sua conta do Meta Ads e Google Ads para receber insights automáticos de investimento e retorno em tempo real.'}
            </p>
          </div>

          <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--pk-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <span style="font-size: 12px; color: var(--pk-text-muted);">
              ${metrics.activeCampaignsCount} de ${metrics.totalCampaignsCount} campanhas ativas
            </span>
            <button class="pk-btn pk-btn-outline pk-btn-xs" id="btn-sync-ads-now">
              🔄 Sincronizar Gastos Agora
            </button>
          </div>
        </div>

        <!-- 2. Simulador Interativo de Retorno de Investimento (Modelo D) -->
        <div class="pk-card" style="padding: 20px; border-left: 4px solid var(--pk-success);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">🎯</span>
              <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--pk-success);">
                Simulador de Retorno (E se eu investir mais?)
              </span>
            </div>
            <span class="pk-badge pk-badge-success" id="sim-roi-badge">4.8x ROI Estimado</span>
          </div>

          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-bottom: 6px;">
              <span style="font-weight: 600; color: var(--pk-text-primary);">Investimento Adicional:</span>
              <strong style="font-size: 16px; color: var(--pk-primary);" id="sim-budget-display">R$ 500,00</strong>
            </div>
            <input type="range" id="sim-budget-slider" min="100" max="5000" step="50" value="500" style="width: 100%; accent-color: var(--pk-primary); cursor: pointer;"/>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--pk-text-muted); margin-top: 2px;">
              <span>R$ 100</span>
              <span>R$ 2.500</span>
              <span>R$ 5.000</span>
            </div>
          </div>

          <!-- Resultados Projetados -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: var(--pk-bg-subtle); border-radius: 8px; padding: 12px;">
            <div>
              <span style="font-size: 11px; color: var(--pk-text-muted); display: block;">Novos Contatos Estimados:</span>
              <strong style="font-size: 15px; color: var(--pk-text-primary);" id="sim-leads-display">+34 leads</strong>
            </div>
            <div>
              <span style="font-size: 11px; color: var(--pk-text-muted); display: block;">Faturamento Previsto:</span>
              <strong style="font-size: 15px; color: var(--pk-success);" id="sim-revenue-display">R$ 2.400,00</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- BARRA DE FILTROS E BUSCA -->
      <div class="pk-card" style="padding: 16px 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <!-- Filtro por Plataforma -->
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-size: 13px; font-weight: 700; color: var(--pk-text-secondary); margin-right: 4px;">
              Plataforma:
            </span>
            <button class="pk-btn pk-btn-xs campaign-platform-filter ${platformFilter === 'Todas' ? 'pk-btn-primary' : 'pk-btn-secondary'}" data-platform="Todas">
              Todas
            </button>
            <button class="pk-btn pk-btn-xs campaign-platform-filter ${platformFilter === 'meta' ? 'pk-btn-primary' : 'pk-btn-secondary'}" data-platform="meta">
              🔵 Meta Ads (${campaigns.filter(c => c.platform === 'meta').length})
            </button>
            <button class="pk-btn pk-btn-xs campaign-platform-filter ${platformFilter === 'google' ? 'pk-btn-primary' : 'pk-btn-secondary'}" data-platform="google">
              🔴 Google Ads (${campaigns.filter(c => c.platform === 'google').length})
            </button>
          </div>

          <!-- Filtro por Status e Busca -->
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; justify-content: flex-end;">
            <select class="pk-input" id="campaign-status-filter" style="width: auto; min-width: 130px; padding: 7px 12px; font-size: 13px; cursor: pointer;">
              <option value="Todas" ${statusFilter === 'Todas' ? 'selected' : ''}>Todos os status</option>
              <option value="Ativa" ${statusFilter === 'Ativa' ? 'selected' : ''}>Apenas Ativas</option>
              <option value="Pausada" ${statusFilter === 'Pausada' ? 'selected' : ''}>Apenas Pausadas</option>
            </select>

            <div style="position: relative; min-width: 220px;">
              <input type="text" class="pk-input" id="campaign-search-input" value="${searchQuery}" placeholder="Buscar campanha ou botão..." style="padding: 7px 12px 7px 32px; font-size: 13px; width: 100%;"/>
              <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 13px; color: var(--pk-text-muted); pointer-events: none;">🔍</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TABELA CENTRAL DE CAMPANHAS & ATRIBUIÇÃO (CENTRALKIT V7.0) -->
      <div class="pk-card" style="padding: 0; overflow: hidden; margin-bottom: 30px;">
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--pk-border); display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 16px; font-weight: 700; color: var(--pk-text-primary); margin: 0;">
            Campanhas Rastreadas (${campaigns.length})
          </h3>
          <span style="font-size: 12px; color: var(--pk-text-muted);">
            Sincronização contínua com Meta & Google Ads
          </span>
        </div>

        <div style="overflow-x: auto;">
          <table class="pk-table" id="campaigns-data-table" style="width: 100%; border-collapse: collapse; min-width: 860px;">
            <thead>
              <tr style="background-color: var(--pk-bg-subtle); border-bottom: 1px solid var(--pk-border); text-align: left;">
                <th style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                  Campanha & Plataforma
                </th>
                <th style="padding: 12px 14px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">
                  Status
                </th>
                <th style="padding: 12px 14px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">
                  Gasto (R$)
                </th>
                <th style="padding: 12px 14px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">
                  Cliques / CPC
                </th>
                <th style="padding: 12px 14px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">
                  Leads WhatsApp
                </th>
                <th style="padding: 12px 14px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">
                  Custo/Lead (CPL)
                </th>
                <th style="padding: 12px 14px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">
                  Vendas / Faturamento
                </th>
                <th style="padding: 12px 14px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">
                  Retorno (ROI)
                </th>
                <th style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: var(--pk-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              ${campaigns.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align: center; padding: 40px; color: var(--pk-text-muted);">
                    <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
                    <strong style="font-size: 15px; display: block; color: var(--pk-text-primary);">Nenhuma campanha encontrada</strong>
                    <p style="font-size: 13px; margin-top: 4px;">Tente ajustar os filtros acima ou limpe a busca.</p>
                  </td>
                </tr>
              ` : campaigns.map(camp => {
                const isMeta = camp.platform === 'meta';
                const isPaused = camp.status === 'Pausada';
                const cplVal = Number(camp.cpl);
                const cplColor = cplVal <= 15 ? 'var(--pk-success)' : cplVal <= 35 ? '#D97706' : '#EF4444';

                return `
                  <tr style="border-bottom: 1px solid var(--pk-border); transition: background-color var(--pk-transition-fast);" class="campaign-row" data-id="${camp.id}">
                    <!-- Campanha & Plataforma -->
                    <td style="padding: 14px 18px;">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 8px; background: ${isMeta ? '#0866FF' : '#EA4335'}; color: white; display: grid; place-items: center; font-weight: 800; font-size: 14px; flex-shrink: 0;">
                          ${isMeta ? 'f' : 'G'}
                        </div>
                        <div>
                          <strong style="font-size: 14px; color: var(--pk-text-primary); display: block;">${camp.name}</strong>
                          <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                            <span style="font-size: 11.5px; color: var(--pk-text-secondary);">${camp.platformName}</span>
                            <span style="font-size: 10px; color: var(--pk-text-muted);">•</span>
                            <span class="pk-badge pk-badge-purple" style="font-size: 10px; padding: 1px 6px;">${camp.targetButton}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Status -->
                    <td style="padding: 14px; text-align: center;">
                      <button class="pk-btn-toggle-camp-status" data-id="${camp.id}" title="Clique para pausar ou ativar" style="padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; cursor: pointer; border: 1px solid ${isPaused ? 'var(--pk-border)' : 'rgba(16, 185, 129, 0.3)'}; background: ${isPaused ? 'var(--pk-bg-subtle)' : 'rgba(16, 185, 129, 0.1)'}; color: ${isPaused ? 'var(--pk-text-muted)' : 'var(--pk-success)'};">
                        ${isPaused ? '⏸️ Pausada' : '● Ativa'}
                      </button>
                    </td>

                    <!-- Gasto (R$) -->
                    <td style="padding: 14px; text-align: right; font-weight: 700; color: var(--pk-text-primary);">
                      R$ ${camp.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <!-- Cliques / CPC -->
                    <td style="padding: 14px; text-align: center;">
                      <span style="font-size: 13.5px; font-weight: 700; color: var(--pk-text-primary); display: block;">${camp.clicks}</span>
                      <span style="font-size: 11px; color: var(--pk-text-muted);">R$ ${camp.cpc} / clique</span>
                    </td>

                    <!-- Leads no WhatsApp -->
                    <td style="padding: 14px; text-align: center;">
                      <strong style="font-size: 14.5px; color: var(--pk-primary); display: block;">${camp.leadsCount}</strong>
                      <span class="pk-badge pk-badge-hot" style="font-size: 10px; padding: 1px 5px; margin-top: 2px;">
                        🔥 ${camp.hotLeadsCount || 0}
                      </span>
                    </td>

                    <!-- Custo por Lead (CPL) -->
                    <td style="padding: 14px; text-align: right;">
                      <span style="font-size: 14px; font-weight: 800; color: ${cplColor}; display: block;">
                        R$ ${camp.cpl}
                      </span>
                      <span style="font-size: 10.5px; color: var(--pk-text-muted);">${camp.convRate} conv.</span>
                    </td>

                    <!-- Vendas / Faturamento -->
                    <td style="padding: 14px; text-align: right;">
                      <strong style="font-size: 13.5px; color: var(--pk-success); display: block;">
                        R$ ${camp.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                      <span style="font-size: 11px; color: var(--pk-text-muted);">${camp.salesCount} vendas</span>
                    </td>

                    <!-- ROI Real -->
                    <td style="padding: 14px; text-align: center;">
                      <span class="pk-badge ${camp.tier.class}" style="font-size: 11px; font-weight: 800;" title="${camp.tier.tip}">
                        ${camp.roi}x (${camp.tier.badge})
                      </span>
                    </td>

                    <!-- Ações -->
                    <td style="padding: 14px 18px; text-align: right;">
                      <div style="display: flex; gap: 6px; justify-content: flex-end;">
                        <button class="pk-btn pk-btn-outline pk-btn-xs btn-open-utm-with-camp" data-camp="${camp.utmCampaign}" data-button="${camp.targetButton}" title="Gerar link UTM para esta campanha">
                          🏷️ Link
                        </button>
                        <button class="pk-btn pk-btn-primary pk-btn-xs btn-view-camp-leads" data-button="${camp.targetButton}" title="Ver contatos que vieram desta campanha no CRM">
                          Leads →
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
