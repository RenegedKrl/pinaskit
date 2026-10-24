/* ==========================================================================
   PINAS KIT — CRM & FUNIL DE VENDAS KANBAN (/painel/crm - CENTRALKIT V7.0)
   5 Etapas Oficiais: Novo | Qualificação | Proposta | Negociação | Fechamento
   ========================================================================== */

import { StorageService, formatCurrencyBRL } from '../services/storage.js';

export function renderCrmView(statusFilter = 'open', searchQuery = '') {
  const deals = StorageService.getDeals(statusFilter, searchQuery);
  const metrics = StorageService.getAggregatedCrmMetrics();

  // 5 Etapas Oficiais do CentralKit
  const STAGES = [
    { id: 'Novo', label: 'Novo', icon: '📥', color: 'var(--pk-primary)' },
    { id: 'Qualificação', label: 'Qualificação', icon: '🎯', color: '#3B82F6' },
    { id: 'Proposta', label: 'Proposta', icon: '📝', color: '#F59E0B' },
    { id: 'Negociação', label: 'Negociação', icon: '💬', color: '#8B5CF6' },
    { id: 'Fechamento', label: 'Fechamento', icon: '🎉', color: '#10B981' }
  ];

  // Helper para verificar inatividade (parado há 7 dias ou mais, idêntico ao CentralKit)
  const isStale = (dateStr) => {
    if (!dateStr) return false;
    const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  };

  const getDaysInactive = (dateStr) => {
    if (!dateStr) return 0;
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  };

  return `
    <div class="pk-page-container" style="animation: pkFadeIn 0.3s ease;">
      <!-- CABEÇALHO DO MÓDULO CRM -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span class="pk-badge pk-badge-purple" style="font-size: 11px; font-weight: 700;">
              CRM & Pipeline de Vendas
            </span>
            <span style="font-size: 12px; color: var(--pk-text-muted);">
              Sincronizado com Leads & WhatsApp
            </span>
          </div>
          <h1 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 6px 0; letter-spacing: -0.5px;">
            Funil de Oportunidades
          </h1>
          <p style="font-size: 14px; color: var(--pk-text-secondary); margin: 0;">
            Acompanhe o ciclo de cada oportunidade gerada pelos botões de WhatsApp até o fechamento.
          </p>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="pk-btn pk-btn-outline" id="btn-open-products-catalog" style="font-size: 13px; font-weight: 600;">
            <span>📦</span>
            <span>Produtos e Serviços</span>
          </button>
          <button class="pk-btn pk-btn-primary" id="btn-open-new-deal" style="font-size: 13px; font-weight: 700;">
            <span>+</span>
            <span>Novo Negócio</span>
          </button>
        </div>
      </div>

      <!-- CARDS DE MÉTRICAS DO CRM (CENTRALKIT KPI BAR) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 22px;">
        <div class="pk-card" style="padding: 18px 20px;">
          <span style="font-size: 11.5px; font-weight: 700; color: var(--pk-text-muted); text-transform: uppercase;">
            Pipeline em Aberto
          </span>
          <div style="font-size: 24px; font-weight: 800; color: var(--pk-primary); margin-top: 6px;">
            ${metrics.totalOpenFormatted}
          </div>
          <span style="font-size: 12px; color: var(--pk-text-secondary); margin-top: 2px; display: block;">
            ${metrics.openCount} negócio(s) em andamento
          </span>
        </div>

        <div class="pk-card" style="padding: 18px 20px;">
          <span style="font-size: 11.5px; font-weight: 700; color: var(--pk-text-muted); text-transform: uppercase;">
            Faturamento Ganho ✓
          </span>
          <div style="font-size: 24px; font-weight: 800; color: #10B981; margin-top: 6px;">
            ${metrics.totalWonFormatted}
          </div>
          <span style="font-size: 12px; color: var(--pk-text-secondary); margin-top: 2px; display: block;">
            ${metrics.wonCount} negócio(s) fechado(s)
          </span>
        </div>

        <div class="pk-card" style="padding: 18px 20px;">
          <span style="font-size: 11.5px; font-weight: 700; color: var(--pk-text-muted); text-transform: uppercase;">
            Ticket Médio
          </span>
          <div style="font-size: 24px; font-weight: 800; color: var(--pk-text-primary); margin-top: 6px;">
            ${metrics.avgTicketFormatted}
          </div>
          <span style="font-size: 12px; color: var(--pk-text-secondary); margin-top: 2px; display: block;">
            Por oportunidade convertida
          </span>
        </div>

        <div class="pk-card" style="padding: 18px 20px;">
          <span style="font-size: 11.5px; font-weight: 700; color: var(--pk-text-muted); text-transform: uppercase;">
            Taxa de Conversão
          </span>
          <div style="font-size: 24px; font-weight: 800; color: #8B5CF6; margin-top: 6px;">
            ${metrics.conversionRate}
          </div>
          <span style="font-size: 12px; color: var(--pk-text-secondary); margin-top: 2px; display: block;">
            Ganhos sobre finalizados
          </span>
        </div>
      </div>

      <!-- BARRA DE FILTROS & BUSCA EM TEMPO REAL -->
      <div class="pk-card" style="padding: 14px 18px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <!-- Pills de Status: Abertos, Ganhos, Perdidos, Todos -->
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="pk-btn pk-btn-xs crm-filter-pill ${statusFilter === 'open' ? 'pk-btn-primary' : 'pk-btn-outline'}" data-status="open" style="font-size: 12.5px;">
            Abertos (${metrics.openCount})
          </button>
          <button class="pk-btn pk-btn-xs crm-filter-pill ${statusFilter === 'won' ? 'pk-btn-primary' : 'pk-btn-outline'}" data-status="won" style="font-size: 12.5px;">
            Ganhos (${metrics.wonCount})
          </button>
          <button class="pk-btn pk-btn-xs crm-filter-pill ${statusFilter === 'lost' ? 'pk-btn-primary' : 'pk-btn-outline'}" data-status="lost" style="font-size: 12.5px;">
            Perdidos (${metrics.lostCount})
          </button>
          <button class="pk-btn pk-btn-xs crm-filter-pill ${statusFilter === 'all' ? 'pk-btn-primary' : 'pk-btn-outline'}" data-status="all" style="font-size: 12.5px;">
            Todos (${metrics.totalCount})
          </button>
        </div>

        <!-- Campo de Busca em Tempo Real -->
        <div style="position: relative; min-width: 280px; flex: 1; max-width: 420px;">
          <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; opacity: 0.5;">
            🔍
          </span>
          <input 
            type="text" 
            id="crm-search-input" 
            class="pk-input" 
            placeholder="Buscar negócio por título, cliente ou telefone…" 
            value="${searchQuery}" 
            style="padding-left: 36px; height: 38px; font-size: 13px; width: 100%; border-radius: 8px;"
          />
        </div>
      </div>

      <!-- KANBAN BOARD (5 COLUNAS OFICIAIS DO CENTRALKIT) -->
      <div class="pk-kanban-board" style="display: grid; grid-template-columns: repeat(5, minmax(260px, 1fr)); gap: 14px; overflow-x: auto; padding-bottom: 24px; align-items: flex-start;">
        ${STAGES.map((stage, stageIdx) => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const totalCents = stageDeals.reduce((sum, d) => sum + (d.price_cents || 0), 0);

          return `
            <div class="pk-kanban-column" data-stage="${stage.id}" style="background: var(--pk-bg-subtle); border: 1px solid var(--pk-border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; min-height: 480px;">
              <!-- Cabeçalho da Etapa -->
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 2px solid ${stage.color}; padding-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 14px;">${stage.icon}</span>
                  <span style="font-size: 14px; font-weight: 700; color: var(--pk-text-primary);">
                    ${stage.label}
                  </span>
                  <span class="pk-badge" style="font-size: 11px; padding: 2px 7px; background: rgba(0,0,0,0.06); font-weight: 700;">
                    ${stageDeals.length}
                  </span>
                </div>
                <span style="font-size: 11.5px; font-weight: 700; color: var(--pk-text-muted);">
                  ${formatCurrencyBRL(totalCents)}
                </span>
              </div>

              <!-- Lista de Deals na Coluna -->
              <div class="pk-kanban-cards" style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                ${stageDeals.length === 0 ? `
                  <div style="padding: 24px 12px; text-align: center; border: 1.5px dashed var(--pk-border); border-radius: 8px; color: var(--pk-text-muted); font-size: 12.5px;">
                    Nenhum negócio nesta etapa.
                  </div>
                ` : stageDeals.map(deal => {
                  const stale = isStale(deal.updated_at);
                  const inactiveDays = getDaysInactive(deal.updated_at);

                  return `
                    <div class="pk-card pk-deal-card" data-deal-id="${deal.id}" style="padding: 14px; cursor: pointer; border: 1px solid var(--pk-border); box-shadow: 0 2px 6px rgba(0,0,0,0.04); transition: transform 150ms ease, box-shadow 150ms ease; background: var(--pk-card-bg);">
                      <!-- Alerta de Parado (Se inativo há 7+ dias, idêntico CentralKit) -->
                      ${(stale && deal.status === 'open') ? `
                        <div style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; background: rgba(245, 158, 11, 0.12); color: #D97706; font-size: 10.5px; font-weight: 700; margin-bottom: 8px;">
                          <span>⚠️</span>
                          <span>Parado há ${inactiveDays} dias</span>
                        </div>
                      ` : ''}

                      <!-- Status Badge (Ganho / Perdido se não for aberto) -->
                      ${deal.status === 'won' ? `
                        <div style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 11px; font-weight: 700; margin-bottom: 8px;">
                          <span>✓</span>
                          <span>Ganho</span>
                        </div>
                      ` : deal.status === 'lost' ? `
                        <div style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; background: rgba(239, 68, 68, 0.15); color: #DC2626; font-size: 11px; font-weight: 700; margin-bottom: 8px;">
                          <span>✕</span>
                          <span>Perdido (${deal.lostReason || 'Outro'})</span>
                        </div>
                      ` : ''}

                      <!-- Título do Negócio -->
                      <h4 style="font-size: 14px; font-weight: 700; color: var(--pk-text-primary); margin: 0 0 6px 0; line-height: 1.35;">
                        ${deal.title}
                      </h4>

                      <!-- Contato & WhatsApp -->
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 12.5px;">
                        <span style="color: var(--pk-text-secondary); font-weight: 500;">
                          👤 ${deal.contactName}
                        </span>
                        ${deal.contactPhone ? `
                          <a href="https://wa.me/${deal.contactPhone.replace(/[^0-9]/g, '')}?text=Olá%20${encodeURIComponent(deal.contactName)}" target="_blank" style="color: #10B981; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; text-decoration: none;" title="Abrir conversa no WhatsApp">
                            <span>💬</span>
                          </a>
                        ` : ''}
                      </div>

                      <!-- Produto & Valor em R$ -->
                      <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--pk-border); margin-top: 8px;">
                        <span class="pk-badge pk-badge-purple" style="font-size: 10.5px; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                          ${deal.productName || 'Serviço'}
                        </span>
                        <strong style="font-size: 13.5px; color: var(--pk-text-primary);">
                          ${formatCurrencyBRL(deal.price_cents)}
                        </strong>
                      </div>

                      <!-- Responsável -->
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; font-size: 11px; color: var(--pk-text-muted);">
                        <span>Resp.: <strong>${deal.assignedTo || 'Mariana'}</strong></span>
                      </div>

                      <!-- Barra de Ações Rápidas (Avançar etapa, Ganho, Perdido, Excluir) -->
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--pk-border);">
                        <!-- Navegar entre colunas -->
                        <div style="display: flex; gap: 4px;">
                          <button class="btn-deal-move-prev pk-btn-ghost pk-btn-xs" data-deal-id="${deal.id}" data-current="${deal.stage}" ${stageIdx === 0 ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''} title="Mover para etapa anterior" style="padding: 2px 6px; font-size: 11px;">
                            ←
                          </button>
                          <button class="btn-deal-move-next pk-btn-ghost pk-btn-xs" data-deal-id="${deal.id}" data-current="${deal.stage}" ${stageIdx === STAGES.length - 1 ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''} title="Avançar etapa" style="padding: 2px 6px; font-size: 11px;">
                            →
                          </button>
                        </div>

                        <!-- Botões Ganho / Perdido / Lixeira -->
                        <div style="display: flex; gap: 4px; align-items: center;">
                          ${deal.status === 'open' ? `
                            <button class="btn-deal-mark-won pk-btn-xs" data-deal-id="${deal.id}" title="Marcar como Ganho ✓" style="background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 4px; padding: 2px 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                              ✓ Ganho
                            </button>
                            <button class="btn-deal-mark-lost pk-btn-xs" data-deal-id="${deal.id}" title="Marcar como Perdido ✕" style="background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; padding: 2px 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                              ✕ Perdido
                            </button>
                          ` : ''}
                          <button class="btn-deal-delete pk-btn-ghost pk-btn-xs" data-deal-id="${deal.id}" title="Excluir negócio" style="color: var(--pk-text-muted); padding: 2px 5px; font-size: 12px; cursor: pointer; border: none; background: none;">
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
