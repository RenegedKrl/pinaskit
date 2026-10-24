/**
 * ============================================================================
 * PINAS KIT — WIDGET EMBED OFICIAL (EMBED.JS)
 * Permite adicionar o Botão Flutuante de WhatsApp e o Formulário de Qualificação
 * em qualquer site (WordPress, Shopify, Next.js, HTML estático, etc.)
 * ============================================================================
 */
(function() {
  'use strict';

  // Evita carregar duas vezes
  if (window.__PINASKIT_EMBED_LOADED__) return;
  window.__PINASKIT_EMBED_LOADED__ = true;

  // 1. Identificar a tag do script e parâmetros de configuração
  const scriptTag = document.currentScript || document.querySelector('script[data-pinaskit]');
  const urlParams = (typeof window !== 'undefined' && window.location) ? new URLSearchParams(window.location.search) : null;
  const buttonId = (urlParams && urlParams.get('button')) || (scriptTag ? scriptTag.getAttribute('data-pinaskit') : 'btn-1') || 'btn-1';
  const apiEndpoint = scriptTag ? (scriptTag.getAttribute('data-api') || window.location.origin) : window.location.origin;

  // 2. Obter configurações do botão (do localStorage compartilhado ou dados padrão)
  const DEFAULT_CONFIGS = {
    'btn-1': {
      name: 'Glúteo Feminino',
      whatsapp: '5511975374960',
      color: '#25D366',
      position: 'right',
      greeting: 'Confirme seus dados para iniciar a conversa',
      ctaText: 'Falar no WhatsApp',
      formConfig: {
        title: 'Conte sobre seu momento.',
        subtitle: 'Preencha os campos para receber uma avaliação personalizada.',
        questionLabel: 'Qual é o seu objetivo principal hoje?',
        options: [
          { id: '1', label: 'Quero tonificação e aumento de volume', score: 35, badge: '🔥 Quente' },
          { id: '2', label: 'Gostaria de entender valores e parcelamento', score: 25, badge: '❄️ Morno' },
          { id: '3', label: 'Tenho interesse para os próximos meses', score: 15, badge: '🧊 Frio' }
        ],
        whatsappTemplate: 'Olá! Meu nome é {nome}. Vi o site e meu objetivo é: {momento}. Mensagem: {mensagem}'
      }
    },
    'btn-2': {
      name: 'Endolaser',
      whatsapp: '5511981814586',
      color: '#25D366',
      position: 'right',
      greeting: 'Tire suas dúvidas sobre Endolaser no WhatsApp',
      ctaText: 'Falar com Especialista',
      formConfig: {
        title: 'Avaliação de Endolaser.',
        subtitle: 'Preencha para tirar dúvidas sobre o procedimento de Endolaser.',
        questionLabel: 'Qual região você gostaria de tratar?',
        options: [
          { id: '1', label: 'Papada ou pescoço', score: 30, badge: '🔥 Quente' },
          { id: '2', label: 'Abdômen ou flancos', score: 30, badge: '🔥 Quente' },
          { id: '3', label: 'Apenas pesquisando valores no momento', score: 10, badge: '🧊 Frio' }
        ],
        whatsappTemplate: 'Olá! Meu nome é {nome}. Gostaria de informações sobre Endolaser para: {momento}.'
      }
    },
    'btn-3': {
      name: 'Consulta Médica',
      whatsapp: '5511964906555',
      color: '#25D366',
      position: 'right',
      greeting: 'Agende sua consulta diretamente pelo WhatsApp',
      ctaText: 'Agendar Consulta',
      formConfig: {
        title: 'Agendamento de Consulta.',
        subtitle: 'Agende sua primeira consulta com nosso especialista.',
        questionLabel: 'O que melhor descreve sua necessidade médica?',
        options: [
          { id: '1', label: 'Consulta de urgência / dor aguda', score: 40, badge: '🔥 Quente' },
          { id: '2', label: 'Check-up de rotina ou acompanhamento', score: 25, badge: '❄️ Morno' },
          { id: '3', label: 'Segunda opinião médica', score: 30, badge: '🔥 Quente' }
        ],
        whatsappTemplate: 'Olá Dr.! Meu nome é {nome}. Vi seu site e gostaria de agendar consulta para: {momento}.'
      }
    }
  };

  // Tenta ler botões salvos do painel Pinas Kit se estiver no mesmo navegador
  let activeConfig = DEFAULT_CONFIGS[buttonId] || DEFAULT_CONFIGS['btn-1'];
  try {
    const saved = localStorage.getItem('pk_buttons');
    if (saved) {
      const list = JSON.parse(saved);
      const match = list.find(b => b.id === buttonId);
      if (match) {
        activeConfig = {
          name: match.name,
          siteUrl: match.siteUrl || '',
          whatsapp: match.whatsappNumber || '5511975374960',
          color: (match.style && match.style.color) ? match.style.color : '#25D366',
          position: (match.style && match.style.position) ? match.style.position : 'right',
          greeting: (match.style && match.style.greeting) ? match.style.greeting : 'Confirme seus dados para iniciar a conversa',
          ctaText: (match.style && match.style.ctaText) ? match.style.ctaText : 'Falar no WhatsApp',
          formConfig: match.formConfig || activeConfig.formConfig
        };
      }
    }
  } catch (_) {}

  // 2.1 Verificação de Domínio Exclusivo do Botão
  // Garante que cada botão opere exclusivamente no site cadastrado pelo usuário
  function isSiteDomainAuthorized(allowedUrl) {
    if (!allowedUrl) return true;
    try {
      const currentHost = (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : '';
      // Sempre autoriza localhost, 127.0.0.1 e páginas locais para testes e desenvolvimento
      if (!currentHost || currentHost === 'localhost' || currentHost === '127.0.0.1') return true;

      let clean = allowedUrl.trim().toLowerCase();
      if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = 'https://' + clean;
      }
      const targetHost = new URL(clean).hostname.toLowerCase();

      // Autoriza correspondência exata ou subdomínios (ex: app.site.com e site.com)
      if (currentHost === targetHost || currentHost.endsWith('.' + targetHost) || targetHost.endsWith('.' + currentHost)) {
        return true;
      }
      return false;
    } catch (_) {
      return true;
    }
  }

  if (activeConfig.siteUrl && !isSiteDomainAuthorized(activeConfig.siteUrl)) {
    console.warn(`%c[Pinas Kit] O botão "${activeConfig.name}" está restrito exclusivamente ao site: ${activeConfig.siteUrl}. Execução ignorada no host: ${window.location.hostname}.`, 'color: #F59E0B; font-weight: bold;');
    return;
  }

  // 3. Injetar Estilos do Widget Isolados
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .pk-embed-floating-wrap {
      position: fixed;
      bottom: 24px;
      ${activeConfig.position === 'left' ? 'left: 24px;' : 'right: 24px;'}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: ${activeConfig.position === 'left' ? 'flex-start' : 'flex-end'};
      gap: 12px;
    }
    .pk-embed-floating-btn {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: ${activeConfig.color};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(37, 211, 102, 0.4);
      cursor: pointer;
      transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease;
      user-select: none;
    }
    .pk-embed-floating-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(37, 211, 102, 0.5);
    }
    .pk-embed-popup {
      display: none;
      width: 320px;
      max-width: 90vw;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
      padding: 18px;
      box-sizing: border-box;
      color: #1E293B;
    }
    .pk-embed-popup.is-open {
      display: block;
      animation: pkEmbedPop 200ms ease-out;
    }
    @keyframes pkEmbedPop {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .pk-embed-popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .pk-embed-popup-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #0F172A;
      margin: 0;
    }
    .pk-embed-popup-status {
      font-size: 11px;
      color: #10B981;
      font-weight: 600;
      margin-top: 2px;
      display: block;
    }
    .pk-embed-input {
      all: unset !important;
      width: 100% !important;
      box-sizing: border-box !important;
      padding: 11px 14px !important;
      font-size: 13.5px !important;
      border: 1.5px solid #CBD5E1 !important;
      border-radius: 8px !important;
      background: #F8FAFC !important;
      color: #1E293B !important;
      margin-bottom: 10px !important;
      outline: none !important;
      display: block !important;
      font-family: inherit !important;
      line-height: normal !important;
      transition: border-color 150ms ease, background 150ms ease !important;
    }
    .pk-embed-input:focus {
      border-color: #7C3AED !important;
      background: #FFFFFF !important;
    }
    .pk-embed-submit-btn {
      width: 100% !important;
      background: #7C3AED !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 10px !important;
      padding: 14px 20px !important;
      font-size: 14.5px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35) !important;
      transition: filter 150ms ease, transform 150ms ease !important;
      box-sizing: border-box !important;
      text-decoration: none !important;
      letter-spacing: 0.2px !important;
    }
    .pk-embed-submit-btn:hover {
      filter: brightness(0.92) !important;
      transform: translateY(-1px) !important;
    }
    /* Estilos do Formulário Embutido no Final da Página */
    .pk-embed-page-form-section {
      width: 100% !important;
      box-sizing: border-box !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }
    .pk-embed-page-form-section.is-standalone {
      max-width: 680px !important;
      margin: 48px auto !important;
      padding: 32px 24px !important;
      background: #FFFFFF !important;
      border: 1.5px solid #E2E8F0 !important;
      border-radius: 16px !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05) !important;
    }
    #pinaskit-form .pk-embed-page-form-section:not(.is-standalone) {
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
    }

    /* Reset Defensivo para os Radio Buttons (Círculos) */
    .pk-embed-radio {
      all: unset !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      appearance: none !important;
      width: 18px !important;
      min-width: 18px !important;
      max-width: 18px !important;
      height: 18px !important;
      min-height: 18px !important;
      max-height: 18px !important;
      aspect-ratio: 1 / 1 !important;
      border: 2px solid #CBD5E1 !important;
      border-radius: 50% !important;
      background-color: #FFFFFF !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-grid !important;
      place-content: center !important;
      flex-shrink: 0 !important;
      box-sizing: border-box !important;
      cursor: pointer !important;
      outline: none !important;
      box-shadow: none !important;
      transition: all 150ms ease !important;
    }
    .pk-embed-radio:checked {
      border-color: #7C3AED !important;
      background-color: #FFFFFF !important;
    }
    .pk-embed-radio::before {
      content: "" !important;
      width: 8px !important;
      height: 8px !important;
      border-radius: 50% !important;
      background-color: #7C3AED !important;
      display: block !important;
      transform: scale(0) !important;
      transition: transform 120ms ease-in-out !important;
    }
    .pk-embed-radio:checked::before {
      transform: scale(1) !important;
    }
    .pk-embed-option-card {
      all: unset !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 11px 14px !important;
      border: 1.5px solid #E2E8F0 !important;
      border-radius: 10px !important;
      cursor: pointer !important;
      background: #F8FAFC !important;
      transition: all 150ms ease !important;
      box-sizing: border-box !important;
      margin: 0 !important;
    }
    .pk-embed-option-card:hover {
      border-color: #CBD5E1 !important;
      background: #F1F5F9 !important;
    }
    .pk-embed-option-card:has(.pk-embed-radio:checked),
    .pk-embed-option-card.is-selected {
      border-color: #7C3AED !important;
      background: rgba(124, 58, 237, 0.05) !important;
    }
  `;
  document.head.appendChild(styleEl);

  // SVG Oficial do WhatsApp
  const WHATSAPP_SVG = `
    <svg width="32" height="32" viewBox="0 0 16 16" fill="#FFFFFF" style="display: block; pointer-events: none;">
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
    </svg>
  `;

  // Captura de Parâmetros UTM e Origem
  function getTrafficSource() {
    const params = new URLSearchParams(window.location.search);
    const ref = document.referrer.toLowerCase();
    let origin = 'Direto / Orgânico';

    if (params.get('utm_source')) {
      const src = params.get('utm_source').toLowerCase();
      if (src.includes('facebook') || src.includes('meta') || src.includes('instagram')) origin = 'Meta Ads';
      else if (src.includes('google')) origin = 'Google Ads';
      else origin = params.get('utm_source');
    } else if (ref.includes('facebook.com') || ref.includes('instagram.com')) {
      origin = 'Meta Ads (Referral)';
    } else if (ref.includes('google.com')) {
      origin = 'Google Ads / Pesquisa';
    }

    return {
      origin,
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmContent: params.get('utm_content') || '',
      utmTerm: params.get('utm_term') || ''
    };
  }

  // Enviar Lead para o Pinas Kit e Exibir Confirmação de Sucesso
  function handleLeadSubmission(data, sourceContainer) {
    const traffic = getTrafficSource();
    const score = data.score || 30;
    const temp = score >= 35 ? 'Quente' : score >= 20 ? 'Morno' : 'Frio';

    const newLead = {
      id: 'lead-' + Date.now(),
      name: data.name,
      phone: data.phone,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '')}@cliente.com`,
      button: activeConfig.name,
      origin: traffic.origin,
      campaign: traffic.utmCampaign || 'Tráfego Pago',
      utmSource: traffic.utmSource,
      utmMedium: traffic.utmMedium,
      utmCampaign: traffic.utmCampaign,
      utmContent: traffic.utmContent,
      utmTerm: traffic.utmTerm,
      temperature: temp,
      score: score,
      interactions: 1,
      lastVisit: 'Agora mesmo',
      stage: 'Novo',
      qualQuestion: activeConfig.formConfig.questionLabel,
      qualAnswer: data.selectedOptionLabel + ` (+${score} pts)`,
      userMessage: data.customMessage || 'Vim pelo site e gostaria de atendimento.'
    };

    // Salva localmente no CRM se estiver no mesmo navegador/domínio
    try {
      const savedLeads = localStorage.getItem('pk_leads');
      const leads = savedLeads ? JSON.parse(savedLeads) : [];
      leads.unshift(newLead);
      localStorage.setItem('pk_leads', JSON.stringify(leads));

      // Atualiza contadores do botão correspondente
      const savedButtons = localStorage.getItem('pk_buttons');
      if (savedButtons) {
        const buttons = JSON.parse(savedButtons);
        const b = buttons.find(item => item.id === buttonId || item.name === activeConfig.name);
        if (b) {
          b.leadsCount = (b.leadsCount || 0) + 1;
          b.clicks = (b.clicks || 0) + 1;
          localStorage.setItem('pk_buttons', JSON.stringify(buttons));
        }
      }
    } catch (_) {}

    // Exibe tela de confirmação de sucesso no próprio formulário
    if (sourceContainer) {
      const isPopup = sourceContainer.id === 'pk-embed-popup';
      if (isPopup) {
        sourceContainer.innerHTML = `
          <div style="text-align: center; padding: 24px 12px; animation: pkEmbedPop 0.3s ease-out;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #D1FAE5; color: #10B981; display: grid; place-items: center; margin: 0 auto 12px; font-size: 24px; font-weight: 800; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">
              ✓
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">
              Contato Recebido!
            </h4>
            <p style="font-size: 13px; color: #475569; margin: 0 0 16px 0; line-height: 1.5;">
              Obrigado, <strong>${data.name}</strong>! Recebemos suas informações com total sigilo. Entraremos em contato via WhatsApp em breve.
            </p>
            <button type="button" id="pk-embed-close-success" style="padding: 7px 18px; font-size: 12.5px; font-weight: 600; border-radius: 8px; border: 1px solid #CBD5E1; background: #F8FAFC; color: #334155; cursor: pointer;">
              Fechar
            </button>
          </div>
        `;
        document.getElementById('pk-embed-close-success')?.addEventListener('click', () => {
          sourceContainer.classList.remove('is-open');
        });
      } else {
        sourceContainer.innerHTML = `
          <div class="pk-embed-success-box" style="text-align: center; padding: 48px 24px; animation: pkEmbedPop 0.3s ease-out;">
            <div style="width: 58px; height: 58px; border-radius: 50%; background: #D1FAE5; color: #10B981; display: grid; place-items: center; margin: 0 auto 16px; font-size: 28px; font-weight: 800; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);">
              ✓
            </div>
            <h3 style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
              Aplicação enviada com sucesso!
            </h3>
            <p style="font-size: 14.5px; color: #475569; max-width: 440px; margin: 0 auto 18px auto; line-height: 1.6;">
              Obrigado, <strong>${data.name}</strong>! Recebemos suas informações com total sigilo profissional. Entraremos em contato com você via WhatsApp em breve.
            </p>
            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 20px; background: #F1F5F9; font-size: 12.5px; color: #64748B;">
              <span>🔒</span>
              <span>Atendimento 100% individual e sigiloso</span>
            </div>
          </div>
        `;
      }
    }
  }

  // 4. Injetar o Botão Flutuante de WhatsApp (No canto da tela)
  const floatingWrap = document.createElement('div');
  floatingWrap.className = 'pk-embed-floating-wrap';
  floatingWrap.id = 'pk-embed-floating-wrap';

  floatingWrap.innerHTML = `
    <!-- Balão Popup -->
    <div class="pk-embed-popup" id="pk-embed-popup">
      <div class="pk-embed-popup-header">
        <div>
          <h4 class="pk-embed-popup-title">${activeConfig.name}</h4>
          <span class="pk-embed-popup-status">● Online no WhatsApp</span>
        </div>
        <span id="pk-embed-close-popup" style="cursor: pointer; font-size: 14px; color: #94A3B8;">✕</span>
      </div>

      <p style="font-size: 12px; color: #64748B; margin: 0 0 10px 0; line-height: 1.4;">
        ${activeConfig.greeting}
      </p>

      <form id="pk-embed-floating-form">
        <input type="text" class="pk-embed-input" id="pk-float-name" placeholder="Seu nome completo *" required />
        <input type="tel" class="pk-embed-input" id="pk-float-phone" placeholder="WhatsApp com DDD (Ex: 11999999999) *" required />
        
        <label style="font-size: 11.5px; font-weight: 600; color: #475569; display: block; margin-bottom: 4px;">
          ${activeConfig.formConfig.questionLabel}
        </label>
        <select class="pk-embed-input" id="pk-float-option" style="cursor: pointer;" required>
          ${activeConfig.formConfig.options.map((opt, i) => `
            <option value="${opt.id}" data-score="${opt.score}" data-label="${opt.label}" ${i === 0 ? 'selected' : ''}>
              ${opt.label} (${opt.badge || ''})
            </option>
          `).join('')}
        </select>

        <button type="submit" class="pk-embed-submit-btn">
          ${WHATSAPP_SVG.replace('width="32" height="32"', 'width="18" height="18"')}
          <span>${activeConfig.ctaText}</span>
        </button>
      </form>
    </div>

    <!-- Botão Circular Verde -->
    <div class="pk-embed-floating-btn" id="pk-embed-trigger-btn" title="Falar no WhatsApp">
      ${WHATSAPP_SVG}
    </div>
  `;

  document.body.appendChild(floatingWrap);

  // Eventos do Botão Flutuante
  const triggerBtn = document.getElementById('pk-embed-trigger-btn');
  const popup = document.getElementById('pk-embed-popup');
  const closeBtn = document.getElementById('pk-embed-close-popup');

  triggerBtn.addEventListener('click', () => {
    popup.classList.toggle('is-open');
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.remove('is-open');
  });

  document.getElementById('pk-embed-floating-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const optEl = document.getElementById('pk-float-option');
    const selectedOpt = optEl ? optEl.options[optEl.selectedIndex] : null;

    handleLeadSubmission({
      name: document.getElementById('pk-float-name').value.trim(),
      phone: document.getElementById('pk-float-phone').value.trim(),
      selectedOptionLabel: selectedOpt ? selectedOpt.getAttribute('data-label') : 'Contato Geral',
      score: selectedOpt ? (parseInt(selectedOpt.getAttribute('data-score'), 10) || 30) : 30
    }, popup);
  });

  // 5. Injetar o Formulário de Qualificação na Página
  // Se existir um container específico <div id="pinaskit-form"></div>, renderiza nele;
  // Caso contrário, injeta obrigatoriamente ACIMA do rodapé (footer).
  const existingFormEl = document.getElementById('pinaskit-form');
  const isAutoInjected = !existingFormEl;
  let targetContainer = existingFormEl;

  if (!targetContainer) {
    targetContainer = document.createElement('div');
    targetContainer.id = 'pinaskit-form';

    // Busca tags ou classes comuns de rodapé para injetar SEMPRE acima dele
    const footer = document.querySelector('footer, .footer, #footer, [role="contentinfo"], .site-footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(targetContainer, footer);
    } else {
      document.body.appendChild(targetContainer);
    }
  }

  // Verifica se o container já possui um título no elemento pai para evitar duplicidade de cabeçalho
  const parentCard = targetContainer.closest('.form-container, .card, .application-card, section, form, div');
  const hasOuterHeading = Boolean(
    targetContainer.previousElementSibling?.matches('h1, h2, h3, h4, header') ||
    (parentCard && parentCard.querySelector('h1, h2, h3'))
  );

  targetContainer.innerHTML = `
    <div class="pk-embed-page-form-section ${isAutoInjected ? 'is-standalone' : ''}">
      ${(isAutoInjected || !hasOuterHeading) ? `
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 11.5px; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.5px;">
            Atendimento Direto no WhatsApp
          </span>
          <h3 style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 6px 0 8px 0;">
            ${activeConfig.formConfig.title}
          </h3>
          <p style="font-size: 13.5px; color: #64748B; margin: 0;">
            ${activeConfig.formConfig.subtitle}
          </p>
        </div>
      ` : ''}

      <form id="pk-embed-page-form" style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">Seu Nome Completo *</label>
          <input type="text" id="pk-page-name" class="pk-embed-input" placeholder="Ex: Mariana Silva" required />
        </div>

        <div>
          <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">Seu WhatsApp com DDD *</label>
          <input type="tel" id="pk-page-phone" class="pk-embed-input" placeholder="Ex: (11) 98765-4321" required />
        </div>

        <div>
          <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">
            ${activeConfig.formConfig.questionLabel} *
          </label>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${activeConfig.formConfig.options.map((opt, i) => `
              <label class="pk-embed-option-card ${i === 0 ? 'is-selected' : ''}" style="all: unset !important; display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 11px 14px !important; border: 1.5px solid ${i === 0 ? '#7C3AED' : '#E2E8F0'} !important; border-radius: 10px !important; cursor: pointer !important; background: ${i === 0 ? 'rgba(124, 58, 237, 0.05)' : '#F8FAFC'} !important; box-sizing: border-box !important; margin: 0 !important; transition: all 150ms ease !important;">
                <div style="display: flex; align-items: center; gap: 10px; overflow: hidden; flex: 1;">
                  <input 
                    type="radio" 
                    class="pk-embed-radio" 
                    name="pk-page-option" 
                    value="${opt.id}" 
                    data-score="${opt.score}" 
                    data-label="${opt.label}" 
                    ${i === 0 ? 'checked' : ''} 
                    style="all: unset !important; -webkit-appearance: none !important; appearance: none !important; width: 18px !important; min-width: 18px !important; max-width: 18px !important; height: 18px !important; min-height: 18px !important; max-height: 18px !important; border-radius: 50% !important; border: 2px solid ${i === 0 ? '#7C3AED' : '#CBD5E1'} !important; background-color: #FFFFFF !important; margin: 0 !important; padding: 0 !important; display: inline-grid !important; place-content: center !important; flex-shrink: 0 !important; cursor: pointer !important; box-sizing: border-box !important;"
                  />
                  <span style="font-size: 13.5px; font-weight: 500; color: #1E293B; line-height: 1.4;">${opt.label}</span>
                </div>
                <span style="font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; background: #EDE9FE; color: #7C3AED; white-space: nowrap; flex-shrink: 0;">
                  ${opt.badge || '⭐'}
                </span>
              </label>
            `).join('')}
          </div>
        </div>

        <button type="submit" class="pk-embed-submit-btn">
          <span>${activeConfig.formConfig.buttonText || 'Enviar Aplicação'}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="pointer-events: none;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </form>
    </div>
  `;

  // Reatividade visual ao selecionar opções (compatível com todos os navegadores)
  targetContainer.querySelectorAll('input[name="pk-page-option"]').forEach(radio => {
    radio.addEventListener('change', () => {
      targetContainer.querySelectorAll('.pk-embed-option-card').forEach(c => {
        c.classList.remove('is-selected');
        c.style.setProperty('border-color', '#E2E8F0', 'important');
        c.style.setProperty('background', '#F8FAFC', 'important');
        const r = c.querySelector('input[type="radio"]');
        if (r) r.style.setProperty('border-color', '#CBD5E1', 'important');
      });
      const card = radio.closest('.pk-embed-option-card');
      if (card) {
        card.classList.add('is-selected');
        card.style.setProperty('border-color', '#7C3AED', 'important');
        card.style.setProperty('background', 'rgba(124, 58, 237, 0.05)', 'important');
        radio.style.setProperty('border-color', '#7C3AED', 'important');
      }
    });
  });

  const pageForm = document.getElementById('pk-embed-page-form');
  if (pageForm) {
    pageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkedRadio = document.querySelector('input[name="pk-page-option"]:checked');
      const pageSection = targetContainer.querySelector('.pk-embed-page-form-section') || targetContainer;

      handleLeadSubmission({
        name: document.getElementById('pk-page-name').value.trim(),
        phone: document.getElementById('pk-page-phone').value.trim(),
        selectedOptionLabel: checkedRadio ? checkedRadio.getAttribute('data-label') : 'Aplicação',
        score: checkedRadio ? (parseInt(checkedRadio.getAttribute('data-score'), 10) || 30) : 30,
        customMessage: 'Aplicação direta via formulário do site.'
      }, pageSection);
    });
  }

  // Suporte a captura transparente de formulários nativos existentes no site
  document.querySelectorAll('form[data-pinaskit-capture]').forEach(nativeForm => {
    nativeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = nativeForm.querySelector('input[name*="name"], input[name*="nome"], input[type="text"]');
      const phoneInput = nativeForm.querySelector('input[name*="phone"], input[name*="whatsapp"], input[name*="tel"], input[type="tel"]');
      const selectEl = nativeForm.querySelector('select');
      const textEl = nativeForm.querySelector('textarea');

      handleLeadSubmission({
        name: nameInput ? nameInput.value.trim() : 'Visitante do Site',
        phone: phoneInput ? phoneInput.value.trim() : '',
        selectedOptionLabel: selectEl ? (selectEl.options[selectEl.selectedIndex]?.text || 'Aplicação') : 'Aplicação',
        score: 35,
        customMessage: textEl ? textEl.value.trim() : ''
      }, nativeForm);
    });
  });

  console.log(`%c[Pinas Kit] Widget ativo para ${activeConfig.name}!`, 'color: #25D366; font-weight: bold;');
})();
