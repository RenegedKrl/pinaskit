/* ==========================================================================
   PINAS KIT — MODAL GERADOR DE LINKS COM UTM (MODELO D: ASSISTIDO)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderUtmBuilderModal() {
  const buttons = StorageService.getButtons();
  const firstBtn = buttons[0] || { name: 'Geral', siteUrl: 'https://meusite.com.br/contato', slug: 'contato' };

  return `
    <div class="pk-modal-overlay" id="utm-builder-modal-overlay">
      <div class="pk-modal" id="utm-builder-modal" style="max-width: 620px;">
        <button class="pk-modal-close" id="btn-close-utm-modal" aria-label="Fechar">✕</button>

        <!-- Cabeçalho Didático -->
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--pk-primary-light); color: var(--pk-primary); display: grid; place-items: center; font-size: 22px; flex-shrink: 0;">
            🏷️
          </div>
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
              Gerador de Links Rastreados (UTMs)
            </h2>
            <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 3px;">
              Crie links oficiais para seus anúncios saberem de onde veio cada conversa no WhatsApp.
            </p>
          </div>
        </div>

        <form id="utm-builder-form" style="display: flex; flex-direction: column; gap: 16px;">
          <!-- 1. Selecionar Botão / Site de Destino -->
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 6px;">
              1. Para qual site ou botão você vai enviar o tráfego?
            </label>
            <select class="pk-input" id="utm-target-button" style="cursor: pointer;">
              ${buttons.map(b => `
                <option value="${b.siteUrl || `https://pinaskit.com.br/b/${b.slug}`}" data-name="${b.name}">
                  ${b.name} (${b.siteUrl || `pinaskit.com.br/b/${b.slug}`})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- 2. Onde o Anúncio vai Rodar (Plataforma) -->
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 6px;">
              2. Onde você vai anunciar?
            </label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <label class="pk-utm-source-card" style="border: 1.5px solid var(--pk-primary); background: var(--pk-bg-subtle); padding: 10px 14px; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="radio" name="utm-source-choice" value="meta_ads" checked style="accent-color: var(--pk-primary);"/>
                <div>
                  <strong style="font-size: 13.5px; display: block; color: var(--pk-text-primary);">🔵 Meta Ads</strong>
                  <span style="font-size: 11px; color: var(--pk-text-muted);">Instagram e Facebook</span>
                </div>
              </label>

              <label class="pk-utm-source-card" style="border: 1.5px solid var(--pk-border); background: var(--pk-bg-card); padding: 10px 14px; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="radio" name="utm-source-choice" value="google_ads" style="accent-color: var(--pk-primary);"/>
                <div>
                  <strong style="font-size: 13.5px; display: block; color: var(--pk-text-primary);">🔴 Google Ads</strong>
                  <span style="font-size: 11px; color: var(--pk-text-muted);">Pesquisa e Display</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 3. Formato / Posicionamento (Medium) -->
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 6px;">
              3. Posicionamento do Anúncio (Canal):
            </label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="pk-btn pk-btn-xs pk-btn-secondary utm-medium-chip is-active" data-medium="stories">
                Stories / Reels
              </button>
              <button type="button" class="pk-btn pk-btn-xs pk-btn-secondary utm-medium-chip" data-medium="feed">
                Feed Principal
              </button>
              <button type="button" class="pk-btn pk-btn-xs pk-btn-secondary utm-medium-chip" data-medium="cpc">
                Pesquisa Google (CPC)
              </button>
              <button type="button" class="pk-btn pk-btn-xs pk-btn-secondary utm-medium-chip" data-medium="bio_instagram">
                Link da Bio
              </button>
            </div>
            <input type="hidden" id="utm-medium-value" value="stories"/>
          </div>

          <!-- 4. Nome da Campanha & Identificador do Criativo -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label for="utm-campaign-input" style="display: block; font-size: 12.5px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 4px;">
                4. Nome da Campanha:
              </label>
              <input type="text" class="pk-input" id="utm-campaign-input" value="campanha-outubro" placeholder="ex: promo-verao" style="font-size: 13px;" required/>
            </div>
            <div>
              <label for="utm-content-input" style="display: block; font-size: 12.5px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 4px;">
                5. Anúncio / Criativo (opcional):
              </label>
              <input type="text" class="pk-input" id="utm-content-input" value="video-depoimento-01" placeholder="ex: foto-antes-depois" style="font-size: 13px;"/>
            </div>
          </div>

          <!-- Caixa de Link Final Gerado -->
          <div style="background: var(--pk-bg-subtle); border: 1.5px solid var(--pk-border); border-radius: 8px; padding: 14px; margin-top: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 700; color: var(--pk-primary); text-transform: uppercase; letter-spacing: 0.05em;">
                🔗 Seu Link Rastreado Pronto
              </span>
              <span style="font-size: 11px; color: var(--pk-text-muted);">Pronto para copiar e colar</span>
            </div>
            <textarea id="utm-output-url" readonly rows="3" style="width: 100%; border: 1px solid var(--pk-border); border-radius: 6px; padding: 8px 10px; font-family: monospace; font-size: 12px; background: var(--pk-bg-card); color: var(--pk-text-primary); resize: none; outline: none;"></textarea>

            <button type="button" class="pk-btn pk-btn-primary" id="btn-copy-utm-url" style="width: 100%; margin-top: 10px; font-weight: 700;">
              📋 Copiar Link Rastreado
            </button>
          </div>

          <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--pk-success); border-radius: 6px; padding: 10px 14px; font-size: 12px; color: var(--pk-text-secondary);">
            💡 <strong>Como usar:</strong> Cole esta URL no campo de destino do seu anúncio no Gerenciador da Meta ou Google. Quando o contato clicar no botão do WhatsApp, o Pinas Kit registrará a origem automaticamente!
          </div>
        </form>
      </div>
    </div>
  `;
}
