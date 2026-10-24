/* ==========================================================================
   PINAS KIT — MODAL MARCAR NEGÓCIO COMO PERDIDO (CENTRALKIT V7.0)
   ========================================================================== */

export function renderLostDealModal() {
  const REASONS = ['Preço', 'Sem retorno', 'Concorrente', 'Sem orçamento', 'Timing', 'Outro'];

  return `
    <div class="pk-modal-overlay" id="lost-deal-modal-overlay" style="display: none; align-items: center; justify-content: center; z-index: 10000;">
      <div class="pk-modal" style="max-width: 440px; width: 90vw; padding: 24px; border-radius: 16px; background: var(--pk-card-bg); border: 1px solid var(--pk-border); box-shadow: 0 20px 45px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h3 style="font-size: 17px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
            Por que este negócio foi perdido?
          </h3>
          <button type="button" class="pk-modal-close" id="btn-close-lost-deal-modal" style="font-size: 18px; cursor: pointer; color: var(--pk-text-muted); background: none; border: none;">✕</button>
        </div>

        <p style="font-size: 13px; color: var(--pk-text-secondary); margin: 0 0 16px 0; line-height: 1.45;">
          Identifique o motivo da perda para calibrar suas estratégias de qualificação e anúncios futuros.
        </p>

        <form id="form-confirm-lost-deal" style="display: flex; flex-direction: column; gap: 14px;">
          <input type="hidden" id="lost-deal-id" value="" />

          <!-- Motivo da Perda (Lista Oficial CentralKit) -->
          <div>
            <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
              Motivo principal *
            </label>
            <select id="lost-deal-reason" class="pk-input" style="width: 100%; height: 40px; font-size: 13px; cursor: pointer;">
              ${REASONS.map(r => `<option value="${r}">${r}</option>`).join('')}
            </select>
          </div>

          <!-- Anotação Interna -->
          <div>
            <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
              Observações (Opcional)
            </label>
            <textarea 
              id="lost-deal-notes" 
              class="pk-input" 
              rows="3" 
              placeholder="Ex: Cliente achou caro mas pediu retorno no próximo mês..." 
              style="width: 100%; font-size: 12.5px; padding: 10px; resize: vertical;"
            ></textarea>
          </div>

          <!-- Botões -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--pk-border);">
            <button type="button" class="pk-btn pk-btn-outline" id="btn-cancel-lost-deal" style="font-size: 13px;">
              Cancelar
            </button>
            <button type="submit" class="pk-btn pk-btn-danger" style="font-size: 13px; font-weight: 700; background: #EF4444; color: #FFF;">
              Confirmar Perda
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
