/* ==========================================================================
   PINAS KIT — TELA DE NOVO BOTÃO & FORMULÁRIO DE CAPTAÇÃO
   (MODELO D: ASSISTIDO, DIDÁTICO E INTEGRADO - CENTRALKIT V7.0)
   Configura tanto o Botão Flutuante de WhatsApp quanto o Formulário de Qualificação na Página
   ========================================================================== */

const WHATSAPP_SVG_PATH = `M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232`;

export function renderNewButtonView(button = null) {
  const isEditing = Boolean(button);
  const name = button ? button.name : 'Harmonização Facial';
  const siteUrl = button ? (button.siteUrl || '') : 'https://brunamentoriadecarreira.vercel.app';
  const whatsapp = button ? (button.whatsappNumber || '') : '5511951047970';
  const color = (button && button.style && button.style.color) ? button.style.color : '#25D366';
  const position = (button && button.style && button.style.position) ? button.style.position : 'right';
  const greeting = (button && button.style && button.style.greeting) ? button.style.greeting : 'Confirme seus dados para iniciar a conversa';
  const floatCta = (button && button.style && button.style.ctaText) ? button.style.ctaText : 'Falar no WhatsApp';

  // Configurações do formulário no final da página
  const formCfg = (button && button.formConfig) ? button.formConfig : {};
  const formTitle = formCfg.title || 'Conte sobre seu momento.';
  const formSubtitle = formCfg.subtitle || 'Preencha os campos para receber uma avaliação personalizada.';
  const formQuestion = formCfg.questionLabel || 'Qual região você gostaria de tratar?';
  const formCta = formCfg.buttonText || 'Preparar minha mensagem →';
  const formTemplate = formCfg.whatsappTemplate || 'Olá! Meu nome é {nome}. Momento: {momento}. Detalhes: {mensagem}';

  const defaultOptions = [
    { id: '1', label: 'Harmonização Facial completa', score: 35, badge: '🔥 Quente' },
    { id: '2', label: 'Preenchimento labial ou queixo', score: 25, badge: '❄️ Morno' },
    { id: '3', label: 'Apenas pesquisando valores no momento', score: 15, badge: '🧊 Frio' }
  ];
  const options = (formCfg.options && formCfg.options.length > 0) ? formCfg.options : defaultOptions;

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
            <div style="display: flex; align-items: center; gap: 8px;">
              <h1 style="font-size: 22px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">
                ${isEditing ? `Editar: ${name}` : 'Novo Botão de WhatsApp & Formulário de Captação'}
              </h1>
              <span class="pk-badge pk-badge-purple" style="font-size: 11px; font-weight: 700;">CentralKit v7.0</span>
            </div>
            <span style="font-size: 12.5px; color: var(--pk-text-muted);">
              Configure o Botão Flutuante de WhatsApp e o Formulário de Qualificação que serão inseridos no seu site.
            </span>
          </div>
        </div>
      </div>

      <form id="new-button-form" data-edit-id="${button ? button.id : ''}">
        <div class="pk-new-button-grid" style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 28px; align-items: start;">
          
          <!-- COLUNA DA ESQUERDA: FORMULÁRIO COMPLETO -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <!-- 1. IDENTIFICAÇÃO E NÚMERO DE WHATSAPP -->
            <div class="pk-card" style="padding: 22px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <h3 style="font-size: 15px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">1. Identificação & WhatsApp</h3>
                <span class="pk-badge pk-badge-primary" style="font-size: 10px;">Geral</span>
              </div>
              <p style="font-size: 12.5px; color: var(--pk-text-muted); margin: 0 0 16px 0;">Nome interno, site exclusivo onde o botão vai funcionar e número do WhatsApp.</p>

              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div class="pk-form-group">
                  <label class="pk-label" for="new-btn-name">Nome interno do botão / procedimento *</label>
                  <input type="text" id="new-btn-name" class="pk-input" placeholder="Ex: Harmonização Facial ou Glúteo Feminino" value="${name}" required/>
                </div>

                <div class="pk-form-group">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                    <label class="pk-label" for="new-btn-site-url" style="margin: 0;">Link ou Domínio do Site (Exclusivo deste botão) *</label>
                    <span class="pk-badge pk-badge-purple" style="font-size: 10px;">Exclusividade por Domínio</span>
                  </div>
                  <div style="position: relative; display: flex; align-items: center;">
                    <span style="position: absolute; left: 12px; font-size: 14px; opacity: 0.6; pointer-events: none;">🌐</span>
                    <input 
                      type="text" 
                      id="new-btn-site-url" 
                      class="pk-input" 
                      placeholder="Ex: https://brunamentoriadecarreira.vercel.app ou brunamentoriadecarreira.vercel.app" 
                      value="${siteUrl}" 
                      style="padding-left: 36px; font-family: monospace; font-size: 12.5px;"
                      required
                    />
                  </div>
                  <span style="font-size: 11px; color: var(--pk-text-muted); margin-top: 4px; display: block; line-height: 1.4;">
                    🔒 O botão flutuante e o formulário funcionarão apenas neste endereço, evitando conflitos caso você gerencie múltiplos sites.
                  </span>
                </div>

                <div class="pk-form-group">
                  <label class="pk-label" for="new-btn-whatsapp">Número do WhatsApp de destino *</label>
                  <input type="text" id="new-btn-whatsapp" class="pk-input" placeholder="5511951047970" value="${whatsapp}" required/>
                  <span style="font-size: 11px; color: var(--pk-text-muted); margin-top: 4px; display: block;">Com código do país + DDD (apenas números).</span>
                </div>
              </div>
            </div>

            <!-- 2. BOTÃO FLUTUANTE DE WHATSAPP (NO CANTO DA TELA) -->
            <div class="pk-card" style="padding: 22px; border-left: 4px solid #25D366;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 18px;">🟢</span>
                  <h3 style="font-size: 15px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">2. Botão Flutuante de WhatsApp</h3>
                </div>
                <span class="pk-badge pk-badge-green" style="font-size: 10px;">Canto da Tela</span>
              </div>
              <p style="font-size: 12.5px; color: var(--pk-text-muted); margin: 0 0 16px 0;">Aparece flutuando no canto inferior do site para contato rápido e impulsivo.</p>

              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div class="pk-form-group">
                  <label class="pk-label" for="new-btn-greeting">Saudação no balão de abertura</label>
                  <input type="text" id="new-btn-greeting" class="pk-input" value="${greeting}" placeholder="Ex: Confirme seus dados para iniciar a conversa" required/>
                  <span style="font-size: 11px; color: var(--pk-text-muted); margin-top: 4px; display: block;">Texto exibido no topo do balão quando o visitante clica no botão.</span>
                </div>

                <div class="pk-form-group">
                  <label class="pk-label" for="new-btn-cta-text">Texto do botão no balão</label>
                  <input type="text" id="new-btn-cta-text" class="pk-input" value="${floatCta}" placeholder="Falar no WhatsApp" required/>
                </div>

                <!-- Cor e Posição -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding-top: 8px; border-top: 1px solid var(--pk-border);">
                  <div>
                    <label class="pk-label" style="margin-bottom: 6px; display: block;">Cor do Botão Flutuante</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <input type="color" id="new-btn-color-picker" value="${color}" style="width: 36px; height: 36px; border: none; border-radius: 8px; cursor: pointer; padding: 0; background: none;"/>
                      <input type="text" id="new-btn-color-hex" class="pk-input" value="${color}" style="width: 95px; font-weight: 600; font-family: monospace; padding: 6px 10px; font-size: 12px;"/>
                      
                      <!-- Cores Rápidas -->
                      <div style="display: flex; gap: 4px;">
                        <button type="button" class="btn-color-preset" data-color="#25D366" style="width: 24px; height: 24px; border-radius: 50%; background: #25D366; border: 1.5px solid var(--pk-border); cursor: pointer;" title="Verde WhatsApp"></button>
                        <button type="button" class="btn-color-preset" data-color="#7C3AED" style="width: 24px; height: 24px; border-radius: 50%; background: #7C3AED; border: 1.5px solid var(--pk-border); cursor: pointer;" title="Violeta Pinas"></button>
                        <button type="button" class="btn-color-preset" data-color="#2563EB" style="width: 24px; height: 24px; border-radius: 50%; background: #2563EB; border: 1.5px solid var(--pk-border); cursor: pointer;" title="Azul Médico"></button>
                        <button type="button" class="btn-color-preset" data-color="#EC4899" style="width: 24px; height: 24px; border-radius: 50%; background: #EC4899; border: 1.5px solid var(--pk-border); cursor: pointer;" title="Rosa Pink Luxo"></button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="pk-label" style="margin-bottom: 6px; display: block;">Posição na tela</label>
                    <div style="display: flex; gap: 12px; margin-top: 6px;">
                      <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12.5px;">
                        <input type="radio" name="new-btn-position" value="left" ${position === 'left' ? 'checked' : ''} style="cursor: pointer;"/>
                        <span>Esquerda</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12.5px;">
                        <input type="radio" name="new-btn-position" value="right" ${position === 'right' ? 'checked' : ''} style="cursor: pointer;"/>
                        <span>Direita</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Botão Ativo -->
                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--pk-border); padding-top: 12px;">
                  <div>
                    <strong style="display: block; font-size: 13px; color: var(--pk-text-primary);">Exibir Botão Flutuante no Site</strong>
                    <span style="font-size: 11.5px; color: var(--pk-text-muted);">Ficará visível no canto inferior escolhido.</span>
                  </div>
                  <input type="checkbox" id="new-btn-status" checked style="width: 18px; height: 18px; cursor: pointer;"/>
                </div>
              </div>
            </div>

            <!-- 3. FORMULÁRIO DE QUALIFICAÇÃO NO FINAL DA PÁGINA (PADRÃO SCREENSHOT 1) -->
            <div class="pk-card" style="padding: 22px; border-left: 4px solid var(--pk-primary);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 18px;">📋</span>
                  <h3 style="font-size: 15px; font-weight: 800; color: var(--pk-text-primary); margin: 0;">3. Formulário de Qualificação na Página</h3>
                </div>
                <span class="pk-badge pk-badge-purple" style="font-size: 10px;">Final da Página</span>
              </div>
              <p style="font-size: 12.5px; color: var(--pk-text-muted); margin: 0 0 16px 0;">
                O formulário inserido no rodapé do site do cliente para quem leu a página até o fim e quer avaliação detalhada.
              </p>

              <div style="display: flex; flex-direction: column; gap: 14px;">
                <!-- Título e Subtítulo -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="pk-form-group">
                    <label class="pk-label" for="new-form-title">Título do Formulário *</label>
                    <input type="text" id="new-form-title" class="pk-input" value="${formTitle}" placeholder="Ex: Conte sobre seu momento." required/>
                  </div>
                  <div class="pk-form-group">
                    <label class="pk-label" for="new-form-subtitle">Subtítulo Explicativo</label>
                    <input type="text" id="new-form-subtitle" class="pk-input" value="${formSubtitle}" placeholder="Ex: Preencha os campos para receber uma avaliação personalizada."/>
                  </div>
                </div>

                <!-- Pergunta Central e Opções Dinâmicas -->
                <div class="pk-form-group" style="margin-top: 4px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <label class="pk-label" for="new-btn-question" style="margin: 0;">Pergunta Central do Seletor *</label>
                    <button type="button" class="pk-btn pk-btn-secondary pk-btn-xs" id="btn-add-new-option" style="font-size: 11.5px; padding: 4px 10px;">
                      + Adicionar Nova Opção
                    </button>
                  </div>
                  <input type="text" id="new-btn-question" class="pk-input" value="${formQuestion}" placeholder="Ex: Qual região você gostaria de tratar?" required style="font-weight: 600;"/>
                </div>

                <label class="pk-label" style="font-size: 12px; margin-bottom: 4px; display: block; color: var(--pk-text-secondary);">
                  Opções de Resposta & Temperatura de Lead:
                </label>

                <!-- Lista de Opções Dinâmica com Pontuação e Lixeira -->
                <div id="new-btn-options-list" style="display: flex; flex-direction: column; gap: 8px;">
                  ${options.map((opt, index) => `
                    <div class="new-btn-option-row" data-index="${index}" style="display: grid; grid-template-columns: 24px 1fr 140px 32px; gap: 8px; align-items: center; background: var(--pk-bg-subtle); border: 1px solid var(--pk-border); border-radius: 8px; padding: 6px 10px;">
                      <span style="font-size: 13px; font-weight: 800; color: var(--pk-primary); text-align: center;">${index + 1}.</span>
                      <input type="text" class="pk-input new-opt-label" value="${opt.label}" placeholder="Descreva a opção..." required style="padding: 7px 10px; font-size: 12.5px;"/>
                      <select class="pk-input new-opt-badge" style="padding: 7px 8px; font-size: 11.5px; cursor: pointer;">
                        <option value="🔥 Quente" ${opt.badge && opt.badge.includes('Quente') ? 'selected' : ''}>🔥 Quente (+30)</option>
                        <option value="❄️ Morno" ${opt.badge && opt.badge.includes('Morno') ? 'selected' : ''}>❄️ Morno (+20)</option>
                        <option value="🧊 Frio" ${opt.badge && opt.badge.includes('Frio') ? 'selected' : ''}>🧊 Frio (+10)</option>
                      </select>
                      <button type="button" class="btn-remove-new-option" title="Remover opção" style="border: none; background: none; color: #EF4444; cursor: pointer; font-size: 14px; padding: 4px; display: grid; place-items: center;">
                        🗑️
                      </button>
                    </div>
                  `).join('')}
                </div>

                <!-- Botão CTA do Formulário -->
                <div class="pk-form-group" style="margin-top: 4px;">
                  <label class="pk-label" for="new-form-cta-text">Texto do Botão de Envio (CTA) *</label>
                  <input type="text" id="new-form-cta-text" class="pk-input" value="${formCta}" placeholder="Ex: Preparar minha mensagem →" required/>
                </div>

                <!-- Template WhatsApp Dinâmico -->
                <div class="pk-form-group">
                  <label class="pk-label" for="new-form-template">Template da Mensagem Pronta do WhatsApp *</label>
                  <textarea id="new-form-template" class="pk-input" rows="2" style="font-size: 12.5px; resize: vertical;" required>${formTemplate}</textarea>
                  <div style="margin-top: 6px;">
                    <span style="font-size: 11px; color: var(--pk-text-muted); display: block; margin-bottom: 4px;">Clique em uma tag para inserir no template:</span>
                    <span class="pk-builder-tag-chip new-form-tag-chip" data-tag="{nome}">+ {nome}</span>
                    <span class="pk-builder-tag-chip new-form-tag-chip" data-tag="{momento}">+ {momento}</span>
                    <span class="pk-builder-tag-chip new-form-tag-chip" data-tag="{mensagem}">+ {mensagem}</span>
                    <span class="pk-builder-tag-chip new-form-tag-chip" data-tag="{telefone}">+ {telefone}</span>
                  </div>
                </div>

                <!-- Checkbox Formulário Ativo -->
                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--pk-border); padding-top: 12px;">
                  <div>
                    <strong style="display: block; font-size: 13px; color: var(--pk-text-primary);">Exibir Formulário ao Final da Página</strong>
                    <span style="font-size: 11.5px; color: var(--pk-text-muted);">Será embutido no rodapé do site pelo mesmo script embed.</span>
                  </div>
                  <input type="checkbox" id="new-form-status" checked style="width: 18px; height: 18px; cursor: pointer;"/>
                </div>

              </div>
            </div>

            <!-- AÇÕES DO FORMULÁRIO -->
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 8px;">
              <button type="button" class="pk-btn pk-btn-outline" id="btn-cancel-new-button-bottom">Cancelar</button>
              <button type="submit" class="pk-btn pk-btn-success" id="btn-submit-new-button" style="background: #25D366; border-color: #25D366; color: #FFF; font-weight: 700; padding: 12px 28px; font-size: 14px; box-shadow: 0 4px 14px rgba(37,211,102,0.35);">
                ${isEditing ? '💾 Salvar Alterações' : '🚀 Salvar e Gerar Script'}
              </button>
            </div>

          </div>

          <!-- COLUNA DA DIREITA: PRÉ-VISUALIZAÇÃO AO VIVO COM ALTERNADOR DE ABAS -->
          <div style="position: sticky; top: 80px;">
            
            <!-- Barra Superior do Preview com Alternador de Abas -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 13.5px; font-weight: 800; color: var(--pk-text-primary);">Pré-visualização ao Vivo</span>
              
              <!-- Segmented Control: Botão Flutuante vs Formulário de Página -->
              <div style="display: inline-flex; background: var(--pk-bg-subtle); padding: 3px; border-radius: 8px; border: 1px solid var(--pk-border);">
                <button type="button" id="btn-preview-mode-float" class="pk-preview-tab-btn active" style="padding: 5px 10px; font-size: 11px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: var(--pk-primary); color: #FFF; transition: all 150ms ease;">
                  🟢 Botão Flutuante
                </button>
                <button type="button" id="btn-preview-mode-form" class="pk-preview-tab-btn" style="padding: 5px 10px; font-size: 11px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; background: transparent; color: var(--pk-text-secondary); transition: all 150ms ease;">
                  📋 Formulário na Página
                </button>
              </div>
            </div>

            <!-- Moldura do Navegador Simulado -->
            <div class="pk-browser-mockup" style="background: var(--pk-bg-surface); border: 1.5px solid var(--pk-border); border-radius: 16px; overflow: hidden; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08); min-height: 580px; position: relative; display: flex; flex-direction: column;">
              
              <!-- Barra de Endereço do Navegador -->
              <div style="background: var(--pk-bg-subtle); border-bottom: 1px solid var(--pk-border); padding: 10px 14px; display: flex; align-items: center; gap: 10px;">
                <div style="display: flex; gap: 6px;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444; display: inline-block;"></span>
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B; display: inline-block;"></span>
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
                </div>
                <div style="background: var(--pk-bg-surface); border: 1px solid var(--pk-border); border-radius: 6px; padding: 3px 12px; font-size: 11px; color: var(--pk-text-muted); flex: 1; text-align: center; font-family: monospace;">
                  🔒 <span id="preview-browser-url">${siteUrl ? siteUrl.replace(/^https?:\/\//, '') : 'seu-site.com.br'}</span>
                </div>
              </div>

              <!-- ======================================================== -->
              <!-- VISTA 1: BOTÃO FLUTUANTE NO SITE (SCREENSHOT 2)          -->
              <!-- ======================================================== -->
              <div id="preview-mode-float-container" style="padding: 20px; flex: 1; position: relative; background: linear-gradient(180deg, var(--pk-bg-surface) 0%, var(--pk-bg-subtle) 100%); overflow: hidden; min-height: 500px;">
                
                <!-- Esqueleto do Site -->
                <div style="width: 40%; height: 14px; background: var(--pk-border); border-radius: 4px; margin-bottom: 12px; opacity: 0.6;"></div>
                <div style="width: 70%; height: 10px; background: var(--pk-border); border-radius: 4px; margin-bottom: 8px; opacity: 0.4;"></div>
                <div style="width: 55%; height: 10px; background: var(--pk-border); border-radius: 4px; margin-bottom: 24px; opacity: 0.4;"></div>
                <div style="width: 80px; height: 26px; background: var(--pk-border); border-radius: 6px; opacity: 0.5;"></div>

                <!-- CONTAINER DO WIDGET FLUTUANTE (POSICIONADO À ESQUERDA OU DIREITA) -->
                <div id="preview-floating-container" style="position: absolute; bottom: 20px; ${position === 'left' ? 'left: 20px; align-items: flex-start;' : 'right: 20px; align-items: flex-end;'} display: flex; flex-direction: column; gap: 12px; transition: all 250ms ease;">
                  
                  <!-- Balão / Popup de Conversa Aberto -->
                  <div id="preview-floating-popup" style="width: 290px; background: var(--pk-bg-surface); border: 1px solid var(--pk-border); border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.12); padding: 14px; text-align: left; transition: all 200ms ease;">
                    
                    <!-- Topo com Avatar e Status Online -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid var(--pk-border); padding-bottom: 8px;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <div id="preview-store-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: ${color}; display: grid; place-items: center; color: #FFF; font-weight: 800; font-size: 13px;">
                          HF
                        </div>
                        <div>
                          <strong id="preview-store-name" style="display: block; font-size: 12px; color: var(--pk-text-primary);">${name}</strong>
                          <span style="font-size: 10px; color: #10B981; font-weight: 600;">● Online</span>
                        </div>
                      </div>
                      <span id="preview-close-popup-btn" style="font-size: 12px; color: var(--pk-text-muted); cursor: pointer;" title="Fechar Balão">✕</span>
                    </div>

                    <strong style="font-size: 12px; color: var(--pk-text-primary); display: block; margin-bottom: 2px;">Antes de continuar...</strong>
                    <p id="preview-floating-greeting" style="font-size: 11px; color: var(--pk-text-secondary); margin: 0 0 10px 0; line-height: 1.35;">
                      ${greeting}
                    </p>

                    <!-- Campos mockados -->
                    <input type="text" placeholder="Seu nome *" disabled style="width: 100%; box-sizing: border-box; padding: 7px 10px; font-size: 11px; margin-bottom: 6px; border: 1px solid var(--pk-border); border-radius: 6px; background: var(--pk-bg-subtle);"/>
                    <input type="text" placeholder="+55 ▾ Seu WhatsApp *" disabled style="width: 100%; box-sizing: border-box; padding: 7px 10px; font-size: 11px; margin-bottom: 10px; border: 1px solid var(--pk-border); border-radius: 6px; background: var(--pk-bg-subtle);"/>

                    <!-- Botão CTA no Balão com Ícone Oficial de WhatsApp -->
                    <button type="button" id="preview-floating-action-btn" style="width: 100%; border: none; background: ${color}; color: #FFF; font-weight: 700; font-size: 12.5px; padding: 10px 14px; border-radius: 8px; cursor: pointer; transition: all 150ms ease; display: flex; align-items: center; justify-content: center; gap: 8px;">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="#FFFFFF" style="flex-shrink: 0;">
                        <path d="${WHATSAPP_SVG_PATH}"/>
                      </svg>
                      <span id="preview-floating-action-text">${floatCta}</span>
                    </button>
                  </div>

                  <!-- Botão Flutuante Circular com Logo Oficial do WhatsApp -->
                  <div id="preview-floating-trigger-btn" style="width: 56px; height: 56px; border-radius: 50%; background: ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0, 0, 0, 0.12); cursor: pointer; position: relative; transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;" title="Falar no WhatsApp">
                    <svg width="32" height="32" viewBox="0 0 16 16" fill="#FFFFFF" style="display: block; pointer-events: none;">
                      <path d="${WHATSAPP_SVG_PATH}"/>
                    </svg>
                  </div>

                </div>

              </div>

              <!-- ======================================================== -->
              <!-- VISTA 2: FORMULÁRIO DE QUALIFICAÇÃO NO RODAPÉ            -->
              <!-- (FIEL AO SCREENSHOT 1 DO CLIENTE)                        -->
              <!-- ======================================================== -->
              <div id="preview-mode-form-container" style="display: none; padding: 24px 20px; flex: 1; background: var(--pk-bg-surface); overflow-y: auto; max-height: 520px;">
                
                <div style="background: var(--pk-bg-card); border: 1px solid var(--pk-border); border-radius: 14px; padding: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                  
                  <!-- Título e Subtítulo do Formulário -->
                  <div style="margin-bottom: 16px;">
                    <h3 id="preview-live-form-title" style="font-size: 17px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 4px 0;">
                      ${formTitle}
                    </h3>
                    <p id="preview-live-form-subtitle" style="font-size: 12px; color: var(--pk-text-secondary); margin: 0; line-height: 1.4;">
                      ${formSubtitle}
                    </p>
                  </div>

                  <!-- Campos de Contato -->
                  <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
                    <div>
                      <label style="font-size: 11.5px; font-weight: 600; color: var(--pk-text-primary); display: block; margin-bottom: 3px;">Seu Nome *</label>
                      <input type="text" class="pk-input" value="Mariana Silva" disabled style="padding: 8px 12px; font-size: 12px; opacity: 0.85; background: var(--pk-bg-subtle);"/>
                    </div>
                    <div>
                      <label style="font-size: 11.5px; font-weight: 600; color: var(--pk-text-primary); display: block; margin-bottom: 3px;">Seu WhatsApp *</label>
                      <input type="text" class="pk-input" value="(11) 98765-4321" disabled style="padding: 8px 12px; font-size: 12px; opacity: 0.85; background: var(--pk-bg-subtle);"/>
                    </div>
                  </div>

                  <!-- Pergunta e Opções Interativas com Pontuação / Badge -->
                  <div style="margin-bottom: 14px;">
                    <label id="preview-live-form-question" style="font-size: 12.5px; font-weight: 700; color: var(--pk-primary); display: block; margin-bottom: 8px;">
                      ${formQuestion}
                    </label>

                    <div id="preview-live-form-options" style="display: flex; flex-direction: column; gap: 7px;">
                      ${options.map((opt, idx) => `
                        <div class="pk-preview-option-item ${idx === 0 ? 'is-selected' : ''}" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding: 10px 12px; border: 1.5px solid ${idx === 0 ? 'var(--pk-primary)' : 'var(--pk-border)'}; border-radius: 8px; background: ${idx === 0 ? 'rgba(124,58,237,0.06)' : 'var(--pk-bg-subtle)'};">
                          <div style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${idx === 0 ? 'var(--pk-primary)' : 'var(--pk-border)'}; display: grid; place-items: center; flex-shrink: 0;">
                            ${idx === 0 ? '<div style="width: 6px; height: 6px; border-radius: 50%; background: var(--pk-primary);"></div>' : ''}
                          </div>
                          <span class="preview-live-opt-label" style="font-size: 12px; font-weight: 600; color: var(--pk-text-primary); flex: 1;">
                            ${opt.label}
                          </span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Botão CTA no Formulário com Ícone WhatsApp Oficial -->
                  <button type="button" id="preview-live-form-cta" style="width: 100%; border: none; background: #25D366; color: #FFF; font-weight: 700; font-size: 13.5px; padding: 11px 16px; border-radius: 9px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(37,211,102,0.35);">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="#FFFFFF" style="flex-shrink: 0;">
                      <path d="${WHATSAPP_SVG_PATH}"/>
                    </svg>
                    <span id="preview-live-form-cta-text">${formCta}</span>
                  </button>

                  <div style="margin-top: 10px; text-align: center; font-size: 10.5px; color: var(--pk-text-muted);">
                    🔒 Protegido com criptografia e anti-bot invisível
                  </div>

                </div>

              </div>

              <!-- Rodapé Informativo do Mockup -->
              <div style="background: var(--pk-bg-subtle); border-top: 1px solid var(--pk-border); padding: 8px 14px; text-align: center; font-size: 11px; color: var(--pk-text-muted);">
                Ambos são inseridos no site pelo mesmo script embed oficial.
              </div>

            </div>

          </div>

        </div>
      </form>

    </div>
  `;
}
