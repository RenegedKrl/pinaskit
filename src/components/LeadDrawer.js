/* ==========================================================================
   PINAS KIT — FICHA & DRAWER LATERAL DO LEAD (MODELO D: ASSISTIDO E DIDÁTICO)
   ========================================================================== */

export function renderLeadDrawer(lead = null) {
  if (!lead) {
    return `
      <div class="pk-drawer-overlay" id="lead-drawer-overlay">
        <div class="pk-drawer-panel" id="lead-drawer-panel"></div>
      </div>
    `;
  }

  const phoneDigits = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
  const defaultMsg = `Olá, ${lead.name}! Vi seu interesse em ${lead.button || 'nossos serviços'}. Como posso te ajudar hoje?`;
  const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(lead.userMessage ? `Olá, ${lead.name}! Recebi sua mensagem: "${lead.userMessage}". Como posso te ajudar?` : defaultMsg)}`;

  const stages = ['Novo', 'Em conversa', 'Proposta', 'Venda', 'Perdido'];

  return `
    <div class="pk-drawer-overlay" id="lead-drawer-overlay">
      <div class="pk-drawer-panel" id="lead-drawer-panel">
        
        <!-- CABEÇALHO DO DRAWER -->
        <div class="pk-drawer-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="pk-badge pk-badge-primary" style="font-size: 11px; font-weight: 700;">#${lead.id}</span>
            <span style="font-size: 12px; color: var(--pk-text-muted);">Capturado em ${lead.lastVisit || 'Hoje'}</span>
          </div>

          <button class="pk-modal-close" id="btn-close-lead-drawer" title="Fechar Ficha do Lead" style="position: static; width: 32px; height: 32px;">
            ✕
          </button>
        </div>

        <!-- CORPO DA FICHA COM SCROLL -->
        <div class="pk-drawer-body">
          
          <!-- HERO DO LEAD -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--pk-border); padding-bottom: 18px;">
            <div style="display: flex; gap: 14px; align-items: center;">
              <div style="width: 48px; height: 48px; border-radius: var(--pk-radius-full); background: linear-gradient(135deg, #7C3AED, #A855F7); display: grid; place-items: center; color: #FFF; font-weight: 800; font-size: 18px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
                ${lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
              </div>
              <div>
                <h3 style="font-size: 18px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 4px 0;">
                  ${lead.name}
                </h3>
                <div style="font-size: 13px; color: var(--pk-text-secondary); display: flex; gap: 8px; flex-wrap: wrap;">
                  <span>📞 ${lead.phone}</span>
                  ${lead.email && lead.email !== '-' ? `<span>· ✉️ ${lead.email}</span>` : ''}
                </div>
              </div>
            </div>

            <!-- Badge de Temperatura -->
            <span class="pk-badge ${lead.temperature === 'Quente' ? 'pk-badge-hot' : lead.temperature === 'Frio' ? 'pk-badge-cold' : 'pk-badge-warm'}" style="font-size: 12px; font-weight: 700; padding: 6px 12px; flex-shrink: 0;">
              ${lead.temperature === 'Quente' ? '🔥 Quente' : lead.temperature === 'Frio' ? '🧊 Frio' : '❄️ Morno'} (${lead.score || 30} pts)
            </span>
          </div>

          <!-- AÇÕES DIRETAS (WHATSAPP & COPIAR) -->
          <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 10px;">
            <a href="${whatsappUrl}" target="_blank" class="pk-btn pk-btn-whatsapp" id="drawer-btn-whatsapp" style="justify-content: center; font-size: 13.5px; text-decoration: none;">
              💬 Falar no WhatsApp
            </a>
            <button class="pk-btn pk-btn-outline" id="drawer-btn-copy-phone" data-phone="${lead.phone}" style="justify-content: center; font-size: 13px;">
              📋 Copiar Número
            </button>
          </div>

          <!-- ESTÁGIO NO CRM (PIPELINE INTERATIVO) -->
          <div class="pk-drawer-section">
            <div class="pk-drawer-section-title">
              <span>🎯 Estágio no Funil CRM</span>
              <span style="font-size: 11px; font-weight: normal; text-transform: none; color: var(--pk-text-muted);">Clique para alterar</span>
            </div>

            <div class="pk-stage-pills-container">
              ${stages.map(stg => `
                <div class="pk-stage-pill ${lead.stage === stg ? 'is-active' : ''}" data-lead-id="${lead.id}" data-stage="${stg}">
                  ${stg === 'Venda' ? '✓ Venda Fechada' : stg}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ATRIBUIÇÃO DE ANÚNCIOS & UTMs -->
          <div class="pk-drawer-section">
            <div class="pk-drawer-section-title">
              <span>📍 Origem & Rastreamento de Anúncios</span>
              <span class="pk-badge ${lead.origin.includes('Meta') ? 'pk-badge-purple' : lead.origin.includes('Google') ? 'pk-badge-blue' : 'pk-badge-green'}" style="font-size: 10px;">
                ${lead.origin}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12.5px;">
              <div style="background: var(--pk-bg-card); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--pk-border);">
                <span style="display: block; font-size: 11px; color: var(--pk-text-muted); margin-bottom: 2px;">Campanha:</span>
                <strong style="color: var(--pk-text-primary); word-break: break-all;">${lead.utmCampaign || lead.campaign || 'Acesso Direto'}</strong>
              </div>

              <div style="background: var(--pk-bg-card); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--pk-border);">
                <span style="display: block; font-size: 11px; color: var(--pk-text-muted); margin-bottom: 2px;">Botão / Site:</span>
                <strong style="color: var(--pk-primary);">${lead.button || 'Geral'}</strong>
              </div>

              <div style="background: var(--pk-bg-card); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--pk-border);">
                <span style="display: block; font-size: 11px; color: var(--pk-text-muted); margin-bottom: 2px;">Criativo / Conteúdo:</span>
                <span style="color: var(--pk-text-secondary);">${lead.utmContent || 'Padrão'}</span>
              </div>

              <div style="background: var(--pk-bg-card); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--pk-border);">
                <span style="display: block; font-size: 11px; color: var(--pk-text-muted); margin-bottom: 2px;">Termo / Palavra-chave:</span>
                <span style="color: var(--pk-text-secondary);">${lead.utmTerm || '-'}</span>
              </div>
            </div>
          </div>

          <!-- RESPOSTAS DA QUALIFICAÇÃO DINÂMICA -->
          <div class="pk-drawer-section">
            <div class="pk-drawer-section-title">
              <span>📝 Respostas da Qualificação</span>
            </div>

            <div style="background: var(--pk-bg-card); padding: 12px; border-radius: 8px; border: 1px solid var(--pk-border); margin-bottom: 8px;">
              <div style="font-size: 12px; color: var(--pk-text-muted); margin-bottom: 4px;">
                ${lead.qualQuestion || 'O que melhor descreve seu momento?'}
              </div>
              <div style="font-size: 13.5px; font-weight: 700; color: var(--pk-primary);">
                ${lead.qualAnswer || 'Consulta e Informações (+30 pts)'}
              </div>
            </div>

            ${lead.userMessage ? `
              <div style="background: var(--pk-bg-card); padding: 12px; border-radius: 8px; border: 1px solid var(--pk-border);">
                <div style="font-size: 12px; color: var(--pk-text-muted); margin-bottom: 4px;">
                  Mensagem enviada pelo lead:
                </div>
                <p style="font-size: 13px; color: var(--pk-text-secondary); margin: 0; font-style: italic; line-height: 1.4;">
                  "${lead.userMessage}"
                </p>
              </div>
            ` : ''}
          </div>

          <!-- LINHA DO TEMPO (TIMELINE DE ATIVIDADES) -->
          <div class="pk-drawer-section">
            <div class="pk-drawer-section-title">
              <span>⏳ Linha do Tempo do Lead</span>
            </div>

            <div class="pk-timeline-list">
              ${(lead.timeline && lead.timeline.length > 0) ? lead.timeline.map(item => `
                <div class="pk-timeline-item">
                  <span class="pk-timeline-dot">${item.icon || '🟣'}</span>
                  <div style="font-size: 11px; color: var(--pk-text-muted); margin-bottom: 2px;">${item.time}</div>
                  <strong style="font-size: 13px; color: var(--pk-text-primary); display: block;">${item.title}</strong>
                  <span style="font-size: 12px; color: var(--pk-text-secondary);">${item.desc}</span>
                </div>
              `).join('') : `
                <div class="pk-timeline-item">
                  <span class="pk-timeline-dot">🟣</span>
                  <div style="font-size: 11px; color: var(--pk-text-muted); margin-bottom: 2px;">${lead.lastVisit}</div>
                  <strong style="font-size: 13px; color: var(--pk-text-primary); display: block;">Lead capturado no site</strong>
                  <span style="font-size: 12px; color: var(--pk-text-secondary);">Origem: ${lead.origin} (${lead.campaign})</span>
                </div>
              `}
            </div>
          </div>

          <!-- ANOTAÇÕES INTERNAS DA EQUIPE -->
          <div class="pk-drawer-section">
            <div class="pk-drawer-section-title">
              <span>📌 Anotações da Equipe</span>
            </div>

            <!-- Formulário para nova anotação -->
            <form id="drawer-note-form" data-lead-id="${lead.id}" style="margin-bottom: 14px;">
              <textarea class="pk-input" id="drawer-note-input" rows="2" placeholder="Adicione uma anotação interna sobre este lead..." style="font-size: 13px; resize: vertical; margin-bottom: 8px; width: 100%; box-sizing: border-box;" required></textarea>
              <div style="display: flex; justify-content: flex-end;">
                <button type="submit" class="pk-btn pk-btn-primary pk-btn-xs" style="font-size: 12px;">
                  + Salvar Anotação
                </button>
              </div>
            </form>

            <!-- Lista de anotações -->
            <div id="drawer-notes-list" style="display: flex; flex-direction: column; gap: 8px;">
              ${(lead.activityNotes && lead.activityNotes.length > 0) ? lead.activityNotes.map(n => `
                <div style="background: var(--pk-bg-card); border: 1px solid var(--pk-border); border-radius: 8px; padding: 10px 12px;">
                  <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--pk-text-muted); margin-bottom: 4px;">
                    <strong>👤 ${n.author}</strong>
                    <span>${n.date}</span>
                  </div>
                  <p style="font-size: 12.5px; color: var(--pk-text-secondary); margin: 0; line-height: 1.4;">
                    ${n.text}
                  </p>
                </div>
              `).join('') : `
                <div style="font-size: 12px; color: var(--pk-text-muted); text-align: center; padding: 12px;">
                  Nenhuma anotação interna ainda. Digite acima para registrar recados da equipe.
                </div>
              `}
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}
