/* ==========================================================================
   PINAS KIT — CONSTRUTOR NO-CODE DE FORMULÁRIO & OPÇÕES DINÂMICAS
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderFormBuilderModal() {
  const config = StorageService.getFormConfig();

  return `
    <div class="pk-modal-overlay" id="form-builder-modal-overlay">
      <div class="pk-modal" id="form-builder-modal" style="max-width: 620px;">
        <button class="pk-modal-close" id="btn-close-builder-modal" aria-label="Fechar">✕</button>

        <div style="margin-bottom: 24px;">
          <span class="pk-badge pk-badge-purple" style="margin-bottom: 6px;">🛠️ Construtor Visual No-Code</span>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--pk-text-primary);">Personalizar Perguntas e Opções</h2>
          <p style="font-size: 14px; color: var(--pk-text-secondary); margin-top: 2px;">
            Personalize exatamente as frases que aparecem para quem visita seu site.
          </p>
        </div>

        <form id="form-builder-form">
          <!-- Pergunta Principal -->
          <div class="pk-form-group">
            <label class="pk-label" for="builder-question">Pergunta do Seletor *</label>
            <input 
              type="text" 
              id="builder-question" 
              class="pk-input" 
              value="${config.questionLabel}" 
              required
            />
          </div>

          <!-- Lista de Opções Dinâmicas -->
          <div class="pk-form-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label class="pk-label">Opções do Menu Suspenso</label>
              <button type="button" class="pk-btn pk-btn-secondary pk-btn-sm" id="btn-add-builder-option">
                + Adicionar Nova Opção
              </button>
            </div>

            <div id="builder-options-list" style="display: flex; flex-direction: column; gap: 8px;">
              ${config.options.map((opt, index) => `
                <div class="pk-card builder-option-row" data-index="${index}" style="padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                  <span style="font-size: 14px; font-weight: 700; color: var(--pk-primary);">${index + 1}.</span>
                  <input type="text" class="pk-input builder-opt-label" value="${opt.label}" style="padding: 8px 12px; font-size: 13px;" required/>
                  <select class="pk-input builder-opt-badge" style="width: 130px; padding: 8px; font-size: 13px;">
                    <option value="🔥 Quente" ${opt.badge.includes('Quente') ? 'selected' : ''}>🔥 Quente (+30)</option>
                    <option value="❄️ Morno" ${opt.badge.includes('Morno') ? 'selected' : ''}>❄️ Morno (+20)</option>
                    <option value="🧊 Frio" ${opt.badge.includes('Frio') ? 'selected' : ''}>🧊 Frio (+10)</option>
                  </select>
                  <button type="button" class="pk-btn-remove-opt" data-index="${index}" style="color: var(--pk-danger); font-size: 16px; cursor: pointer; padding: 4px;" title="Remover Opção">
                    🗑️
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Mensagem Formatada para WhatsApp -->
          <div class="pk-form-group">
            <label class="pk-label" for="builder-template">Template da Mensagem no WhatsApp</label>
            <textarea id="builder-template" class="pk-textarea" rows="2" style="font-size: 13px;">${config.whatsappTemplate}</textarea>
            <p style="font-size: 11px; color: var(--pk-text-muted); margin-top: 4px;">
              Tags disponíveis: <code>{nome}</code>, <code>{momento}</code>, <code>{mensagem}</code>
            </p>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
            <button type="button" class="pk-btn pk-btn-outline pk-btn-sm" id="btn-cancel-builder">Cancelar</button>
            <button type="submit" class="pk-btn pk-btn-primary pk-btn-sm" id="btn-save-builder">Salvar e Atualizar Formulário →</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
