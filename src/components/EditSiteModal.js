/* ==========================================================================
   PINAS KIT — MODAL DE VINCULAÇÃO E EDIÇÃO DO LINK DO SITE (CENTRALKIT V7.0)
   Garante que cada botão opere exclusivamente no site cadastrado
   ========================================================================== */

export function renderEditSiteModal() {
  return `
    <div class="pk-modal-overlay" id="edit-site-modal-overlay">
      <div class="pk-modal" style="max-width: 520px; padding: 24px;">
        <button class="pk-modal-close" id="btn-close-edit-site-modal" aria-label="Fechar">✕</button>

        <!-- CABEÇALHO DO MODAL -->
        <div style="margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 22px;">🌐</span>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
              Vincular Site ao Botão
            </h2>
          </div>
          <p style="font-size: 13px; color: var(--pk-text-secondary); margin: 0; line-height: 1.5;">
            Defina o link oficial onde o botão "<strong id="edit-site-button-name" style="color: var(--pk-primary);">Glúteo Feminino</strong>" vai operar. Cada site possui seu próprio botão exclusivo.
          </p>
        </div>

        <form id="edit-site-url-form">
          <input type="hidden" id="edit-site-button-id" value=""/>

          <!-- CAMPO DO LINK / DOMÍNIO -->
          <div class="pk-form-group" style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <label class="pk-label" for="edit-site-url-input" style="margin: 0; font-weight: 700;">
                Link ou Domínio do Site *
              </label>
              <span class="pk-badge pk-badge-purple" style="font-size: 10px;">Exclusividade por Domínio</span>
            </div>

            <div style="position: relative; display: flex; align-items: center;">
              <span style="position: absolute; left: 12px; font-size: 14px; opacity: 0.6; pointer-events: none;">🔗</span>
              <input 
                type="text" 
                id="edit-site-url-input" 
                class="pk-input" 
                placeholder="Ex: https://brunamentoriadecarreira.vercel.app ou brunamentoriadecarreira.vercel.app" 
                required 
                style="padding-left: 36px; font-family: monospace; font-size: 12.5px; font-weight: 600;"
              />
            </div>
            <span style="font-size: 11px; color: var(--pk-text-muted); margin-top: 6px; display: block; line-height: 1.4;">
              🔒 <strong>Regra de Proteção:</strong> O botão e o formulário funcionarão apenas neste endereço, evitando conflitos caso você gerencie múltiplos sites de clientes.
            </span>
          </div>

          <!-- CARD DIDÁTICO MODELO D -->
          <div style="padding: 12px 14px; background: rgba(124, 58, 237, 0.06); border-radius: 8px; border: 1px solid rgba(124, 58, 237, 0.2); margin-bottom: 20px; font-size: 12px; color: var(--pk-text-secondary); line-height: 1.5;">
            ⚡ <strong>Atualização Automática no Site:</strong> Ao salvar, a alteração é sincronizada imediatamente. Você não precisa alterar o código no site caso apenas mude o link.
          </div>

          <!-- BOTÕES DE AÇÃO -->
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" class="pk-btn pk-btn-ghost" id="btn-cancel-edit-site" style="font-weight: 600;">
              Cancelar
            </button>
            <button type="submit" class="pk-btn pk-btn-primary" id="btn-save-edit-site" style="font-weight: 700; padding: 10px 20px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);">
              💾 Salvar e Atualizar Site
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
