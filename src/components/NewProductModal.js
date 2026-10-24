/* ==========================================================================
   PINAS KIT — MODAL NOVO PRODUTO / SERVIÇO (/painel/crm/produtos)
   Fielmente baseado no CentralKit
   ========================================================================== */

export function renderNewProductModal() {
  return `
    <div class="pk-modal-overlay" id="new-product-modal-overlay" style="display: none; align-items: center; justify-content: center; z-index: 10000;">
      <div class="pk-modal" style="max-width: 480px; width: 90vw; padding: 24px; border-radius: 16px; background: var(--pk-card-bg); border: 1px solid var(--pk-border); box-shadow: 0 20px 45px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
          <h3 style="font-size: 18px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
            Novo produto / serviço
          </h3>
          <button type="button" class="pk-modal-close" id="btn-close-new-product-modal" style="font-size: 18px; cursor: pointer; color: var(--pk-text-muted); background: none; border: none;">✕</button>
        </div>

        <form id="form-create-new-product" style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Nome -->
          <div>
            <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
              Nome *
            </label>
            <input 
              type="text" 
              id="new-product-name" 
              class="pk-input" 
              placeholder="Ex.: Consultoria mensal" 
              required 
              style="width: 100%; height: 40px; font-size: 13.5px;"
            />
          </div>

          <!-- Tipo & Preço (R$) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
                Tipo *
              </label>
              <select id="new-product-kind" class="pk-input" style="width: 100%; height: 40px; font-size: 13px; cursor: pointer;">
                <option value="service" selected>Serviço</option>
                <option value="product">Produto</option>
              </select>
            </div>
            <div>
              <label style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); display: block; margin-bottom: 5px;">
                Preço (R$) *
              </label>
              <input 
                type="text" 
                id="new-product-price" 
                class="pk-input" 
                placeholder="0,00" 
                required 
                style="width: 100%; height: 40px; font-size: 13.5px; font-weight: 700;"
              />
            </div>
          </div>

          <!-- Botões -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--pk-border);">
            <button type="button" class="pk-btn pk-btn-outline" id="btn-cancel-new-product" style="font-size: 13px;">
              Cancelar
            </button>
            <button type="submit" class="pk-btn pk-btn-primary" style="font-size: 13px; font-weight: 700;">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
