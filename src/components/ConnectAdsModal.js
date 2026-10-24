/* ==========================================================================
   PINAS KIT — MODAL DE CONEXÃO DE ANÚNCIOS (META & GOOGLE ADS)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderConnectAdsModal() {
  const ads = StorageService.getConnectedAds();

  return `
    <div class="pk-modal-overlay" id="connect-ads-modal-overlay">
      <div class="pk-modal" id="connect-ads-modal" style="max-width: 500px;">
        <button class="pk-modal-close" id="btn-close-ads-modal" aria-label="Fechar">✕</button>

        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background-color: var(--pk-primary-light); color: var(--pk-primary); display: grid; place-items: center; margin: 0 auto 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--pk-text-primary);">Conectar Anúncios</h2>
          <p style="font-size: 14px; color: var(--pk-text-secondary); margin-top: 4px;">
            Escolha a plataforma que você usa para receber seus contatos.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
          <!-- Facebook Ads -->
          <div class="pk-card" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; border-color: ${ads.facebook ? 'var(--pk-success)' : 'var(--pk-border)'};">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background-color: #0866FF; color: white; display: grid; place-items: center; font-weight: 800;">
                f
              </div>
              <div>
                <strong style="font-size: 15px; display: block; color: var(--pk-text-primary);">Facebook Ads</strong>
                <span style="font-size: 12px; color: var(--pk-text-muted);">Contas e campanhas da Meta</span>
              </div>
            </div>
            <button class="pk-btn ${ads.facebook ? 'pk-btn-whatsapp' : 'pk-btn-outline'} pk-btn-sm" id="btn-toggle-meta-connect">
              ${ads.facebook ? '✓ Conectado' : 'Conectar'}
            </button>
          </div>

          <!-- Instagram -->
          <div class="pk-card" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; border-color: ${ads.instagram ? 'var(--pk-success)' : 'var(--pk-border)'};">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; display: grid; place-items: center; font-weight: 800;">
                📸
              </div>
              <div>
                <strong style="font-size: 15px; display: block; color: var(--pk-text-primary);">Instagram Ads</strong>
                <span style="font-size: 12px; color: var(--pk-text-muted);">Stories, Reels e Feed</span>
              </div>
            </div>
            <button class="pk-btn ${ads.instagram ? 'pk-btn-whatsapp' : 'pk-btn-outline'} pk-btn-sm" id="btn-toggle-insta-connect">
              ${ads.instagram ? '✓ Conectado' : 'Conectar'}
            </button>
          </div>

          <!-- Google Ads -->
          <div class="pk-card" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; border-color: ${ads.google ? 'var(--pk-success)' : 'var(--pk-border)'};">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background-color: #4285F4; color: white; display: grid; place-items: center; font-weight: 800;">
                G
              </div>
              <div>
                <strong style="font-size: 15px; display: block; color: var(--pk-text-primary);">Google Ads</strong>
                <span style="font-size: 12px; color: var(--pk-text-muted);">Pesquisa e Rede de Display</span>
              </div>
            </div>
            <button class="pk-btn ${ads.google ? 'pk-btn-whatsapp' : 'pk-btn-outline'} pk-btn-sm" id="btn-toggle-google-connect">
              ${ads.google ? '✓ Conectado' : 'Conectar'}
            </button>
          </div>
        </div>

        <div style="background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-md); padding: 12px 16px; display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--pk-text-secondary); margin-bottom: 20px;">
          <span>🔒</span>
          <span>Conexão direta oficial via OAuth 2.0 criptografado. Seus dados e senhas nunca são compartilhados.</span>
        </div>

        <button class="pk-btn pk-btn-primary pk-btn-lg" id="btn-finish-ads-connect" style="width: 100%;">
          Concluir Conexões →
        </button>
      </div>
    </div>
  `;
}
