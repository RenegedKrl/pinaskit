/* ==========================================================================
   PINAS KIT — MODAL NOVO NEGÓCIO NO CRM (/painel/crm)
   ========================================================================== */

import { StorageService, formatCurrencyBRL } from '../services/storage.js';

export function renderNewDealModal() {
  const leads = StorageService.getLeads();
  const products = StorageService.getProducts();

  return `
    <div class="pk-modal-overlay" id="new-deal-modal-overlay" style="display: none; align-items: center; justify-content: center; z-index: 10000;">
      <div class="pk-modal" style="max-width: 540px; width: 90vw; padding: 24px; border-radius: 16px; background: var(--pk-card-bg); border: 1px solid var(--pk-border); box-shadow: 0 20px 45px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">💼</span>
            <h3 style="font-size: 18px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
              Novo Negócio no CRM
            </h3>
          </div>
          <button type="button" class="pk-modal-close" id="btn-close-new-deal-modal" style="font-size: 18px; cursor: pointer; color: var(--pk-text-muted); background: none; border: none;">✕</button>
        </div>

        <form id="form-create-new-deal" style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Título da Oportunidade -->
          <div>
            <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
              Título do Negócio *
            </label>
            <input 
              type="text" 
              id="new-deal-title" 
              class="pk-input" 
              placeholder="Ex: Mentoria Executiva - Nome do Cliente" 
              required 
              style="width: 100%; height: 40px; font-size: 13.5px;"
            />
          </div>

          <!-- Vincular a um Lead Existente (Opcional) -->
          <div>
            <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
              Vincular a um Lead Captado (Opcional)
            </label>
            <select id="new-deal-lead-select" class="pk-input" style="width: 100%; height: 40px; font-size: 13px; cursor: pointer;">
              <option value="">-- Contato Avulso / Não vinculado a lead --</option>
              ${leads.map(lead => `
                <option value="${lead.id}" data-name="${lead.name}" data-phone="${lead.phone}" data-email="${lead.email}">
                  ${lead.name} (${lead.button || 'Geral'}) · ${lead.phone}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Dados do Contato -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
                Nome do Cliente *
              </label>
              <input 
                type="text" 
                id="new-deal-contact-name" 
                class="pk-input" 
                placeholder="Ex: Mariana Silva" 
                required 
                style="width: 100%; height: 38px; font-size: 13px;"
              />
            </div>
            <div>
              <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
                WhatsApp com DDD *
              </label>
              <input 
                type="tel" 
                id="new-deal-contact-phone" 
                class="pk-input" 
                placeholder="(11) 98765-4321" 
                required 
                style="width: 100%; height: 38px; font-size: 13px;"
              />
            </div>
          </div>

          <!-- Produto do Catálogo & Valor -->
          <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 10px;">
            <div>
              <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
                Produto / Serviço do Catálogo
              </label>
              <select id="new-deal-product-select" class="pk-input" style="width: 100%; height: 38px; font-size: 12.5px; cursor: pointer;">
                <option value="" data-price="0">-- Selecione ou digite o valor ao lado --</option>
                ${products.map(p => `
                  <option value="${p.id}" data-price="${p.price_cents}" data-name="${p.name}">
                    ${p.name} (${formatCurrencyBRL(p.price_cents)})
                  </option>
                `).join('')}
              </select>
            </div>
            <div>
              <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
                Valor (R$) *
              </label>
              <input 
                type="text" 
                id="new-deal-price" 
                class="pk-input" 
                placeholder="0,00" 
                required 
                style="width: 100%; height: 38px; font-size: 13px; font-weight: 700;"
              />
            </div>
          </div>

          <!-- Etapa Inicial & Responsável -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
                Etapa do Funil *
              </label>
              <select id="new-deal-stage" class="pk-input" style="width: 100%; height: 38px; font-size: 13px; cursor: pointer;">
                <option value="Novo">📥 Novo</option>
                <option value="Qualificação">🎯 Qualificação</option>
                <option value="Proposta">📝 Proposta</option>
                <option value="Negociação">💬 Negociação</option>
                <option value="Fechamento">🎉 Fechamento</option>
              </select>
            </div>
            <div>
              <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
                Responsável
              </label>
              <input 
                type="text" 
                id="new-deal-assigned" 
                class="pk-input" 
                value="Mariana" 
                style="width: 100%; height: 38px; font-size: 13px;"
              />
            </div>
          </div>

          <!-- Botões de Ação -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--pk-border);">
            <button type="button" class="pk-btn pk-btn-outline" id="btn-cancel-new-deal" style="font-size: 13px;">
              Cancelar
            </button>
            <button type="submit" class="pk-btn pk-btn-primary" style="font-size: 13px; font-weight: 700;">
              Salvar Oportunidade
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
