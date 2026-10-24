/* ==========================================================================
   PINAS KIT — MODAL COPIAR SCRIPT & LINK DO BOTÃO
   ========================================================================== */

export function renderCopyScriptModal() {
  return `
    <div class="pk-modal-overlay" id="copy-script-modal-overlay">
      <div class="pk-modal" style="max-width: 580px;">
        <button class="pk-modal-close" id="btn-close-copy-modal" aria-label="Fechar">✕</button>

        <div style="margin-bottom: 20px;">
          <span class="pk-badge pk-badge-purple" style="margin-bottom: 6px;">📋 Instalação Simples</span>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--pk-text-primary);" id="copy-modal-button-name">
            Instalar Botão no seu Site
          </h2>
          <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 4px;">
            Cole este código no seu site (WordPress, Elementor, Wix ou HTML) antes do fechamento da tag &lt;/body&gt;.
          </p>
        </div>

        <!-- Script Embutível -->
        <div class="pk-form-group">
          <label class="pk-label">Código do Widget (JavaScript)</label>
          <div style="position: relative;">
            <textarea 
              id="copy-script-code" 
              class="pk-textarea" 
              rows="3" 
              readonly 
              style="font-family: monospace; font-size: 12px; background-color: var(--pk-bg-subtle); resize: none;"
            >&lt;script src="https://pinaskit.com.br/widget.js" data-button-id="btn-1" defer&gt;&lt;/script&gt;</textarea>
            <button class="pk-btn pk-btn-primary pk-btn-sm" id="btn-do-copy-script" style="position: absolute; bottom: 12px; right: 12px;">
              Copiar Código
            </button>
          </div>
        </div>

        <!-- Link Direto / Redirecionador -->
        <div class="pk-form-group" style="margin-top: 16px;">
          <label class="pk-label">Link Direto para Anúncios (Bio do Insta / Google Ads)</label>
          <div style="display: flex; gap: 8px;">
            <input 
              type="text" 
              id="copy-direct-url" 
              class="pk-input" 
              readonly 
              value="https://pinaskit.com.br/b/gluteo-feminino" 
              style="font-size: 13px;"
            />
            <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-do-copy-url">
              Copiar Link
            </button>
          </div>
        </div>

        <div style="margin-top: 24px; padding: 12px 16px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-md); font-size: 12px; color: var(--pk-text-secondary); display: flex; align-items: center; gap: 8px;">
          <span>💡</span>
          <span>Este link rastreia automaticamente UTMs da Meta e Google Ads e pontua o lead em tempo real.</span>
        </div>
      </div>
    </div>
  `;
}
