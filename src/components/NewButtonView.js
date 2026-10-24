/* ==========================================================================
   PINAS KIT — TELA DE NOVO BOTÃO & CUSTOMIZADOR DE WIDGET FLUTUANTE
   (PADRÃO CENTRALKIT: IDENTIFICAÇÃO, CONTEÚDO, APARÊNCIA E PREVIEW AO VIVO)
   ========================================================================== */

export function renderNewButtonView() {
  return `
    <div class="pk-new-button-container" id="new-button-view-container">
      
      <!-- CABEÇALHO COM BOTÃO VOLTAR -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <button type="button" class="pk-btn pk-btn-ghost pk-btn-sm" id="btn-back-to-buttons" style="font-size: 13.5px; font-weight: 700; color: var(--pk-text-primary); padding: 6px 12px;">
            ← Voltar para Botões
          </button>
          <div style="height: 20px; width: 1px; background: var(--pk-border);"></div>
          <div>
            <h1 style="font-size: 22px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">Novo botão</h1>
            <span style="font-size: 12px; color: var(--pk-text-muted);">Configure o número de WhatsApp, aparência e o widget flutuante do seu site</span>
          </div>
        </div>
      </div>

      <form id="new-button-form">
        <div class="pk-new-button-grid" style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 28px; align-items: start;">
          
          <!-- COLUNA DA ESQUERDA: FORMULÁRIO COMPLETO -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <!-- 1. IDENTIFICAÇÃO -->
            <div class="pk-card" style="padding: 20px;">
              <h3 style="font-size: 15px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 4px 0;">Identificação</h3>
              <p style="font-size: 12.5px; color: var(--pk-text-muted); margin: 0 0 16px 0;">Nome interno para você identificar este botão no painel e relatórios.</p>

              <div class="pk-form-group">
                <label class="pk-label" for="new-btn-name">Nome interno *</label>
                <input type="text" id="new-btn-name" class="pk-input" placeholder="Ex: Harmonização Facial" value="Harmonização Facial" required/>
              </div>
            </div>

            <!-- 2. CONTEÚDO -->
            <div class="pk-card" style="padding: 20px;">
              <h3 style="font-size: 15px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 4px 0;">Conteúdo</h3>
              <p style="font-size: 12.5px; color: var(--pk-text-muted); margin: 0 0 16px 0;">Configure o número de destino e os textos de abordagem.</p>

              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div class="pk-form-group">
                  <label class="pk-label" for="new-btn-whatsapp">Número do WhatsApp *</label>
                  <input type="text" id="new-btn-whatsapp" class="pk-input" placeholder="5511951047970" value="5511951047970" required/>
                  <span style="font-size: 11px; color: var(--pk-text-muted); margin-top: 4px; display: block;">Com código do país + DDD.</span>
                </div>

                <div class="pk-form-group">
                  <label class="pk-label" for="new-btn-prefilled">Mensagem pré-preenchida (opcional)</label>
                  <textarea id="new-btn-prefilled" class="pk-input" rows="2" placeholder="Olá, vim pela página e gostaria de saber mais...">Olá, vim pela página e gostaria de saber mais sobre Harmonização facial</textarea>
                  <span style="font-size: 11px; color: var(--pk-text-muted); margin-top: 4px; display: block;">Texto inicial que já aparecerá digitado para o visitante no WhatsApp.</span>
                </div>

                <div class="pk-form-group">
                  <label class="pk-label" for="new-btn-cta-text">Texto do botão</label>
                  <input type="text" id="new-btn-cta-text" class="pk-input" value="Falar no WhatsApp" required/>
                </div>

                <div class="pk-form-group">
                  <label class="pk-label" for="new-btn-greeting">Saudação (balão)</label>
                  <input type="text" id="new-btn-greeting" class="pk-input" value="Confirme seus dados para iniciar a conversa" required/>
                  <span style="font-size: 11px; color: var(--pk-text-muted); margin-top: 4px; display: block;">Texto exibido no topo do balão de abertura.</span>
                </div>
              </div>
            </div>

            <!-- 3. QUALIFICAÇÃO INTELIGENTE (MODELO D) -->
            <div class="pk-card" style="padding: 20px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <h3 style="font-size: 15px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">Qualificação de Leads</h3>
                <span class="pk-badge pk-badge-purple" style="font-size: 10px;">Triagem Automática</span>
              </div>
              <p style="font-size: 12.5px; color: var(--pk-text-muted); margin: 0 0 16px 0;">Classifique a temperatura dos contatos antes de chegarem ao WhatsApp.</p>

              <div class="pk-form-group" style="margin-bottom: 12px;">
                <label class="pk-label" for="new-btn-question">Pergunta de Qualificação</label>
                <input type="text" id="new-btn-question" class="pk-input" value="Qual região você gostaria de tratar?" required/>
              </div>

              <div id="new-btn-options-list" style="display: flex; flex-direction: column; gap: 8px;">
                <div class="new-btn-option-row" style="display: grid; grid-template-columns: 1fr 130px; gap: 8px;">
                  <input type="text" class="pk-input new-opt-label" value="Harmonização Facial completa" required/>
                  <select class="pk-input new-opt-badge" style="font-size: 12px; cursor: pointer;">
                    <option value="🔥 Quente" selected>🔥 Quente (+35)</option>
                    <option value="❄️ Morno">❄️ Morno (+25)</option>
                    <option value="🧊 Frio">🧊 Frio (+15)</option>
                  </select>
                </div>
                <div class="new-btn-option-row" style="display: grid; grid-template-columns: 1fr 130px; gap: 8px;">
                  <input type="text" class="pk-input new-opt-label" value="Preenchimento labial ou queixo" required/>
                  <select class="pk-input new-opt-badge" style="font-size: 12px; cursor: pointer;">
                    <option value="🔥 Quente">🔥 Quente (+35)</option>
                    <option value="❄️ Morno" selected>❄️ Morno (+25)</option>
                    <option value="🧊 Frio">🧊 Frio (+15)</option>
                  </select>
                </div>
                <div class="new-btn-option-row" style="display: grid; grid-template-columns: 1fr 130px; gap: 8px;">
                  <input type="text" class="pk-input new-opt-label" value="Apenas pesquisando valores no momento" required/>
                  <select class="pk-input new-opt-badge" style="font-size: 12px; cursor: pointer;">
                    <option value="🔥 Quente">🔥 Quente (+35)</option>
                    <option value="❄️ Morno">❄️ Morno (+25)</option>
                    <option value="🧊 Frio" selected>🧊 Frio (+15)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 4. APARÊNCIA -->
            <div class="pk-card" style="padding: 20px;">
              <h3 style="font-size: 15px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 4px 0;">Aparência</h3>
              <p style="font-size: 12.5px; color: var(--pk-text-muted); margin: 0 0 16px 0;">Personalize a cor, o posicionamento e a visibilidade na tela.</p>

              <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Seletor de Cores -->
                <div>
                  <label class="pk-label" style="margin-bottom: 6px; display: block;">Cor</label>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="color" id="new-btn-color-picker" value="#25D366" style="width: 38px; height: 38px; border: none; border-radius: 8px; cursor: pointer; padding: 0; background: none;"/>
                    <input type="text" id="new-btn-color-hex" class="pk-input" value="#25D366" style="width: 110px; font-weight: 600; font-family: monospace; padding: 8px 12px;"/>
                    
                    <!-- Cores Rápidas -->
                    <div style="display: flex; gap: 6px;">
                      <button type="button" class="btn-color-preset" data-color="#25D366" style="width: 28px; height: 28px; border-radius: 50%; background: #25D366; border: 2px solid var(--pk-border); cursor: pointer;" title="Verde WhatsApp"></button>
                      <button type="button" class="btn-color-preset" data-color="#7C3AED" style="width: 28px; height: 28px; border-radius: 50%; background: #7C3AED; border: 2px solid var(--pk-border); cursor: pointer;" title="Violeta Pinas"></button>
                      <button type="button" class="btn-color-preset" data-color="#2563EB" style="width: 28px; height: 28px; border-radius: 50%; background: #2563EB; border: 2px solid var(--pk-border); cursor: pointer;" title="Azul Médico"></button>
                      <button type="button" class="btn-color-preset" data-color="#EC4899" style="width: 28px; height: 28px; border-radius: 50%; background: #EC4899; border: 2px solid var(--pk-border); cursor: pointer;" title="Rosa Pink Luxo"></button>
                      <button type="button" class="btn-color-preset" data-color="#18152C" style="width: 28px; height: 28px; border-radius: 50%; background: #18152C; border: 2px solid var(--pk-border); cursor: pointer;" title="Preto Elegante"></button>
                    </div>
                  </div>
                </div>

                <!-- Posição na Tela -->
                <div>
                  <label class="pk-label" style="margin-bottom: 8px; display: block;">Posição na tela</label>
                  <div style="display: flex; gap: 16px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13.5px; font-weight: 500;">
                      <input type="radio" name="new-btn-position" value="left" style="cursor: pointer;"/>
                      <span>Canto inferior esquerdo</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13.5px; font-weight: 500;">
                      <input type="radio" name="new-btn-position" value="right" checked style="cursor: pointer;"/>
                      <span>Canto inferior direito</span>
                    </label>
                  </div>
                </div>

                <!-- Botão Ativo -->
                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--pk-border); padding-top: 14px;">
                  <div>
                    <strong style="display: block; font-size: 13.5px; color: var(--pk-text-primary);">Botão ativo</strong>
                    <span style="font-size: 12px; color: var(--pk-text-muted);">Quando desativado, o botão não aparecerá para os visitantes.</span>
                  </div>
                  <input type="checkbox" id="new-btn-status" checked style="width: 20px; height: 20px; cursor: pointer;"/>
                </div>

              </div>
            </div>

            <!-- AÇÕES DO FORMULÁRIO -->
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 8px;">
              <button type="button" class="pk-btn pk-btn-outline" id="btn-cancel-new-button-bottom">Cancelar</button>
              <button type="submit" class="pk-btn pk-btn-success" id="btn-submit-new-button" style="background: #25D366; border-color: #25D366; color: #FFF; font-weight: 700; padding: 12px 24px;">
                Criar botão
              </button>
            </div>

          </div>

          <!-- COLUNA DA DIREITA: PRÉ-VISUALIZAÇÃO DO SITE E WIDGET FLUTUANTE -->
          <div style="position: sticky; top: 80px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 14px; font-weight: 800; color: var(--pk-text-primary);">Pré-visualização</span>
              <span class="pk-badge pk-badge-primary" style="font-size: 10px;">Aparece em todas as páginas do site</span>
            </div>

            <!-- Moldura do Navegador Simulado -->
            <div class="pk-browser-mockup" style="background: var(--pk-bg-surface); border: 1.5px solid var(--pk-border); border-radius: 16px; overflow: hidden; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08); height: 560px; position: relative; display: flex; flex-direction: column;">
              
              <!-- Barra do Navegador -->
              <div style="background: var(--pk-bg-subtle); border-bottom: 1px solid var(--pk-border); padding: 10px 14px; display: flex; align-items: center; gap: 10px;">
                <div style="display: flex; gap: 6px;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444; display: inline-block;"></span>
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B; display: inline-block;"></span>
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
                </div>
                <div style="background: var(--pk-bg-surface); border: 1px solid var(--pk-border); border-radius: 6px; padding: 3px 12px; font-size: 11px; color: var(--pk-text-muted); flex: 1; text-align: center; font-family: monospace;">
                  🔒 seu site.com.br
                </div>
              </div>

              <!-- Conteúdo do Site (Simulação com esqueleto) -->
              <div style="padding: 20px; flex: 1; position: relative; background: linear-gradient(180deg, var(--pk-bg-surface) 0%, var(--pk-bg-subtle) 100%); overflow: hidden;">
                <div style="width: 40%; height: 14px; background: var(--pk-border); border-radius: 4px; margin-bottom: 12px; opacity: 0.6;"></div>
                <div style="width: 70%; height: 10px; background: var(--pk-border); border-radius: 4px; margin-bottom: 8px; opacity: 0.4;"></div>
                <div style="width: 55%; height: 10px; background: var(--pk-border); border-radius: 4px; margin-bottom: 24px; opacity: 0.4;"></div>

                <div style="width: 80px; height: 26px; background: var(--pk-border); border-radius: 6px; opacity: 0.5;"></div>

                <!-- CONTAINER DO WIDGET FLUTUANTE (POSICIONADO À ESQUERDA OU DIREITA) -->
                <div id="preview-floating-container" style="position: absolute; bottom: 20px; right: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; transition: all 250ms ease;">
                  
                  <!-- Balão / Popup de Conversa Aberto -->
                  <div id="preview-floating-popup" style="width: 290px; background: var(--pk-bg-surface); border: 1px solid var(--pk-border); border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.12); padding: 14px; text-align: left; transition: all 200ms ease;">
                    
                    <!-- Topo com Avatar e Status Online -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid var(--pk-border); padding-bottom: 8px;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <div id="preview-store-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: #25D366; display: grid; place-items: center; color: #FFF; font-weight: 800; font-size: 13px;">
                          HF
                        </div>
                        <div>
                          <strong id="preview-store-name" style="display: block; font-size: 12px; color: var(--pk-text-primary);">Harmonização Facial</strong>
                          <span style="font-size: 10px; color: #10B981; font-weight: 600;">● Online</span>
                        </div>
                      </div>
                      <span id="preview-close-popup-btn" style="font-size: 12px; color: var(--pk-text-muted); cursor: pointer;" title="Fechar Balão">✕</span>
                    </div>

                    <strong style="font-size: 12px; color: var(--pk-text-primary); display: block; margin-bottom: 2px;">Antes de continuar...</strong>
                    <p id="preview-floating-greeting" style="font-size: 11px; color: var(--pk-text-secondary); margin: 0 0 10px 0; line-height: 1.35;">
                      Confirme seus dados para iniciar a conversa
                    </p>

                    <!-- Campos mockados -->
                    <input type="text" placeholder="Seu nome *" disabled style="width: 100%; box-sizing: border-box; padding: 7px 10px; font-size: 11px; margin-bottom: 6px; border: 1px solid var(--pk-border); border-radius: 6px; background: var(--pk-bg-subtle);"/>
                    <input type="text" placeholder="+55 ▾ Seu WhatsApp *" disabled style="width: 100%; box-sizing: border-box; padding: 7px 10px; font-size: 11px; margin-bottom: 10px; border: 1px solid var(--pk-border); border-radius: 6px; background: var(--pk-bg-subtle);"/>

                    <!-- Botão CTA no Balão com Ícone Oficial de WhatsApp -->
                    <button type="button" id="preview-floating-action-btn" style="width: 100%; border: none; background: #25D366; color: #FFF; font-weight: 700; font-size: 12.5px; padding: 10px 14px; border-radius: 8px; cursor: pointer; transition: all 150ms ease; display: flex; align-items: center; justify-content: center; gap: 8px;">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="#FFFFFF" style="flex-shrink: 0;">
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                      </svg>
                      <span id="preview-floating-action-text">Falar no WhatsApp</span>
                    </button>
                  </div>

                  <!-- Botão Flutuante Circular com Logo Oficial do WhatsApp (Fiel à Imagem) -->
                  <div id="preview-floating-trigger-btn" style="width: 56px; height: 56px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0, 0, 0, 0.12); cursor: pointer; position: relative; transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;" title="Falar no WhatsApp">
                    <svg width="32" height="32" viewBox="0 0 16 16" fill="#FFFFFF" style="display: block; pointer-events: none;">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                  </div>

                </div>

              </div>

              <!-- Rodapé do Mockup -->
              <div style="background: var(--pk-bg-subtle); border-top: 1px solid var(--pk-border); padding: 8px 14px; text-align: center; font-size: 11px; color: var(--pk-text-muted);">
                Aparece em todas as páginas do site.
              </div>

            </div>

          </div>

        </div>
      </form>

    </div>
  `;
}
