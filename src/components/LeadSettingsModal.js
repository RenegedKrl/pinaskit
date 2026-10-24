/* ==========================================================================
   PINAS KIT — MODAL DE CONFIGURAÇÕES & AUTOMAÇÃO DE LEADS (/painel/leads/configuracoes)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderLeadSettingsModal() {
  const settings = StorageService.getLeadAutomationSettings();

  return `
    <div class="pk-modal-overlay" id="lead-settings-modal-overlay">
      <div class="pk-modal" id="lead-settings-modal" style="max-width: 520px; width: 90%;">
        
        <!-- Cabeçalho do Modal -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--pk-border); padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <h3 style="font-size: 18px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
              ⚙️ Configurações & Automações de Leads
            </h3>
            <p style="font-size: 12.5px; color: var(--pk-text-secondary); margin-top: 3px;">
              Controle a sincronização automática entre os novos contatos e o CRM.
            </p>
          </div>
          <button type="button" class="pk-modal-close" id="btn-close-lead-settings" style="cursor: pointer; font-size: 18px; background: none; border: none; color: var(--pk-text-muted);">
            ✕
          </button>
        </div>

        <!-- Conteúdo do Formulário -->
        <form id="lead-settings-form" style="display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Switch 1: Criar Negócio Automaticamente no CRM -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 14px; border: 1px solid var(--pk-border); border-radius: 10px; background: var(--pk-bg-subtle);">
            <div>
              <label for="setting-auto-deal" style="font-size: 13.5px; font-weight: 700; color: var(--pk-text-primary); cursor: pointer; display: block;">
                Criar negócio automático no funil
              </label>
              <p style="font-size: 12px; color: var(--pk-text-muted); margin-top: 3px; line-height: 1.4;">
                Ao capturar uma aplicação, um card de negócio é adicionado automaticamente ao seu Kanban de vendas.
              </p>
            </div>
            <input 
              type="checkbox" 
              id="setting-auto-deal" 
              style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--pk-primary);" 
              ${settings.autoCreateDeal ? 'checked' : ''} 
            />
          </div>

          <!-- Estágio Padrão no Funil -->
          <div>
            <label style="font-size: 13px; font-weight: 600; color: var(--pk-text-primary); display: block; margin-bottom: 6px;">
              Estágio inicial do lead no CRM
            </label>
            <select class="pk-input" id="setting-initial-stage" style="width: 100%; cursor: pointer;">
              <option value="Novo" ${settings.initialCrmStage === 'Novo' ? 'selected' : ''}>Novo (Caixa de Entrada)</option>
              <option value="Qualificação" ${settings.initialCrmStage === 'Qualificação' ? 'selected' : ''}>Qualificação de Perfil</option>
              <option value="Em conversa" ${settings.initialCrmStage === 'Em conversa' ? 'selected' : ''}>Em conversa no WhatsApp</option>
              <option value="Proposta" ${settings.initialCrmStage === 'Proposta' ? 'selected' : ''}>Apresentação de Proposta / Valores</option>
            </select>
          </div>

          <!-- Switch 2: Alerta de Lead Quente -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 14px; border: 1px solid var(--pk-border); border-radius: 10px; background: var(--pk-bg-subtle);">
            <div>
              <label for="setting-notify-hot" style="font-size: 13.5px; font-weight: 700; color: var(--pk-text-primary); cursor: pointer; display: block;">
                Alerta de Lead Quente (Prioridade Máxima)
              </label>
              <p style="font-size: 12px; color: var(--pk-text-muted); margin-top: 3px; line-height: 1.4;">
                Destaque sonoro e visual imediato no painel quando um lead atingir a pontuação de compra (+70 pts).
              </p>
            </div>
            <input 
              type="checkbox" 
              id="setting-notify-hot" 
              style="width: 20px; height: 20px; cursor: pointer; accent-color: #EF4444;" 
              ${settings.notifyOnHotLead ? 'checked' : ''} 
            />
          </div>

          <!-- Rodapé de Ações -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; border-top: 1px solid var(--pk-border); padding-top: 16px;">
            <button type="button" class="pk-btn pk-btn-outline" id="btn-cancel-lead-settings">
              Cancelar
            </button>
            <button type="submit" class="pk-btn pk-btn-primary" id="btn-save-lead-settings" style="box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">
              Salvar configurações
            </button>
          </div>

        </form>
      </div>
    </div>
  `;
}
