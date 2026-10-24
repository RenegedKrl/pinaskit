/* ==========================================================================
   PINAS KIT — MÓDULO DE REGRAS DE PONTUAÇÃO DE LEADS (LEAD SCORING ENGINE)
   Inspirado na arquitetura do CentralKit (/painel/leads/regras-pontuacao)
   ========================================================================== */

import { StorageService } from '../services/storage.js';

export function renderLeadScoringView() {
  const rules = StorageService.getScoringRules();
  const coldMax = rules.thresholds?.coldMax || 30;
  const warmMax = rules.thresholds?.warmMax || 70;

  return `
    <div class="pk-lead-scoring-view" id="lead-scoring-container" style="max-width: 1040px; margin: 0 auto;">
      
      <!-- BOTÃO VOLTAR & CABEÇALHO -->
      <div style="margin-bottom: 24px;">
        <button type="button" class="pk-btn pk-btn-ghost pk-btn-sm" id="btn-back-to-leads" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; margin-bottom: 12px; font-weight: 600; color: var(--pk-primary); cursor: pointer;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          <span>Voltar para Leads</span>
        </button>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
              Regras de Pontuação de Leads
            </h1>
            <p style="font-size: 13.5px; color: var(--pk-text-secondary); margin-top: 4px;">
              Defina os critérios e pontuações para classificar seus leads automaticamente entre Quente, Morno e Frio.
            </p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="button" class="pk-btn pk-btn-outline pk-btn-sm" id="btn-reset-scoring-rules">
              Restaurar padrões
            </button>
            <button type="button" class="pk-btn pk-btn-primary pk-btn-sm" id="btn-save-scoring-rules" style="box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">
              💾 Salvar regras de pontuação
            </button>
          </div>
        </div>
      </div>

      <!-- GRID DE CARDS DE CONFIGURAÇÃO -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        
        <!-- CARD 1: FAIXAS DE TEMPERATURA & THRESHOLDS -->
        <div class="pk-card" style="padding: 24px; border-radius: var(--pk-radius-xl); box-shadow: var(--pk-shadow-sm);">
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: 700; color: var(--pk-text-primary); margin: 0;">
              1. Faixas de Classificação por Pontos (Temperatura)
            </h2>
            <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 4px;">
              Ajuste as réguas de corte que definem o nível de prontidão do lead para fechar negócio com você.
            </p>
          </div>

          <!-- SLIDERS INTERATIVOS -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 24px;">
            
            <!-- Faixa Frio -->
            <div style="padding: 18px; border-radius: 12px; border: 1.5px solid var(--pk-border); background: var(--pk-bg-subtle);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="pk-badge pk-badge-blue" style="font-size: 12px; font-weight: 700;">
                  🧊 Frio (Curioso)
                </span>
                <span style="font-size: 14px; font-weight: 800; color: var(--pk-text-primary);" id="label-cold-range">
                  0 até ${coldMax} pts
                </span>
              </div>
              <p style="font-size: 12px; color: var(--pk-text-muted); margin-bottom: 14px; line-height: 1.4;">
                Visitante que acessou poucas páginas, sem urgência imediata. Ideal para receber conteúdo educativo.
              </p>
              <input 
                type="range" 
                id="slider-cold-max" 
                min="10" 
                max="50" 
                step="5" 
                value="${coldMax}" 
                style="width: 100%; cursor: pointer; accent-color: #3B82F6;"
              />
            </div>

            <!-- Faixa Morno -->
            <div style="padding: 18px; border-radius: 12px; border: 1.5px solid var(--pk-border); background: var(--pk-bg-subtle);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="pk-badge pk-badge-amber" style="font-size: 12px; font-weight: 700;">
                  ❄️ Morno (Engajado)
                </span>
                <span style="font-size: 14px; font-weight: 800; color: var(--pk-text-primary);" id="label-warm-range">
                  ${coldMax + 1} até ${warmMax} pts
                </span>
              </div>
              <p style="font-size: 12px; color: var(--pk-text-muted); margin-bottom: 14px; line-height: 1.4;">
                Visitante que navegou várias vezes, comparou opções e busca entender condições e parcelamento.
              </p>
              <input 
                type="range" 
                id="slider-warm-max" 
                min="40" 
                max="90" 
                step="5" 
                value="${warmMax}" 
                style="width: 100%; cursor: pointer; accent-color: #F59E0B;"
              />
            </div>

            <!-- Faixa Quente -->
            <div style="padding: 18px; border-radius: 12px; border: 1.5px solid var(--pk-primary); background: rgba(124, 58, 237, 0.04);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="pk-badge pk-badge-ruby" style="font-size: 12px; font-weight: 700;">
                  🔥 Quente (Pronto para Fechar)
                </span>
                <span style="font-size: 14px; font-weight: 800; color: var(--pk-primary);" id="label-hot-range">
                  Acima de ${warmMax} pts
                </span>
              </div>
              <p style="font-size: 12px; color: var(--pk-text-muted); margin-bottom: 14px; line-height: 1.4;">
                Lead de alta conversão. Veio de anúncio pago, respondeu opções decisivas e exige contato comercial rápido.
              </p>
              <div style="font-size: 12px; font-weight: 600; color: var(--pk-primary); padding-top: 6px;">
                ⚡ Prioridade máxima no atendimento no WhatsApp
              </div>
            </div>

          </div>

          <!-- SIMULAÇÃO AO VIVO DE PERSONAS (CENTRALKIT STYLE) -->
          <div style="border-top: 1px solid var(--pk-border); padding-top: 18px;">
            <div style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-secondary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
              Exemplo de Personas Simuladas com a Regra Atual:
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
              
              <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; background: var(--pk-bg-subtle); border: 1px solid var(--pk-border);">
                <span style="font-size: 24px;">👤</span>
                <div style="flex: 1;">
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-primary);">Curioso</div>
                  <div style="font-size: 11.5px; color: var(--pk-text-muted);">1 visita, 1 página, sem e-mail</div>
                </div>
                <span class="pk-badge pk-badge-blue" id="sim-persona-cold" style="font-size: 11px;">15 pts · Frio</span>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; background: var(--pk-bg-subtle); border: 1px solid var(--pk-border);">
                <span style="font-size: 24px;">🎯</span>
                <div style="flex: 1;">
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-primary);">Engajado</div>
                  <div style="font-size: 11.5px; color: var(--pk-text-muted);">3 visitas, 5 páginas, com e-mail</div>
                </div>
                <span class="pk-badge pk-badge-amber" id="sim-persona-warm" style="font-size: 11px;">50 pts · Morno</span>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; background: rgba(124, 58, 237, 0.05); border: 1px solid rgba(124, 58, 237, 0.2);">
                <span style="font-size: 24px;">🔥</span>
                <div style="flex: 1;">
                  <div style="font-size: 12.5px; font-weight: 700; color: var(--pk-text-primary);">Pronto para Compra</div>
                  <div style="font-size: 11.5px; color: var(--pk-text-muted);">Veio de anúncio Meta, alta urgência</div>
                </div>
                <span class="pk-badge pk-badge-ruby" id="sim-persona-hot" style="font-size: 11px;">85 pts · Quente</span>
              </div>

            </div>
          </div>
        </div>

        <!-- CARD 2: PONTUAÇÃO DE NAVEGAÇÃO & COMPORTAMENTO DO VISITANTE -->
        <div class="pk-card" style="padding: 24px; border-radius: var(--pk-radius-xl); box-shadow: var(--pk-shadow-sm);">
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: 700; color: var(--pk-text-primary); margin: 0;">
              2. Comportamento e Telemetria no Site
            </h2>
            <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 4px;">
              Pontos somados silenciosamente pelo script embed conforme o visitante navega no seu site.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
            
            <div style="padding: 16px; border: 1px solid var(--pk-border); border-radius: 10px; background: var(--pk-bg-subtle);">
              <label style="font-size: 12px; font-weight: 600; color: var(--pk-text-secondary); display: block; margin-bottom: 8px;">
                Pontos por página navegada
              </label>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="input-page-points" class="pk-input" value="${rules.pageViewPoints || 5}" min="1" max="25" style="width: 80px; font-weight: 700;" />
                <span style="font-size: 13px; color: var(--pk-text-muted);">pts / página</span>
              </div>
            </div>

            <div style="padding: 16px; border: 1px solid var(--pk-border); border-radius: 10px; background: var(--pk-bg-subtle);">
              <label style="font-size: 12px; font-weight: 600; color: var(--pk-text-secondary); display: block; margin-bottom: 8px;">
                Pontos por retorno / nova sessão
              </label>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="input-session-points" class="pk-input" value="${rules.repeatVisitPoints || 15}" min="5" max="50" style="width: 80px; font-weight: 700;" />
                <span style="font-size: 13px; color: var(--pk-text-muted);">pts / visita</span>
              </div>
            </div>

            <div style="padding: 16px; border: 1px solid var(--pk-border); border-radius: 10px; background: var(--pk-bg-subtle);">
              <label style="font-size: 12px; font-weight: 600; color: var(--pk-text-secondary); display: block; margin-bottom: 8px;">
                Bônus de Anúncio Pago (Meta / Google)
              </label>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="input-ad-bonus" class="pk-input" value="${rules.paidAdBonus || 25}" min="0" max="60" style="width: 80px; font-weight: 700;" />
                <span style="font-size: 13px; color: var(--pk-text-muted);">pts bônus</span>
              </div>
            </div>

            <div style="padding: 16px; border: 1px solid var(--pk-border); border-radius: 10px; background: var(--pk-bg-subtle);">
              <label style="font-size: 12px; font-weight: 600; color: var(--pk-text-secondary); display: block; margin-bottom: 8px;">
                Bônus se informou E-mail
              </label>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="input-email-bonus" class="pk-input" value="${rules.emailBonus || 20}" min="0" max="40" style="width: 80px; font-weight: 700;" />
                <span style="font-size: 13px; color: var(--pk-text-muted);">pts bônus</span>
              </div>
            </div>

          </div>
        </div>

        <!-- CARD 3: PONTOS POR RESPOSTA DO FORMULÁRIO -->
        <div class="pk-card" style="padding: 24px; border-radius: var(--pk-radius-xl); box-shadow: var(--pk-shadow-sm);">
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: 700; color: var(--pk-text-primary); margin: 0;">
              3. Peso das Respostas de Qualificação
            </h2>
            <p style="font-size: 13px; color: var(--pk-text-secondary); margin-top: 4px;">
              Pontos concedidos dependendo do nível de interesse escolhido pelo visitante ao preencher a aplicação.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-radius: 10px; border: 1px solid var(--pk-border); background: var(--pk-bg-subtle);">
              <div>
                <span class="pk-badge pk-badge-ruby" style="font-size: 11px;">Alta Intenção</span>
                <p style="font-size: 12px; color: var(--pk-text-muted); margin-top: 4px;">Ex: "Quero iniciar imediatamente"</p>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="number" id="input-form-hot" class="pk-input" value="${rules.formHotScore || 35}" min="10" max="80" style="width: 70px; font-weight: 700;" />
                <span style="font-size: 12px; color: var(--pk-text-muted);">pts</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-radius: 10px; border: 1px solid var(--pk-border); background: var(--pk-bg-subtle);">
              <div>
                <span class="pk-badge pk-badge-amber" style="font-size: 11px;">Intenção Moderada</span>
                <p style="font-size: 12px; color: var(--pk-text-muted); margin-top: 4px;">Ex: "Entender valores e parcelamento"</p>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="number" id="input-form-warm" class="pk-input" value="${rules.formWarmScore || 25}" min="5" max="60" style="width: 70px; font-weight: 700;" />
                <span style="font-size: 12px; color: var(--pk-text-muted);">pts</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-radius: 10px; border: 1px solid var(--pk-border); background: var(--pk-bg-subtle);">
              <div>
                <span class="pk-badge pk-badge-blue" style="font-size: 11px;">Curiosidade / Longo Prazo</span>
                <p style="font-size: 12px; color: var(--pk-text-muted); margin-top: 4px;">Ex: "Apenas pesquisando / próximos meses"</p>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="number" id="input-form-cold" class="pk-input" value="${rules.formColdScore || 15}" min="0" max="40" style="width: 70px; font-weight: 700;" />
                <span style="font-size: 12px; color: var(--pk-text-muted);">pts</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;
}
