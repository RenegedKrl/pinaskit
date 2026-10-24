/* ==========================================================================
   PINAS KIT — MÓDULO DE LEADS (PARIDADE TOTAL COM CENTRALKIT V7.0)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderLeadsView(selectedButton = 'Todos', selectedPeriod = 'Últimos 30 dias', selectedTemp = 'Todos', searchQuery = '') {
  const buttons = StorageService.getButtons();
  let leads = StorageService.getLeads(selectedButton);

  // Filtro por Temperatura
  if (selectedTemp && selectedTemp !== 'Todos') {
    leads = leads.filter(l => l.temperature === selectedTemp);
  }

  // Filtro por Busca de Texto (Nome, Telefone, E-mail)
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    leads = leads.filter(l => 
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q))
    );
  }

  return `
    <div class="pk-leads-view" id="leads-view-container">
      
      <!-- CABEÇALHO DA TELA DE LEADS -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
            Leads
          </h1>
          <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 4px;">
            Contatos capturados pelos formulários dos seus botões.
          </p>
        </div>

        <!-- BARRA DE FERRAMENTAS E FILTROS DO TOPO -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          
          <!-- Busca Instantânea -->
          <div style="position: relative; min-width: 200px;">
            <input 
              type="text" 
              id="input-search-leads" 
              class="pk-input" 
              placeholder="Buscar nome, tel ou e-mail..." 
              value="${searchQuery}" 
              style="padding: 8px 12px 8px 30px; font-size: 13px; width: 100%; box-sizing: border-box;"
            />
            <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 13px; color: var(--pk-text-muted); pointer-events: none;">🔍</span>
          </div>

          <!-- Filtro por Temperatura -->
          <div>
            <select class="pk-input" id="filter-lead-temp" style="padding: 8px 12px; font-size: 13px; font-weight: 500; cursor: pointer;">
              <option value="Todos" ${selectedTemp === 'Todos' ? 'selected' : ''}>Todas as temperaturas</option>
              <option value="Quente" ${selectedTemp === 'Quente' ? 'selected' : ''}>🔥 Quente</option>
              <option value="Morno" ${selectedTemp === 'Morno' ? 'selected' : ''}>❄️ Morno</option>
              <option value="Frio" ${selectedTemp === 'Frio' ? 'selected' : ''}>🧊 Frio</option>
            </select>
          </div>

          <!-- Filtro por Botão / Site -->
          <div style="position: relative;">
            <select class="pk-input" id="filter-lead-button" style="padding: 8px 12px; font-size: 13px; font-weight: 500; cursor: pointer; min-width: 150px;">
              <option value="Todos" ${selectedButton === 'Todos' ? 'selected' : ''}>Todos os botões</option>
              ${buttons.map(b => `
                <option value="${b.name}" ${selectedButton === b.name ? 'selected' : ''}>${b.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Filtro por Período -->
          <div>
            <select class="pk-input" id="filter-lead-period" style="padding: 8px 12px; font-size: 13px; font-weight: 500; cursor: pointer;">
              <option value="Hoje" ${selectedPeriod === 'Hoje' ? 'selected' : ''}>Hoje</option>
              <option value="Últimos 7 dias" ${selectedPeriod === 'Últimos 7 dias' ? 'selected' : ''}>Últimos 7 dias</option>
              <option value="Últimos 30 dias" ${selectedPeriod === 'Últimos 30 dias' ? 'selected' : ''}>Últimos 30 dias</option>
              <option value="Este mês" ${selectedPeriod === 'Este mês' ? 'selected' : ''}>Este mês</option>
            </select>
          </div>

          <!-- Botões de Ação -->
          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-export-excel-leads" style="font-size: 13px;" title="Baixar planilha de leads em formato CSV seguro">
            📊 Exportar Excel
          </button>

          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-scoring-rules" style="font-size: 13px;" title="Configurar regras de pontuação de leads">
            ⚙️ Regras de pontuação
          </button>

          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-leads-settings" style="font-size: 13px;" title="Configurações e automações de CRM">
            Configurações
          </button>
        </div>
      </div>

      <!-- BARRA DE AÇÕES EM LOTE (CONDICIONAL) -->
      <div id="leads-bulk-bar" style="display: none; align-items: center; justify-content: space-between; padding: 10px 16px; margin-bottom: 14px; border-radius: 8px; background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.25);">
        <span style="font-size: 13px; font-weight: 600; color: var(--pk-primary);" id="leads-bulk-count">
          0 leads selecionados
        </span>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="pk-btn pk-btn-sm pk-btn-outline" id="btn-bulk-export">
            Exportar Selecionados
          </button>
          <button type="button" class="pk-btn pk-btn-sm pk-btn-danger" id="btn-bulk-delete">
            Excluir Selecionados
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
              <th style="padding: 14px 16px;">E-mail (Clique p/ Editar)</th>
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
                  <p style="font-size: 12px; margin-top: 4px;">Tente alterar os filtros ou adicione novos botões ao seu site.</p>
                </td>
              </tr>
            ` : leads.map(lead => `
              <tr class="pk-lead-table-row" data-lead-id="${lead.id}" style="border-bottom: 1px solid var(--pk-border); transition: background-color 150ms ease;">
                <!-- Checkbox -->
                <td style="padding: 14px 16px; text-align: center;">
                  <input type="checkbox" class="check-single-lead" data-id="${lead.id}" style="cursor: pointer;"/>
                </td>

                <!-- Temperatura com Badge Semântico -->
                <td style="padding: 14px 16px;">
                  <span class="pk-badge ${lead.temperature === 'Quente' ? 'pk-badge-ruby' : lead.temperature === 'Frio' ? 'pk-badge-blue' : 'pk-badge-amber'}" style="font-size: 11px; font-weight: 600;">
                    ${lead.temperature === 'Quente' ? '🔥 Quente' : lead.temperature === 'Frio' ? '🧊 Frio' : '❄️ Morno'} ${lead.score || 30} pts
                  </span>
                </td>

                <!-- Nome com clique para Drawer da Ficha Completa -->
                <td style="padding: 14px 16px; font-weight: 600; color: var(--pk-text-primary);">
                  <span class="lead-clickable-name" data-id="${lead.id}" style="cursor: pointer; transition: all 150ms ease; border-bottom: 1px dashed var(--pk-primary);" title="Clique para abrir Ficha Completa do Lead">
                    ${lead.name}
                  </span>
                </td>

                <!-- Telefone com Link Direto WhatsApp -->
                <td style="padding: 14px 16px;">
                  <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Olá%20${encodeURIComponent(lead.name)}" target="_blank" style="color: var(--pk-success); font-weight: 600; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;" title="Abrir conversa no WhatsApp">
                    <span style="font-size: 14px;">💬</span>
                    <span>${lead.phone}</span>
                  </a>
                </td>

                <!-- E-mail Editável Inline (Modelo CentralKit editable-cell) -->
                <td style="padding: 14px 16px;">
                  <span class="editable-lead-field" data-id="${lead.id}" data-field="email" title="Clique para editar" style="cursor: pointer; padding: 3px 6px; border-radius: 4px; border-bottom: 1px dotted var(--pk-border); color: ${lead.email && lead.email !== '-' ? 'var(--pk-text-primary)' : 'var(--pk-text-muted)'};">
                    ${lead.email && lead.email !== '-' ? lead.email : '+ Inserir e-mail'}
                  </span>
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
                    <button class="btn-lead-analytics" data-id="${lead.id}" title="Ver Histórico & Métricas" style="color: var(--pk-primary); cursor: pointer; font-size: 15px; background: none; border: none;">
                      📊
                    </button>
                    <button class="btn-lead-delete" data-id="${lead.id}" title="Excluir Lead" style="color: var(--pk-danger); cursor: pointer; font-size: 15px; background: none; border: none;">
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
