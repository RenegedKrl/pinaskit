/* ==========================================================================
   PINAS KIT — CONSTRUTOR NO-CODE DE FORMULÁRIO COM LIVE PREVIEW EM TEMPO REAL
   (MODELO D: ASSISTIDO, DIDÁTICO E ULTRA-INTUITIVO)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderFormBuilderModal(button = null) {
  const config = (button && button.formConfig) 
    ? button.formConfig 
    : StorageService.getFormConfig();

  const title = config.title || 'Conte sobre seu momento.';
  const subtitle = config.subtitle || 'Preencha os campos para receber uma avaliação personalizada.';
  const questionLabel = config.questionLabel || 'O que melhor descreve seu momento?';
  const buttonText = config.buttonText || 'Preparar minha mensagem →';
  const template = config.whatsappTemplate || 'Olá! Meu nome é {nome}. Momento: {momento}. Detalhes: {mensagem}';
  const options = (config.options && config.options.length > 0) ? config.options : [
    { id: '1', label: 'Quero agendar uma consulta para esta semana', score: 35, badge: '🔥 Quente' },
    { id: '2', label: 'Gostaria de entender valores e parcelamento', score: 25, badge: '❄️ Morno' },
    { id: '3', label: 'Tenho interesse para os próximos meses', score: 15, badge: '🧊 Frio' }
  ];

  return `
    <div class="pk-modal-overlay" id="form-builder-modal-overlay">
      <div class="pk-modal" id="form-builder-modal" style="max-width: 1060px; width: 95vw; padding: 24px;">
        
        <!-- CABEÇALHO DO CONSTRUTOR -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 1px solid var(--pk-border); padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="pk-badge pk-badge-purple" style="font-size: 11px; font-weight: 700;">🛠️ Construtor Visual No-Code</span>
              ${button ? `<span class="pk-badge pk-badge-primary" style="font-size: 11px;">Botão: ${button.name}</span>` : ''}
            </div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
              ${button ? `Personalizar: ${button.name}` : 'Personalizar Perguntas e Opções do Formulário'}
            </h2>
            <p style="font-size: 13.5px; color: var(--pk-text-secondary); margin: 4px 0 0 0;">
              Altere os textos à esquerda e veja a pré-visualização ao vivo exatamente como seu cliente verá no site.
            </p>
          </div>

          <button class="pk-modal-close" id="btn-close-builder-modal" title="Fechar Construtor" style="position: static; width: 34px; height: 34px;">
            ✕
          </button>
        </div>

        <form id="form-builder-form">
          <div class="pk-builder-grid">
            
            <!-- COLUNA DA ESQUERDA: EDITOR DE CAMPOS E REGRAS -->
            <div class="pk-builder-editor">
              
              <!-- 1. Textos Principais do Cabeçalho -->
              <div class="pk-builder-section-box">
                <div class="pk-builder-section-title">
                  <span>1. Textos do Formulário</span>
                  <span style="font-size: 11px; color: var(--pk-text-muted); text-transform: none; font-weight: normal;">Visível no topo do modal</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div>
                    <label class="pk-label" for="builder-title" style="font-size: 13px; margin-bottom: 4px; display: block;">Título do Formulário *</label>
                    <input type="text" id="builder-title" class="pk-input" value="${title}" placeholder="Ex: Conte sobre seu momento." required style="font-size: 13.5px; padding: 10px 14px;"/>
                  </div>

                  <div>
                    <label class="pk-label" for="builder-subtitle" style="font-size: 13px; margin-bottom: 4px; display: block;">Subtítulo Explicativo</label>
                    <input type="text" id="builder-subtitle" class="pk-input" value="${subtitle}" placeholder="Ex: Preencha os campos para receber uma avaliação personalizada." style="font-size: 13px; padding: 10px 14px;"/>
                  </div>
                </div>
              </div>

              <!-- 2. Pergunta Central & Opções Dinâmicas com Pontuação -->
              <div class="pk-builder-section-box">
                <div class="pk-builder-section-title">
                  <span>2. Pergunta de Qualificação & Opções</span>
                  <button type="button" class="pk-btn pk-btn-secondary pk-btn-xs" id="btn-add-builder-option" style="font-size: 11.5px; padding: 4px 10px;">
                    + Adicionar Nova Opção
                  </button>
                </div>

                <div style="margin-bottom: 14px;">
                  <label class="pk-label" for="builder-question" style="font-size: 13px; margin-bottom: 4px; display: block;">Pergunta Central do Seletor *</label>
                  <input type="text" id="builder-question" class="pk-input" value="${questionLabel}" placeholder="Ex: O que melhor descreve seu momento?" required style="font-size: 13.5px; padding: 10px 14px; font-weight: 600;"/>
                </div>

                <label class="pk-label" style="font-size: 12.5px; margin-bottom: 6px; display: block; color: var(--pk-text-secondary);">
                  Opções de Resposta & Temperatura de Lead:
                </label>

                <div id="builder-options-list" style="display: flex; flex-direction: column; gap: 8px;">
                  ${options.map((opt, index) => `
                    <div class="builder-option-row" data-index="${index}" style="background: var(--pk-bg-card); border: 1px solid var(--pk-border); border-radius: 8px; padding: 8px 12px; display: grid; grid-template-columns: 24px 1fr 140px 32px; align-items: center; gap: 8px;">
                      <span style="font-size: 13px; font-weight: 800; color: var(--pk-primary); text-align: center;">${index + 1}.</span>
                      <input type="text" class="pk-input builder-opt-label" value="${opt.label}" placeholder="Descreva a opção..." style="padding: 7px 10px; font-size: 13px;" required/>
                      <select class="pk-input builder-opt-badge" style="padding: 7px 8px; font-size: 12px; cursor: pointer;">
                        <option value="🔥 Quente" ${opt.badge && opt.badge.includes('Quente') ? 'selected' : ''}>🔥 Quente (+30)</option>
                        <option value="❄️ Morno" ${opt.badge && opt.badge.includes('Morno') ? 'selected' : ''}>❄️ Morno (+20)</option>
                        <option value="🧊 Frio" ${opt.badge && opt.badge.includes('Frio') ? 'selected' : ''}>🧊 Frio (+10)</option>
                      </select>
                      <button type="button" class="pk-btn-remove-opt" data-index="${index}" style="background: none; border: none; color: var(--pk-danger); font-size: 16px; cursor: pointer; padding: 4px; text-align: center;" title="Remover Opção">
                        🗑️
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- 3. Integração com WhatsApp & Template -->
              <div class="pk-builder-section-box">
                <div class="pk-builder-section-title">
                  <span>3. Conversão & Mensagem no WhatsApp</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div>
                    <label class="pk-label" for="builder-btn-text" style="font-size: 13px; margin-bottom: 4px; display: block;">Texto do Botão de Envio (CTA) *</label>
                    <input type="text" id="builder-btn-text" class="pk-input" value="${buttonText}" placeholder="Ex: Preparar minha mensagem →" required style="font-size: 13.5px; padding: 10px 14px;"/>
                  </div>

                  <div>
                    <label class="pk-label" for="builder-template" style="font-size: 13px; margin-bottom: 4px; display: block;">Template da Mensagem Pronta do WhatsApp</label>
                    <textarea id="builder-template" class="pk-input" rows="2" style="font-size: 13px; padding: 10px 12px; resize: vertical;">${template}</textarea>
                    
                    <div style="margin-top: 6px;">
                      <span style="font-size: 11px; color: var(--pk-text-muted); display: block; margin-bottom: 4px;">Clique em uma tag para inserir no template:</span>
                      <span class="pk-builder-tag-chip" data-tag="{nome}">+ {nome}</span>
                      <span class="pk-builder-tag-chip" data-tag="{momento}">+ {momento}</span>
                      <span class="pk-builder-tag-chip" data-tag="{mensagem}">+ {mensagem}</span>
                      <span class="pk-builder-tag-chip" data-tag="{telefone}">+ {telefone}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- COLUNA DA DIREITA: PRÉ-VISUALIZAÇÃO AO VIVO (PHONE MOCKUP) -->
            <div class="pk-builder-preview-wrapper">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <span class="pk-badge pk-badge-primary" style="font-size: 11px; font-weight: 700;">
                  👁️ Pré-visualização ao Vivo
                </span>
                <span style="font-size: 11px; color: var(--pk-text-muted);">
                  Atualiza em tempo real
                </span>
              </div>

              <!-- Moldura do Celular -->
              <div class="pk-builder-phone-notch"></div>
              
              <div class="pk-builder-phone-screen">
                <!-- Cabeçalho do preview -->
                <div style="margin-bottom: 16px; text-align: left;">
                  <h3 id="preview-form-title" style="font-size: 18px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 4px 0;">
                    ${title}
                  </h3>
                  <p id="preview-form-subtitle" style="font-size: 12px; color: var(--pk-text-secondary); margin: 0; line-height: 1.4;">
                    ${subtitle}
                  </p>
                </div>

                <!-- Campos mockados de contato -->
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
                  <div>
                    <label style="font-size: 11px; font-weight: 600; color: var(--pk-text-primary); display: block; margin-bottom: 3px;">Seu Nome *</label>
                    <input type="text" class="pk-input" value="Mariana Silva" disabled style="padding: 8px 12px; font-size: 12px; opacity: 0.85; background: var(--pk-bg-subtle);"/>
                  </div>
                  <div>
                    <label style="font-size: 11px; font-weight: 600; color: var(--pk-text-primary); display: block; margin-bottom: 3px;">Seu WhatsApp *</label>
                    <input type="text" class="pk-input" value="(11) 98765-4321" disabled style="padding: 8px 12px; font-size: 12px; opacity: 0.85; background: var(--pk-bg-subtle);"/>
                  </div>
                </div>

                <!-- Pergunta e Opções Interativas no Preview -->
                <div style="margin-bottom: 14px;">
                  <label id="preview-question-label" style="font-size: 12px; font-weight: 700; color: var(--pk-primary); display: block; margin-bottom: 8px;">
                    ${questionLabel}
                  </label>

                  <div id="preview-options-container" style="display: flex; flex-direction: column; gap: 6px;">
                    ${options.map((opt, idx) => `
                      <div class="pk-preview-option-item ${idx === 0 ? 'is-selected' : ''}" data-preview-index="${idx}" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding: 9px 12px; border: 1.5px solid ${idx === 0 ? 'var(--pk-primary)' : 'var(--pk-border)'}; border-radius: 8px; background: ${idx === 0 ? 'rgba(124,58,237,0.06)' : 'var(--pk-bg-subtle)'};">
                        <div style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${idx === 0 ? 'var(--pk-primary)' : 'var(--pk-border)'}; display: grid; place-items: center; flex-shrink: 0;">
                          ${idx === 0 ? '<div style="width: 6px; height: 6px; border-radius: 50%; background: var(--pk-primary);"></div>' : ''}
                        </div>
                        <span class="preview-opt-text" style="font-size: 12px; font-weight: 600; color: var(--pk-text-primary); flex: 1;">
                          ${opt.label}
                        </span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Botão CTA no Preview -->
                <button type="button" id="preview-cta-btn" class="pk-btn pk-btn-whatsapp" style="width: 100%; justify-content: center; font-size: 13px; padding: 11px 16px; border-radius: 10px; font-weight: 700;">
                  💬 ${buttonText}
                </button>

                <div style="margin-top: 10px; text-align: center; font-size: 10px; color: var(--pk-text-muted);">
                  🔒 Protegido com criptografia e anti-bot invisível
                </div>
              </div>

            </div>

          </div>

          <!-- RODAPÉ DE AÇÕES -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--pk-border); padding-top: 18px; margin-top: 20px;">
            <button type="button" class="pk-btn pk-btn-ghost pk-btn-sm" id="btn-reset-builder-defaults" style="font-size: 12.5px;">
              ↺ Restaurar Textos Padrão
            </button>

            <div style="display: flex; gap: 10px;">
              <button type="button" class="pk-btn pk-btn-outline pk-btn-sm" id="btn-cancel-builder">
                Cancelar
              </button>
              <button type="submit" class="pk-btn pk-btn-primary pk-btn-sm" id="btn-save-builder">
                Salvar e Publicar Formulário →
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  `;
}
