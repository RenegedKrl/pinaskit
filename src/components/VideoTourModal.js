/* ==========================================================================
   PINAS KIT — MODAL DE VÍDEO EXPLICATIVO ("COMO FUNCIONA EM 1 MINUTO")
   ========================================================================== */

export function renderVideoTourModal() {
  return `
    <div class="pk-modal-overlay" id="video-tour-modal-overlay">
      <div class="pk-modal" style="max-width: 720px; padding: 24px;">
        <button class="pk-modal-close" id="btn-close-video-modal" aria-label="Fechar">✕</button>

        <div style="margin-bottom: 16px;">
          <span class="pk-badge pk-badge-purple" style="margin-bottom: 6px;">🎥 Demonstração Rápida</span>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--pk-text-primary);">
            Veja o Pinas Kit funcionando em 1 minuto
          </h2>
          <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 4px;">
            Descubra como transformar cliques de anúncios em conversas reais e organizadas no WhatsApp.
          </p>
        </div>

        <!-- Player Visual Ilustrado e Interativo -->
        <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #18152C 0%, #2A2050 100%); border-radius: var(--pk-radius-xl); overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px solid var(--pk-border); box-shadow: var(--pk-shadow-lg);">
          
          <!-- Botão Play com Glow -->
          <div style="width: 72px; height: 72px; border-radius: var(--pk-radius-full); background: var(--pk-primary-gradient); color: #FFFFFF; display: grid; place-items: center; cursor: pointer; box-shadow: var(--pk-shadow-purple); transition: transform 200ms ease; transform: scale(1);" id="tour-play-btn">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          </div>

          <div style="margin-top: 16px; text-align: center; color: #FFFFFF; padding: 0 20px;">
            <p style="font-size: 15px; font-weight: 600;">Tour Guiado: Do Anúncio ao Fechamento</p>
            <p style="font-size: 12px; opacity: 0.75; margin-top: 4px;">1. Conecte anúncios &nbsp;·&nbsp; 2. Crie seus botões de WhatsApp &nbsp;·&nbsp; 3. Venda mais</p>
          </div>

          <!-- Barra de Progresso Fictícia do Vídeo -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 6px; background: rgba(255, 255, 255, 0.2);">
            <div style="width: 35%; height: 100%; background: var(--pk-primary);"></div>
          </div>
        </div>

        <!-- 3 Destaques do Vídeo -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
          <div style="padding: 12px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-md); text-align: center;">
            <span style="font-size: 18px;">🔘</span>
            <p style="font-size: 12px; font-weight: 700; color: var(--pk-text-primary); margin-top: 4px;">1. Instale no seu site</p>
            <p style="font-size: 11px; color: var(--pk-text-secondary); margin-top: 2px;">Cole um único script simples no Elementor ou WordPress.</p>
          </div>

          <div style="padding: 12px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-md); text-align: center;">
            <span style="font-size: 18px;">🎯</span>
            <p style="font-size: 12px; font-weight: 700; color: var(--pk-text-primary); margin-top: 4px;">2. Qualifique o lead</p>
            <p style="font-size: 11px; color: var(--pk-text-secondary); margin-top: 2px;">Descubra o momento de compra antes de atender.</p>
          </div>

          <div style="padding: 12px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-md); text-align: center;">
            <span style="font-size: 18px;">📈</span>
            <p style="font-size: 12px; font-weight: 700; color: var(--pk-text-primary); margin-top: 4px;">3. Meça o ROI Real</p>
            <p style="font-size: 11px; color: var(--pk-text-secondary); margin-top: 2px;">Saiba exatamente qual anúncio gerou vendas no Zap.</p>
          </div>
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button class="pk-btn pk-btn-outline pk-btn-sm" id="btn-close-video-modal-bottom">Entendi, fechar</button>
          <button class="pk-btn pk-btn-primary pk-btn-sm" id="btn-video-go-dashboard">Acessar o Painel Agora →</button>
        </div>
      </div>
    </div>
  `;
}
