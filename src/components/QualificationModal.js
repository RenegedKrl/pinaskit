/* ==========================================================================
   PINAS KIT — MODAL DE QUALIFICAÇÃO DINÂMICO ("CONTE SOBRE SEU MOMENTO")
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderQualificationModal() {
  const config = StorageService.getFormConfig();

  return `
    <div class="pk-modal-overlay" id="qualification-modal-overlay">
      <div class="pk-modal" id="qualification-modal" style="border: 2px solid var(--pk-primary); max-width: 480px;">
        <!-- Botão Fechar -->
        <button class="pk-modal-close" id="btn-close-qual-modal" aria-label="Fechar">✕</button>

        <!-- Cabeçalho -->
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary); margin-bottom: 6px;">
            ${config.title}
          </h2>
          <p style="font-size: 14px; color: var(--pk-text-secondary); line-height: 1.5;">
            ${config.subtitle}
          </p>
        </div>

        <!-- Formulário -->
        <form id="qualification-form">
          <!-- Campo 1: Nome -->
          <div class="pk-form-group">
            <label class="pk-label" for="lead-name">Seu nome *</label>
            <input 
              type="text" 
              id="lead-name" 
              class="pk-input" 
              placeholder="Como podemos chamar você?" 
              required
              autocomplete="name"
            />
          </div>

          <!-- Campo 2: WhatsApp -->
          <div class="pk-form-group">
            <label class="pk-label" for="lead-phone">Seu WhatsApp *</label>
            <div style="display: flex; gap: 8px;">
              <span style="display: inline-flex; align-items: center; padding: 0 14px; background-color: var(--pk-bg-subtle); border: 1.5px solid var(--pk-border); border-radius: var(--pk-radius-md); font-size: 14px; font-weight: 600;">
                🇧🇷 +55
              </span>
              <input 
                type="tel" 
                id="lead-phone" 
                class="pk-input" 
                placeholder="(11) 99999-9999" 
                required
                autocomplete="tel"
              />
            </div>
          </div>

          <!-- Campo 3: Dropdown Customizado ("O que melhor descreve seu momento?") -->
          <div class="pk-form-group">
            <label class="pk-label" id="label-moment-question">${config.questionLabel}</label>
            <div class="pk-select-wrapper">
              <div class="pk-select-trigger" id="custom-select-trigger">
                <span id="selected-option-text">Selecione uma opção</span>
                <span style="font-size: 11px; transition: transform 200ms ease;" id="select-arrow">▼</span>
              </div>
              <div class="pk-select-menu" id="custom-select-menu">
                ${config.options.map(opt => `
                  <div class="pk-select-option" data-value="${opt.label}" data-score="${opt.score}" data-badge="${opt.badge}">
                    <span>${opt.label}</span>
                    <span class="pk-badge pk-badge-purple" style="font-size: 10px;">${opt.badge}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <input type="hidden" id="selected-moment-value" value="" required/>
          </div>

          <!-- Campo 4: Textarea de Objetivos (Opcional) -->
          <div class="pk-form-group">
            <label class="pk-label" for="lead-goals">O que você gostaria de conversar? <span style="font-size: 12px; font-weight: 400; color: var(--pk-text-muted);">(opcional)</span></label>
            <textarea 
              id="lead-goals" 
              class="pk-textarea" 
              rows="3" 
              placeholder="Conte brevemente sobre seus objetivos..."
            ></textarea>
          </div>

          <!-- Botão de Ação -->
          <button type="submit" class="pk-btn pk-btn-primary pk-btn-lg" style="width: 100%; margin-top: 8px;" id="btn-submit-qualification">
            ${config.buttonText}
          </button>
        </form>

        <p style="font-size: 12px; text-align: center; color: var(--pk-text-muted); margin-top: 16px;">
          🔒 Seus dados são protegidos por criptografia e usados apenas para início da conversa.
        </p>
      </div>
    </div>
  `;
}
