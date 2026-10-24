/* ==========================================================================
   PINAS KIT — MÓDULO DE LEADS (CENTRALKIT V7.0 OFICIAL - IMAGEM 2)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderLeadsView(selectedButton = 'Todos', selectedPeriod = 'Últimos 30 dias') {
  const buttons = StorageService.getButtons();
  const leads = StorageService.getLeads(selectedButton);

  return `
    <div class="pk-leads-view" id="leads-view-container">
      <!-- CABEÇALHO DA TELA DE LEADS -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary);">
            Leads
          </h1>
          <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 4px;">
            Contatos capturados pelos formulários dos seus botões.
          </p>
        </div>

        <!-- BARRA DE FERRAMENTAS E FILTROS DO TOPO -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          
          <!-- Filtro por Botão / Site -->
          <div style="position: relative;">
            <select class="pk-input" id="filter-lead-button" style="padding: 8px 14px; font-size: 13px; font-weight: 500; cursor: pointer; min-width: 170px;">
              <option value="Todos" ${selectedButton === 'Todos' ? 'selected' : ''}>Todos os botões</option>
              ${buttons.map(b => `
                <option value="${b.name}" ${selectedButton === b.name ? 'selected' : ''}>${b.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Filtro por Período -->
          <div>
            <select class="pk-input" id="filter-lead-period" style="padding: 8px 14px; font-size: 13px; font-weight: 500; cursor: pointer;">
              <option value="Hoje">Hoje</option>
              <option value="Últimos 7 dias">Últimos 7 dias</option>
              <option value="Últimos 30 dias" selected>Últimos 30 dias</option>
              <option value="Este mês">Este mês</option>
            </select>
          </div>

          <!-- Botões de Ação -->
          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-export-excel-leads" style="font-size: 13px;">
            📊 Exportar Excel
          </button>

          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-scoring-rules" style="font-size: 13px;">
            ⚙️ Regras de pontuação
          </button>

          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-leads-settings" style="font-size: 13px;">
            Configurações
          </button>
        </div>
      </div>

      <!-- TABELA CENTRAL DE LEADS (CENTRALKIT STYLE) -->
      <div class="pk-card" style="padding: 0; overflow-x: auto; border-radius: var(--pk-radius-xl); box-shadow: var(--pk-shadow-sm);">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; font-family: var(--pk-font-data);">
          
          <!-- Cabeçalho da Tabela -->
          <thead>
            <tr style="background-color: var(--pk-bg-subtle); border-bottom: 1px solid var(--pk-border); color: var(--pk-text-secondary); font-weight: 600; font-size: 12px;">
              <th style="padding: 14px 16px; width: 40px; text-align: center;">
                <input type="checkbox" id="check-all-leads" style="cursor: pointer;"/>
              </th>
              <th style="padding: 14px 16px;">Temperatura</th>
              <th style="padding: 14px 16px;">Nome</th>
              <th style="padding: 14px 16px;">Telefone</th>
              <th style="padding: 14px 16px;">E-mail</th>
              <th style="padding: 14px 16px;">Botão</th>
              <th style="padding: 14px 16px;">Origem</th>
              <th style="padding: 14px 16px; text-align: center;">Interações</th>
              <th style="padding: 14px 16px;">Última visita</th>
              <th style="padding: 14px 16px; text-align: center;">Ações</th>
            </tr>
          </thead>

          <!-- Linhas de Dados -->
          <tbody>
            ${leads.length === 0 ? `
              <tr>
                <td colspan="10" style="padding: 48px; text-align: center; color: var(--pk-text-muted);">
                  <div style="font-size: 32px; margin-bottom: 8px;">📭</div>
                  <strong>Nenhum lead encontrado para este filtro.</strong>
                  <p style="font-size: 12px; margin-top: 4px;">Instale seu botão no site para começar a receber contatos no WhatsApp.</p>
                </td>
              </tr>
            ` : leads.map(lead => `
              <tr class="pk-lead-table-row" style="border-bottom: 1px solid var(--pk-border); transition: background-color 150ms ease;">
                <!-- Checkbox -->
                <td style="padding: 14px 16px; text-align: center;">
                  <input type="checkbox" class="check-single-lead" data-id="${lead.id}" style="cursor: pointer;"/>
                </td>

                <!-- Temperatura com Badge -->
                <td style="padding: 14px 16px;">
                  <span class="pk-badge ${lead.temperature === 'Quente' ? 'pk-badge-ruby' : lead.temperature === 'Frio' ? 'pk-badge-blue' : 'pk-badge-amber'}" style="font-size: 11px; font-weight: 600;">
                    ${lead.temperature === 'Quente' ? '🔥 Quente' : lead.temperature === 'Frio' ? '🧊 Frio' : '❄️ Morno'} ${lead.score || 30} pts
                  </span>
                </td>

                <!-- Nome com link para Drawer da Ficha Completa -->
                <td style="padding: 14px 16px; font-weight: 600; color: var(--pk-text-primary);">
                  <span class="lead-clickable-name" data-id="${lead.id}" style="cursor: pointer; transition: all 150ms ease; border-bottom: 1px dashed var(--pk-primary);" title="Clique para abrir Ficha Completa do Lead">
                    ${lead.name}
                  </span>
                </td>

                <!-- Telefone com Link WhatsApp -->
                <td style="padding: 14px 16px;">
                  <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Olá%20${encodeURIComponent(lead.name)}" target="_blank" style="color: var(--pk-success); font-weight: 600; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;" title="Abrir conversa no WhatsApp">
                    <span style="font-size: 14px;">💬</span>
                    <span>${lead.phone}</span>
                  </a>
                </td>

                <!-- E-mail -->
                <td style="padding: 14px 16px; color: var(--pk-text-muted);">
                  ${lead.email || '-'}
                </td>

                <!-- Botão de Origem -->
                <td style="padding: 14px 16px; font-weight: 500; color: var(--pk-text-primary);">
                  ${lead.button || 'Geral'}
                </td>

                <!-- Origem (Google Ads, Meta Ads) -->
                <td style="padding: 14px 16px;">
                  <span class="pk-badge ${lead.origin.includes('Google') ? 'pk-badge-blue' : lead.origin.includes('Meta') ? 'pk-badge-purple' : 'pk-badge-green'}" style="font-size: 11px;">
                    ${lead.origin}
                  </span>
                </td>

                <!-- Interações -->
                <td style="padding: 14px 16px; text-align: center; color: var(--pk-text-secondary); font-weight: 600;">
                  ${lead.interactions || 1}
                </td>

                <!-- Última visita -->
                <td style="padding: 14px 16px; color: var(--pk-text-secondary); font-size: 12px;">
                  ${lead.lastVisit || 'Hoje'}
                </td>

                <!-- Ações -->
                <td style="padding: 14px 16px; text-align: center;">
                  <div style="display: inline-flex; align-items: center; gap: 10px;">
                    <button class="btn-lead-analytics" data-id="${lead.id}" title="Ver Histórico & Métricas" style="color: var(--pk-primary); cursor: pointer; font-size: 15px;">
                      📊
                    </button>
                    <button class="btn-lead-delete" data-id="${lead.id}" title="Excluir Lead" style="color: var(--pk-danger); cursor: pointer; font-size: 15px;">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- RODAPÉ DA TABELA -->
        <div style="padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--pk-text-muted); background-color: var(--pk-bg-subtle); border-top: 1px solid var(--pk-border); flex-wrap: wrap; gap: 12px;">
          <span>Mostrando 1-${leads.length} de ${leads.length} leads</span>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span>Itens por página:</span>
            <select class="pk-input" style="padding: 4px 8px; font-size: 12px; cursor: pointer;">
              <option value="25" selected>25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
}
