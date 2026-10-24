/* ==========================================================================
   PINAS KIT — LANDING PAGE OFICIAL (MODELO D: ASSISTIDO E DIDÁTICO)
   ========================================================================== */

export function renderLandingPage() {
  return `
    <main id="landing-page-view">
      <!-- 1. HERO SECTION -->
      <section class="pk-hero-section" id="inicio">
        <div class="pk-hero-container">
          <!-- Coluna Esquerda: Mensagem Clara & Acolhedora -->
          <div class="pk-hero-content">
            <div class="pk-hero-badges">
              <span class="pk-badge pk-badge-purple">Mais Leads</span>
              <span class="pk-badge pk-badge-purple">Mais Clientes</span>
              <span class="pk-badge pk-badge-purple">Mais Resultados</span>
            </div>

            <h1 class="pk-hero-title">
              Seu negócio organizado e sem complicação.
            </h1>

            <p class="pk-hero-subtitle">
              O Pinas Kit é um CRM simples que reúne seus leads, conversas e vendas em um só lugar. Feito para quem quer crescer, mesmo sem ter experiência com softwares.
            </p>

            <div class="pk-hero-ctas">
              <button class="pk-btn pk-btn-primary pk-btn-lg" id="btn-hero-start">
                Começar agora, é grátis →
              </button>
              <button class="pk-btn pk-btn-outline pk-btn-lg" id="btn-hero-demo">
                ▶ Ver como funciona (1 min)
              </button>
            </div>

            <div class="pk-hero-trust">
              <span class="pk-trust-item"><span class="pk-trust-check">✓</span> Fácil de usar</span>
              <span class="pk-trust-item"><span class="pk-trust-check">✓</span> Suporte em português</span>
              <span class="pk-trust-item"><span class="pk-trust-check">✓</span> Funciona no celular e computador</span>
            </div>

            <!-- 3 Cards Rápidos Abaixo do Hero -->
            <div class="pk-hero-quick-cards">
              <div class="pk-quick-card">
                <div class="pk-quick-card-icon" style="background-color: var(--pk-success-light); color: var(--pk-success);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <span class="pk-quick-card-title">Conecte seus anúncios</span>
              </div>

              <div class="pk-quick-card">
                <div class="pk-quick-card-icon" style="background-color: var(--pk-primary-light); color: var(--pk-primary);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <span class="pk-quick-card-title">Receba seus leads</span>
              </div>

              <div class="pk-quick-card">
                <div class="pk-quick-card-icon" style="background-color: var(--pk-success-light); color: var(--pk-success);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <span class="pk-quick-card-title">Acompanhe suas vendas</span>
              </div>
            </div>
          </div>

          <!-- Coluna Direita: Fotografia Acolhedora Humanizada -->
          <div class="pk-hero-media">
            <div class="pk-hero-glow"></div>
            <div class="pk-hero-avatar-card">
              <img src="/assets/images/hero-avatar.jpg" alt="Profissional sorrindo com Pinas Kit" class="pk-hero-img" id="hero-human-avatar"/>
            </div>
            <div class="pk-floating-badge">
              <span>Tudo o que você precisa em um só lugar. 💜</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. SEÇÃO: COMO FUNCIONA (3 PASSOS SIMPLES) -->
      <section class="pk-card" id="como-funciona" style="max-width: 1280px; margin: 0 auto 64px; border-radius: var(--pk-radius-2xl);">
        <div style="text-align: center; max-width: 600px; margin: 0 auto 40px;">
          <span class="pk-badge pk-badge-purple">Simples do início ao fim</span>
          <h2 style="font-size: 32px; font-weight: 700; margin-top: 12px; color: var(--pk-text-primary);">
            Do botão ao lead em três passos
          </h2>
          <p style="color: var(--pk-text-secondary); margin-top: 8px;">
            Você não precisa ser especialista em informática para colocar no ar.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <!-- Passo 1 -->
          <div style="padding: 24px; border-radius: var(--pk-radius-lg); background-color: var(--pk-bg-subtle); border-left: 4px solid var(--pk-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <span style="font-size: 28px; font-weight: 800; color: var(--pk-primary);">01</span>
              <div style="width: 40px; height: 40px; border-radius: var(--pk-radius-full); background: var(--pk-primary-light); color: var(--pk-primary); display: grid; place-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 8px;">Crie seu botão ou formulário</h3>
            <p style="font-size: 14px; color: var(--pk-text-secondary); line-height: 1.5;">Escolha seu número de WhatsApp, as opções de perguntas e as cores da sua marca.</p>
          </div>

          <!-- Passo 2 -->
          <div style="padding: 24px; border-radius: var(--pk-radius-lg); background-color: var(--pk-bg-subtle); border-left: 4px solid var(--pk-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <span style="font-size: 28px; font-weight: 800; color: var(--pk-primary);">02</span>
              <div style="width: 40px; height: 40px; border-radius: var(--pk-radius-full); background: var(--pk-primary-light); color: var(--pk-primary); display: grid; place-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 8px;">Cole uma linha no seu site</h3>
            <p style="font-size: 14px; color: var(--pk-text-secondary); line-height: 1.5;">Basta copiar um código simples e colar no seu WordPress, Wix ou enviar para quem fez seu site.</p>
          </div>

          <!-- Passo 3 -->
          <div style="padding: 24px; border-radius: var(--pk-radius-lg); background-color: var(--pk-bg-subtle); border-left: 4px solid var(--pk-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <span style="font-size: 28px; font-weight: 800; color: var(--pk-primary);">03</span>
              <div style="width: 40px; height: 40px; border-radius: var(--pk-radius-full); background: var(--pk-primary-light); color: var(--pk-primary); display: grid; place-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 8px;">Acompanhe tudo no painel</h3>
            <p style="font-size: 14px; color: var(--pk-text-secondary); line-height: 1.5;">Veja quem clicou, de qual anúncio veio e atenda no WhatsApp já sabendo exatamente o que a pessoa quer.</p>
          </div>
        </div>

        <!-- SIMULAÇÃO VISUAL: COMO O BOTÃO APARECE NO SITE DO CLIENTE -->
        <div style="margin-top: 48px; background-color: var(--pk-bg-subtle); border: 2px dashed var(--pk-border); border-radius: var(--pk-radius-xl); padding: 32px 24px; text-align: center;">
          <span class="pk-badge pk-badge-purple" style="margin-bottom: 8px;">Demonstração no Site do Cliente</span>
          <h3 style="font-size: 22px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 8px;">
            Veja como seus visitantes interagem com o botão
          </h3>
          <p style="font-size: 14px; color: var(--pk-text-secondary); max-width: 600px; margin: 0 auto 24px;">
            Este é um exemplo de como o botão do Pinas Kit fica instalado no canto da página do seu negócio. Ao clicar, o formulário de qualificação abre na hora!
          </p>

          <!-- Janela Simulada de Navegador -->
          <div style="max-width: 760px; margin: 0 auto; background-color: var(--pk-bg-surface); border: 1px solid var(--pk-border); border-radius: var(--pk-radius-lg); box-shadow: var(--pk-shadow-md); overflow: hidden; text-align: left; position: relative;">
            <div style="background-color: var(--pk-bg-subtle); padding: 10px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--pk-border); font-size: 12px; color: var(--pk-text-muted);">
              <span style="display: inline-flex; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444;"></span><span style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B;"></span><span style="width: 10px; height: 10px; border-radius: 50%; background: #10B981;"></span></span>
              <span style="background: var(--pk-bg-card); padding: 2px 12px; border-radius: 4px; font-family: monospace; font-size: 11px;">https://suaclinica.com.br</span>
            </div>
            
            <div style="padding: 36px 28px; min-height: 200px; position: relative;">
              <h4 style="font-size: 20px; font-weight: 700; color: var(--pk-text-primary); margin-bottom: 6px;">Clínica Médica & Estética Integrada</h4>
              <p style="font-size: 13px; color: var(--pk-text-secondary); max-width: 460px;">Tratamentos personalizados para realçar sua autoestima com segurança e tecnologia avançada.</p>
              
              <!-- Botão Flutuante do WhatsApp do Pinas Kit -->
              <div style="position: absolute; bottom: 20px; right: 20px; display: flex; align-items: center; gap: 10px;">
                <span class="pk-badge pk-badge-purple" style="font-size: 11px; box-shadow: var(--pk-shadow-sm);">
                  Experimente clicar 👇
                </span>
                <button class="pk-btn pk-btn-whatsapp" id="btn-mock-client-site-widget" style="border-radius: var(--pk-radius-full); padding: 12px 18px; box-shadow: var(--pk-shadow-lg); font-size: 14px;">
                  💬 Fale no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. DEMONSTRAÇÃO VIVA DO PAINEL (MOCKUP INTERATIVO) -->
      <section style="max-width: 1280px; margin: 0 auto 64px; padding: 0 24px;" id="beneficios">
        <div style="background-color: var(--pk-bg-card); border: 1px solid var(--pk-border); border-radius: var(--pk-radius-2xl); padding: 36px; box-shadow: var(--pk-shadow-lg);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--pk-border); padding-bottom: 20px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="pk-badge pk-badge-green" style="margin-bottom: 6px;">● Sistema em Tempo Real</span>
              <h3 style="font-size: 24px; font-weight: 700; color: var(--pk-text-primary);">De onde vêm suas conversas do WhatsApp?</h3>
            </div>
            <button class="pk-btn pk-btn-primary pk-btn-sm" id="btn-open-dash-preview">
              Ver Painel Completo da Mariana →
            </button>
          </div>

          <!-- Barras de Distribuição ao Vivo -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
            <div style="padding: 20px; border-radius: var(--pk-radius-lg); background-color: var(--pk-bg-subtle);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: 600; font-size: 14px;">🤖 ChatGPT / IA</span>
                <span style="font-weight: 700; color: var(--pk-primary);">42 leads (38%)</span>
              </div>
              <div class="pk-progress-bar-container"><div class="pk-progress-bar-fill" style="width: 38%;"></div></div>
            </div>

            <div style="padding: 20px; border-radius: var(--pk-radius-lg); background-color: var(--pk-bg-subtle);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: 600; font-size: 14px;">🔍 Google Ads</span>
                <span style="font-weight: 700; color: var(--pk-info);">35 leads (31%)</span>
              </div>
              <div class="pk-progress-bar-container"><div class="pk-progress-bar-fill" style="width: 31%; background: var(--pk-info);"></div></div>
            </div>

            <div style="padding: 20px; border-radius: var(--pk-radius-lg); background-color: var(--pk-bg-subtle);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: 600; font-size: 14px;">📸 Meta Ads (Instagram)</span>
                <span style="font-weight: 700; color: var(--pk-primary);">34 leads (31%)</span>
              </div>
              <div class="pk-progress-bar-container"><div class="pk-progress-bar-fill" style="width: 31%; background: #0866FF;"></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. TABELA DE PREÇOS -->
      <section style="max-width: 900px; margin: 0 auto 80px; padding: 0 24px; text-align: center;" id="precos">
        <span class="pk-badge pk-badge-purple">Um plano. Tudo incluído.</span>
        <h2 style="font-size: 36px; font-weight: 800; color: var(--pk-text-primary); margin: 12px 0;">Plano Essencial</h2>
        <p style="color: var(--pk-text-secondary); margin-bottom: 28px;">Sem pegadinhas, sem limites ocultos. Cancele quando quiser.</p>

        <!-- Alternador Mensal / Anual -->
        <div style="display: inline-flex; align-items: center; gap: 12px; background-color: var(--pk-bg-card); padding: 8px 16px; border-radius: var(--pk-radius-full); border: 1px solid var(--pk-border); margin-bottom: 32px;">
          <span style="font-size: 14px; font-weight: 600;" id="billing-monthly-label">Mensal</span>
          <button id="btn-toggle-billing" style="width: 50px; height: 26px; border-radius: 999px; background-color: var(--pk-primary); position: relative; padding: 3px; cursor: pointer;">
            <div id="billing-toggle-dot" style="width: 20px; height: 20px; border-radius: 50%; background-color: white; transform: translateX(24px); transition: transform 200ms ease;"></div>
          </button>
          <span style="font-size: 14px; font-weight: 600; color: var(--pk-text-primary);" id="billing-annual-label">Anual</span>
          <span class="pk-badge pk-badge-green" style="font-size: 11px;">ECONOMIZE 17%</span>
        </div>

        <!-- Card de Preço -->
        <div class="pk-card" style="border-radius: var(--pk-radius-2xl); padding: 40px; text-align: left; box-shadow: var(--pk-shadow-xl); border: 2px solid var(--pk-primary);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--pk-border); padding-bottom: 24px; margin-bottom: 28px; flex-wrap: wrap; gap: 16px;">
            <div>
              <p style="font-size: 14px; color: var(--pk-text-secondary); margin-bottom: 4px;" id="price-card-period-label">No plano anual</p>
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-size: 48px; font-weight: 800; color: var(--pk-text-primary);" id="price-card-amount">R$ 41,58</span>
                <span style="font-size: 16px; color: var(--pk-text-muted);">/mês</span>
              </div>
              <p style="font-size: 13px; color: var(--pk-text-muted); margin-top: 4px;" id="price-card-subtext">Cobrado R$ 499,00 por ano</p>
            </div>
            <button class="pk-btn pk-btn-primary pk-btn-lg" id="btn-start-pricing" style="width: 100%; max-width: 260px;">
              Começar grátis por 7 dias
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
            <div class="pk-trust-item"><span class="pk-trust-check">✓</span> 7 dias grátis para testar sem risco</div>
            <div class="pk-trust-item"><span class="pk-trust-check">✓</span> Botões e formulários ilimitados</div>
            <div class="pk-trust-item"><span class="pk-trust-check">✓</span> Usuários e vendedores ilimitados</div>
            <div class="pk-trust-item"><span class="pk-trust-check">✓</span> Cliques e leads ilimitados</div>
            <div class="pk-trust-item"><span class="pk-trust-check">✓</span> Rastreio de Google Ads e Meta Ads</div>
            <div class="pk-trust-item"><span class="pk-trust-check">✓</span> Exportação segura para Excel</div>
          </div>
        </div>
      </section>

      <!-- 5. FAQ (PERGUNTAS FREQUENTES) -->
      <section style="max-width: 800px; margin: 0 auto 80px; padding: 0 24px;" id="duvidas">
        <div style="text-align: center; margin-bottom: 36px;">
          <span class="pk-badge pk-badge-purple">Dúvidas Frequentes</span>
          <h2 style="font-size: 32px; font-weight: 700; color: var(--pk-text-primary); margin-top: 8px;">Antes de começar</h2>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;" id="faq-accordion">
          <div class="pk-card faq-item" style="padding: 18px 24px; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 600;">
              <span>Preciso saber programar para instalar?</span>
              <span class="faq-chevron" style="transition: transform 200ms ease;">▼</span>
            </div>
            <p class="faq-answer" style="display: none; margin-top: 12px; font-size: 14px; color: var(--pk-text-secondary); line-height: 1.6;">
              Não! É só copiar uma única linha de código e colar no seu site ou passar para quem cuida do seu site. Funciona em WordPress, Shopify, Wix ou qualquer página.
            </p>
          </div>

          <div class="pk-card faq-item" style="padding: 18px 24px; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 600;">
              <span>O Pinas Kit lê minhas conversas pessoais?</span>
              <span class="faq-chevron" style="transition: transform 200ms ease;">▼</span>
            </div>
            <p class="faq-answer" style="display: none; margin-top: 12px; font-size: 14px; color: var(--pk-text-secondary); line-height: 1.6;">
              Absolutamente não! O Pinas Kit apenas organiza o momento em que a pessoa clica para entrar em contato no seu site. Sua conversa continua 100% privada dentro do seu WhatsApp.
            </p>
          </div>

          <div class="pk-card faq-item" style="padding: 18px 24px; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 600;">
              <span>Como funciona em relação à LGPD?</span>
              <span class="faq-chevron" style="transition: transform 200ms ease;">▼</span>
            </div>
            <p class="faq-answer" style="display: none; margin-top: 12px; font-size: 14px; color: var(--pk-text-secondary); line-height: 1.6;">
              Estamos 100% em conformidade com a LGPD. Todos os dados são criptografados com o protocolo AES-256 e você tem total controle para anonimizar ou excluir dados a qualquer momento.
            </p>
          </div>

          <div class="pk-card faq-item" style="padding: 18px 24px; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 600;">
              <span>Posso cancelar quando quiser?</span>
              <span class="faq-chevron" style="transition: transform 200ms ease;">▼</span>
            </div>
            <p class="faq-answer" style="display: none; margin-top: 12px; font-size: 14px; color: var(--pk-text-secondary); line-height: 1.6;">
              Sim! Você tem 7 dias grátis sem precisar de cartão de crédito. Se assinar e depois quiser cancelar, faz isso com um único clique no painel sem burocracia.
            </p>
          </div>
        </div>
      </section>

      <!-- 6. RODAPÉ INSTITUCIONAL -->
      <footer style="border-top: 1px solid var(--pk-border); padding: 48px 24px; background-color: var(--pk-bg-surface);">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;">
          <div>
            <div class="pk-logo" style="margin-bottom: 6px;">
              <div class="pk-logo-icon">P</div>
              <span>Pinas Kit</span>
            </div>
            <p style="font-size: 13px; color: var(--pk-text-muted);">Origem clara. Conversas que viram negócio.</p>
          </div>
          <div style="display: flex; gap: 24px; font-size: 13px; color: var(--pk-text-secondary);">
            <a href="#inicio" style="hover:color: var(--pk-primary);">Início</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#precos">Planos</a>
            <a href="#duvidas">Dúvidas</a>
            <span>Segurança AES-256 🔒</span>
          </div>
        </div>
      </footer>
    </main>
  `;
}
