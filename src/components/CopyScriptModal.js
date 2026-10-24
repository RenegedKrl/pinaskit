/* ==========================================================================
   PINAS KIT — MODAL DE INSTALAÇÃO DO BOTÃO & SCRIPT EMBED
   (COM ABAS: </> CÓDIGO vs 🤖 PEDIR PARA UMA IA)
   ========================================================================== */

export function renderCopyScriptModal() {
  return `
    <div class="pk-modal-overlay" id="copy-script-modal-overlay">
      <div class="pk-modal" style="max-width: 640px; padding: 24px;">
        <button class="pk-modal-close" id="btn-close-copy-modal" aria-label="Fechar">✕</button>

        <!-- CABEÇALHO DO MODAL -->
        <div style="margin-bottom: 18px;">
          <h2 style="font-size: 22px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 6px 0;">
            Botão "<span id="copy-modal-button-name">Glúteo Feminino</span>" criado! 🎉
          </h2>
          <p style="font-size: 13.5px; color: var(--pk-text-secondary); margin: 0;">
            Agora é só instalar no seu site. Escolha a forma mais fácil para você:
          </p>
        </div>

        <!-- SWITCHER DE ABAS: CÓDIGO vs PEDIR PARA UMA IA -->
        <div class="pk-script-tabs">
          <button type="button" class="pk-script-tab is-active" id="tab-btn-code" data-target="copy-tab-code">
            <span>&lt;/&gt; Código</span>
          </button>
          <button type="button" class="pk-script-tab" id="tab-btn-ai" data-target="copy-tab-ai">
            <span>🤖 Pedir para uma IA</span>
          </button>
        </div>

        <!-- CONTEÚDO DA ABA 1: CÓDIGO DIRETO -->
        <div id="copy-tab-code" class="copy-tab-pane">
          <p style="font-size: 13px; color: var(--pk-text-secondary); line-height: 1.5; margin: 0 0 14px 0;">
            Cole este script no seu site, uma única vez (de preferência antes de <code>&lt;/body&gt;</code>). Ele adiciona automaticamente o <strong>Botão Flutuante de WhatsApp</strong> no canto da tela e o <strong>Formulário de Qualificação</strong> ao final da página!
          </p>

          <!-- Bloco do Script de Instalação -->
          <div class="pk-install-code-box">
            <div class="pk-install-label-row">
              <span style="font-size: 12px; font-weight: 700; color: var(--pk-text-primary);">Script de instalação (Botão + Formulário)</span>
              <button type="button" class="pk-btn pk-btn-ghost pk-btn-xs" id="btn-do-copy-script" style="color: var(--pk-primary); font-size: 12px;">
                📋 Copiar Código
              </button>
            </div>
            <textarea 
              id="copy-script-code" 
              class="pk-install-code-text" 
              rows="3" 
              readonly
            >&lt;script async src="https://pinaskit.com.br/embed.js" data-pinaskit="btn-1" data-api="https://api.pinaskit.com.br/v1"&gt;&lt;/script&gt;</textarea>
          </div>

          <!-- Botão para Testar ao Vivo -->
          <a href="/teste-widget.html" target="_blank" class="pk-btn pk-btn-success" id="btn-open-live-test" style="width: 100%; justify-content: center; gap: 8px; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 16px; margin: 12px 0; background: #25D366; border-color: #25D366; color: #FFF; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
            🚀 Testar Script ao Vivo no Navegador (Site Real) →
          </a>

          <!-- Bloco do Link Direto -->
          <div class="pk-install-code-box">
            <div class="pk-install-label-row">
              <span style="font-size: 12px; font-weight: 700; color: var(--pk-text-primary);">Sem site? Use o link direto (bio, anúncios, mensagens)</span>
              <button type="button" class="pk-btn pk-btn-ghost pk-btn-xs" id="btn-do-copy-url" style="color: var(--pk-primary); font-size: 12px;">
                📋 Copiar Link
              </button>
            </div>
            <input 
              type="text" 
              id="copy-direct-url" 
              class="pk-install-code-text" 
              readonly 
              value="https://pinaskit.com.br/b/gluteo-feminino" 
              style="font-size: 13px; font-weight: 600;"
            />
          </div>
        </div>

        <!-- CONTEÚDO DA ABA 2: PEDIR PARA UMA IA -->
        <div id="copy-tab-ai" class="copy-tab-pane" style="display: none;">
          <p style="font-size: 13px; color: var(--pk-text-secondary); line-height: 1.5; margin: 0 0 14px 0;">
            Use este prompt se você estiver construindo seu site com <strong>ChatGPT, Claude, Cursor, v0, Bolt</strong> ou com um programador. Basta copiar e colar:
          </p>

          <div class="pk-install-code-box" style="background-color: var(--pk-bg-subtle);">
            <div class="pk-install-label-row">
              <span style="font-size: 12px; font-weight: 700; color: var(--pk-primary);">Prompt pronto para IA</span>
              <span class="pk-badge pk-badge-purple" style="font-size: 10px;">1 clique para copiar</span>
            </div>

            <textarea 
              id="copy-ai-prompt-code" 
              class="pk-install-code-text" 
              rows="12" 
              readonly 
              style="font-size: 11.5px; line-height: 1.45;"
            >Preciso adicionar um widget de botão flutuante de WhatsApp e formulário de qualificação do Pinas Kit ao meu site.

1. Insira o script oficial imediatamente antes do fechamento da tag </body> em todas as páginas:

<script async src="https://pinaskit.com.br/embed.js" data-pinaskit="btn-1" data-api="https://api.pinaskit.com.br/v1"></script>

2. Localização e Integração do Formulário:
- Se a página já possui um formulário de contato/aplicação (ex: formulário na coluna da direita com título 'Aplicação' ou 'Sua próxima decisão estratégica'), substitua apenas a tag &lt;form&gt; antiga por &lt;div id="pinaskit-form"&gt;&lt;/div&gt; mantendo todo o layout de 2 colunas e textos ao redor intactos.
- O formulário NUNCA deve ficar abaixo do rodapé: certifique-se de que ele fique estritamente ACIMA da tag &lt;footer&gt;.

3. Fluxo de envio de leads:
- Ao preencher o formulário, os dados são enviados diretamente para o CRM do Pinas Kit e uma tela de confirmação de sucesso é exibida na própria página.
- Não há redirecionamento para o WhatsApp do visitante: o próprio assinante/atendente entra em contato com o interessado a partir do painel.
- O script rastreia automaticamente UTMs de anúncios do Meta Ads e Google Ads.</textarea>
          </div>

          <button type="button" class="pk-btn pk-btn-primary" id="btn-do-copy-ai-prompt" style="width: 100%; justify-content: center; font-size: 13.5px; padding: 12px 18px; font-weight: 700;">
            🤖 Copiar Prompt para IA
          </button>

          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; justify-content: center;">
            <span class="pk-badge pk-badge-primary" style="font-size: 10px;">ChatGPT</span>
            <span class="pk-badge pk-badge-purple" style="font-size: 10px;">Claude</span>
            <span class="pk-badge pk-badge-blue" style="font-size: 10px;">Cursor</span>
            <span class="pk-badge pk-badge-green" style="font-size: 10px;">WordPress / Elementor</span>
            <span class="pk-badge pk-badge-amber" style="font-size: 10px;">Shopify / Nuvemshop</span>
            <span class="pk-badge pk-badge-ruby" style="font-size: 10px;">Next.js / React</span>
          </div>
        </div>

        <!-- RODAPÉ INFORMATIVO -->
        <div style="margin-top: 18px; padding: 10px 14px; background-color: var(--pk-bg-subtle); border-radius: var(--pk-radius-md); font-size: 12px; color: var(--pk-text-secondary); display: flex; align-items: center; gap: 8px;">
          <span>💡</span>
          <span>O script detecta automaticamente visitantes do Meta Ads e Google Ads, rastreando cliques e conversões para seu WhatsApp.</span>
        </div>

      </div>
    </div>
  `;
}
