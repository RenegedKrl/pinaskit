# 🛡️ Plano Mestre de Engenharia, Design & Negócio — Pinas Kit v7.0
> **A Plataforma Definitiva de Atribuição de Tráfego, Modais de Qualificação Dinâmicos, Integração Multi-Tenant com Meta & Google Ads por Cliente, Landing Page de Alta Conversão e Cibersegurança Blindada.**
> **Padrão Oficial de Experiência: Modelo D — Assistido, Didático, Premium e Extremamente Intuitivo.**

---

## 🔒 REGRA OBRIGATÓRIA E PERMANENTE DO PROJETO: PROTOCOLO DE AUDITORIA CONTÍNUA DE SEGURANÇA
*(Diretriz mandatória e inegociável para toda e qualquer alteração de código)*

> **REGRA DE OURO:** A cada nova modificação, refatoração de código, adição de novas telas, componentes ou endpoints de API, o agente/desenvolvedor deve **obrigatoriamente testar e auditar todas as camadas de segurança** e verificar se alguma proteção foi quebrada, fragilizada ou se gerou vulnerabilidades.

### Checklist Mandatório de Verificação de Regressão de Segurança:
1. **[Isolamento Multi-Tenant & RLS]:** O `workspace_id` continua sendo estritamente validado em 100% das queries no banco? É impossível para o Usuário A forçar a leitura ou alteração de leads, campanhas e tokens do Usuário B?
2. **[Criptografia de Envelope AES-256-GCM]:** Todos os telefones, e-mails, nomes, respostas de formulários e **Tokens de API da Meta/Google** continuam sendo criptografados antes de salvar no disco?
3. **[Subscription Gatekeeper]:** Se a assinatura do cliente expirar, for cancelada ou estiver em atraso, a descriptografia e a exportação continuam sendo bloqueadas com código `403 Payment Required`?
4. **[Whitelist de Domínios & CORS Estrito]:** A API continua rejeitando conexões e submissões enviadas de origens (`Origin` / `Referer`) não autorizadas pelo assinante?
5. **[Defesa Anti-Bot & Anti-Spam]:** O HoneyPot invisível, a validação de tempo de preenchimento (< 800ms) e o Rate Limiting por IP continuam ativos e funcionais?
6. **[Zero Vazamento de PII em Logs]:** Algum dado pessoal sensível (telefone, e-mail) ou token de anúncio está sendo impresso em logs de servidor, mensagens de erro ou console do navegador?
7. **[Assinatura Criptográfica de Webhooks]:** Todos os webhooks externos (Asaas/Stripe e n8n) estão validando a assinatura criptográfica (`HMAC-SHA256`) antes de processar qualquer alteração de status?

---

## 💎 REGRA OBRIGATÓRIA E PERMANENTE DO PROJETO: PROTOCOLO ZERO-BUG & TESTE INTEGRAL DE UI/UX
*(Diretriz mandatória de qualidade visual e funcional)*

> **REGRA DE ZERO-BUG:** A cada novo sistema criado, tela implementada ou alteração efetuada, o desenvolvedor deve **obrigatoriamente testar e analisar**:
> 1. **Botões e Ações:** Todos os botões, links, dropdowns, modais e transições devem ser clicados e testados funcionalmente.
> 2. **Escritas e Textos:** Verificar ortografia, clareza, pontuação, contraste e linguagem didática sem jargões.
> 3. **Aparência Visual & Responsividade:** Testar como a tela se comporta em telas Desktop e Mobile (sem cortes, sem quebras de layout, sem rolagem horizontal indevida).
> 4. **Console & Erros de Execução:** Inspecionar o console para garantir ZERO erros de JavaScript, warnings ou quebras de renderização.

---

# PARTE I — FILOSOFIA & IDENTIDADE UI/UX (MODELO D: ASSISTIDO E DIDÁTICO)

## 1. Filosofia Central: Zero Complexidade Desnecessária

> **Premissa Inegociável:** *Uma interface bonita que o cliente não consegue utilizar é uma interface ruim.*

O Pinas Kit foi desenhado especificamente para pessoas que:
- Nunca utilizaram um CRM na vida.
- Não sabem o que significa lead, funil, pixel, UTM ou campanha.
- Possuem pouca familiaridade com tecnologia e usam principalmente o celular.
- Precisam administrar um negócio físico ou consultório enquanto atendem clientes.

Toda interface do Pinas Kit responde visualmente e sem jargões a quatro perguntas básicas:
1. **Onde estou?** (Título claro e objetivo)
2. **O que estou vendo?** (Explicação curta da finalidade)
3. **O que preciso fazer agora?** (Ação principal evidente)
4. **O que acontecerá se eu clicar?** (Feedback claro e previsível)

### Guia de Tradução de Linguagem:
* ❌ *Evitar:* "Configure sua integração OAuth para sincronização de métricas multicanal."
*  *Preferir:* **"Conecte sua conta de anúncios para descobrir quanto você está gastando para conquistar novos contatos."**
* ❌ *Evitar:* "Gerenciar pipeline de oportunidades e leads qualificados."
*  *Preferir:* **"Organize seus possíveis clientes por etapa de atendimento."**
* ❌ *Evitar:* "Parâmetro UTM Source."
*  *Preferir:* **"De onde veio este contato?"**

---

## 2. Identidade Visual Oficial & Design System

A identidade visual do Pinas Kit une a simplicidade do **Notion**, a organização moderna do **Linear**, a familiaridade do **WhatsApp** e a sofisticação visual de um SaaS internacional de elite.

### 2.1. Paleta de Cores Harmônica Oficial

| Elemento | Código Hex | Finalidade e Aplicação |
| :--- | :--- | :--- |
| **Violeta Principal** | `#7C3AED` | Ações principais, botões de destaque e identidade da marca |
| **Violeta Secundário** | `#8B5CF6` | Gradientes, hovers e destaques ativos |
| **Violeta Claro / Lavanda** | `#EDE9FE` | Fundos de cards em destaque, pílulas de status e seleções |
| **Fundo Claro Principal** | `#F8F7FC` | Fundo geral da aplicação no Modo Claro (levemente lilás/cinza) |
| **Superfície Branca** | `#FFFFFF` | Cards, modais e superfícies de conteúdo |
| **Texto Principal** | `#18152C` | Tipografia de títulos e textos com alto contraste |
| **Texto Secundário** | `#57536B` | Subtítulos, explicações e microcopys auxiliares |
| **Verde de Sucesso / Zap** | `#10B981` | Ações de WhatsApp, métricas positivas e confirmações |
| **Fundo Verde Suave** | `#D1FAE5` | Badges de sucesso e tags "Em conversa" |
| **Azul Informativo** | `#2563EB` | Dicas, integrações com Google e orientações |
| **Amarelo de Atenção** | `#F59E0B` | Pendências, avisos e etapas em andamento |
| **Vermelho de Alerta / Ruby** | `#DC2626` | Badges de Lead Quente 🔥, erros e ações destrutivas |
| **Preto Profundo (Dark Mode)**| `#09090B` | Fundo do Modo Escuro elegante |

### 2.2. Tipografia Oficial
* **Fonte Principal:** **Poppins** (Google Fonts).
  - Títulos: Poppins SemiBold (600) ou Bold (700).
  - Subtítulos e Botões: Poppins Medium (500) ou SemiBold (600).
  - Textos de Apoio: Poppins Regular (400) ou Medium (500).
  - Tabelas e Números Densos: **Inter** (quando necessário para máxima legibilidade numérica).
* **Escala de Tamanhos:**
  - Título Principal (Landing Page): 44px a 56px (desktop) / 32px (mobile).
  - Título de Página / Dashboard: 26px a 30px.
  - Título de Seções / Cards: 18px a 20px.
  - Texto de Leitura Comum: 16px (mínimo de 14px em mobile para acessibilidade).

### 2.3. Sistema de Tema Claro e Escuro (Light & Dark Theme Engine)
* **Padrão Oficial do Modelo D:** O **Tema Claro** (`#F8F7FC` com superfícies `#FFFFFF` e violeta `#7C3AED`) é a experiência padrão nativa.
* **Modo Escuro Completo:** O sistema possui alternador imediato (Sol / Lua) no topo da Landing Page e do Painel, adaptando todas as superfícies para `#09090B` com contraste preservado e transição suave de `300ms` sem piscar a tela (zero flicker).

---

# PARTE II — A EXPERIÊNCIA DO PRODUTO TINTIM POR TINTIM

## 3. A Landing Page Pública Oficial (Vitrine de Vendas de Alta Conversão)
*(Baseada fielmente no Painel 1 da referência visual Modelo D)*

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE OFICIAL — PINAS KIT                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Header: Logo Pinas Kit + [Funcionalidades] [Preços] [Depoimentos] + [Começar agora]   │
│                                                                                        │
│ Hero Section:                                                                          │
│  [MAIS LEADS]  [MAIS CLIENTES]  [MAIS RESULTADOS] (Badges pílula violeta claro)        │
│                                                                                        │
│  TÍTULO: "Seu negócio organizado e sem complicação."                                  │
│                                                                                        │
│  SUBTÍTULO: "O Pinas Kit é um CRM simples que reúne seus leads, conversas e vendas em  │
│  um só lugar. Feito para quem quer crescer, mesmo sem ter experiência com softwares."  │
│                                                                                        │
│  CTAs: [ Começar agora, é grátis → ]  (Botão Violeta com sombra suave)                 │
│        [ ▶ Ver como funciona (1 min) ] (Botão texto com ícone play)                    │
│                                                                                        │
│  SELOS: ✓ Fácil de usar   ✓ Suporte em português   ✓ Funciona no celular e computador  │
│                                                                                        │
│  IMAGEM HERO: Fotografia humana acolhedora com badge "Tudo o que você precisa em um só│
│  lugar."                                                                               │
│                                                                                        │
│  3 CARDS RÁPIDOS INFERIORES:                                                           │
│  [ 🟢 Conecte seus anúncios ]   [ 🟣 Receba seus leads ]   [ 🟢 Acompanhe suas vendas ]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. O Dashboard Desktop: O Assistente Visual do Negócio
*(Baseado fielmente no Painel 2 da referência visual Modelo D)*

O Dashboard não é um amontoado confuso de gráficos. Ele funciona como um **copiloto que guia o usuário no dia a dia**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             DASHBOARD DESKTOP — PINAS KIT                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ CABEÇALHO:                                                                             │
│ Olá, Mariana! 👋                                         [🔔 Notificações] [Perfil]     │
│ Vamos continuar configurando seu Pinas Kit?               Mariana - Plano Starter       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ÁREA DE ONBOARDING & PRÓXIMA AÇÃO:                                                     │
│ ┌──────────────────────────────────────┐  ┌──────────────────────────────────────────┐ │
│ │ 👤 Seu início no Pinas Kit           │  │ 💡 Próxima ação recomendada              │ │
│ │ [Barra de Progresso: 2 de 3 concluídos│  │ Conecte sua conta do Facebook Ads para   │ │
│ │                                      │  │ começar a receber seus leads.            │ │
│ │ 1. Conecte seus anúncios         [✓] │  │                                          │ │
│ │ 2. Receba seus leads             [✓] │  │ [ Conectar agora → ]                     │ │
│ │ 3. Acompanhe tudo aqui           [>] │  │                                          │ │
│ └──────────────────────────────────────┘  └──────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4 INDICADORES ESSENCIAIS (Métricas Claras):                                            │
│ ┌───────────────┐ ┌────────────────┐ ┌───────────────┐ ┌─────────────────────────────┐ │
│ │Seus leads hoje│ │Em atendimento  │ │Vendas este mês│ │Investimento em anúncios     │ │
│ │ 24 (↑ 12%)    │ │ 8 (Em tempo real│ │ 5 (↑ 25%)     │ │ R$ 120,00 (↑ 18%)           │ │
│ └───────────────┘ └────────────────┘ └───────────────┘ └─────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ BANNER DE AJUDA GUIADA (Rodapé do Dashboard):                                          │
│ 👩 "Precisa de ajuda? Nossa equipe está pronta para te orientar."                      │
│ [ Falar no WhatsApp ]   [ ▶ Ver tutoriais ]   [ ? Tirar dúvidas ]               [ ✕ ] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### O Componente Dinâmico "O Que Fazer Agora?"
Orientado por regras de negócio reais para que o assinante nunca fique paralisado:
- Se ainda não criou formulário: *"Crie seu primeiro formulário em 2 minutos."*
- Se tem leads novos sem resposta: *"Você tem 3 novos contatos aguardando atendimento no WhatsApp."*
- Se a conta de anúncio desconectou: *"Sua conexão com o Facebook Ads precisa ser renovada."*

---

## 4.1. Módulo "Botões" (Sites, Pastas de Captação e Links com Cota de Plano)
*(O Coração Operacional do Sistema inspirado na CentralKit)*

Como estruturado pelo usuário, a aba **Botões** funciona como o gerenciador central onde cada botão representa um site, página ou campanha específica:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              MÓDULO DE BOTÕES (CENTRALKIT)                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Topo: "Meus Botões & Sites de Captação"                                                │
│ Cota do Plano: "Plano Starter: 3 de 5 botões ativos [═══════════   ] (60% usado)"     │
│ [ + Criar Novo Botão / Site ]                                                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ CARDS DE BOTÕES (SUBPASTAS / SITES):                                                   │
│                                                                                        │
│ 🔘 1. Consulta Médica (Landing Page Principal)                                         │
│    URL do Botão: pinaskit.com.br/b/consulta-medica                                     │
│    Métricas: 342 Cliques │ 28 Leads Capturados │ 8.1% Conversão                        │
│    Destino: WhatsApp +55 11 97537-4960                                                 │
│    [ 📋 Copiar Script ]  [ ⚙️ Personalizar Formulário ]  [ 👁️ Testar ]  [ 📊 Ver Leads ] │
│                                                                                        │
│ 🔘 2. Protocolo Estético — Endolaser                                                   │
│    URL do Botão: pinaskit.com.br/b/endolaser                                           │
│    Métricas: 189 Cliques │ 19 Leads Capturados │ 10.0% Conversão                       │
│    Destino: WhatsApp +55 11 98181-4586                                                 │
│    [ 📋 Copiar Script ]  [ ⚙️ Personalizar Formulário ]  [ 👁️ Testar ]  [ 📊 Ver Leads ] │
│                                                                                        │
│ 🔘 3. Glúteo Feminino (Campanha Meta/Google)                                           │
│    URL do Botão: pinaskit.com.br/b/gluteo-fem                                          │
│    Métricas: 410 Cliques │ 45 Leads Capturados │ 10.9% Conversão                       │
│    Destino: WhatsApp +55 11 96490-6555                                                 │
│    [ 📋 Copiar Script ]  [ ⚙️ Personalizar Formulário ]  [ 👁️ Testar ]  [ 📊 Ver Leads ] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Regras de Negócio de Botões:
1. **Cota por Plano:**
   - Plano Starter: Até 5 botões / sites de captação ativos.
   - Plano Pro: Até 15 botões ativos.
   - Plano Enterprise: Ilimitado.
2. **Script de Instalação Embutível:** Cada botão gera um script de 1 linha (`<script src="https://pinaskit.com/widget.js" data-button-id="..."></script>`) para colar no WordPress, Elementor, Wix ou qualquer site.
3. **Formulário Independente:** Cada botão possui seu próprio formulário "Conte sobre seu momento", com perguntas e opções customizadas pelo Construtor No-Code.

---

## 4.2. Módulo "Leads" (Tabela Completa CentralKit com Filtro por Botão)
*(Baseado fielmente na captura oficial da CentralKit enviada pelo usuário)*

A tela de Leads reúne todas as captações com rastreamento de temperatura e origem:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              BASE DE LEADS (CENTRALKIT)                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Filtros no Topo:                                                                       │
│ [ Selecione o Botão: Todos os botões ▼ ]  [ Período: Últimos 30 dias ▼ ]              │
│ [ 📊 Exportar Excel ]  [ ⚙️ Regras de Pontuação ]  [ Configurações ]                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TABELA DE CONTATOS CAPTURADOS:                                                         │
│ [x] TEMPERATURA    NOME             TELEFONE          BOTÃO           ORIGEM    AÇÕES  │
│ [ ] ❄️ Morno 31pts  Ana Livia        +55 11 97537...   Glúteo Feminino GoogleAds [📈][🗑️]│
│ [ ] ❄️ Morno 29pts  Andreza          +55 11 98181...   Endolaser       GoogleAds [📈][🗑️]│
│ [ ] 🔥 Quente 52pts Vitória Freitas  +55 11 96490...   Depilação Laser Meta Ads  [📈][🗑️]│
│ [ ] 🧊 Frio  12pts  Luana            +55 11 91755...   Glúteo Feminino Google    [📈][🗑️]│
│ Mostrando 1-4 de 4 leads                                           [ Itens por página: 25 ▼ ]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Experiência Mobile (Projetada para o Celular)
*(Baseada fielmente no Painel 3 da referência visual Modelo D)*

A versão mobile do Pinas Kit não é um site espremido, mas sim uma experiência fluida equivalente a um aplicativo nativo:
1. **Navegação Inferior Fixa (Bottom Navigation):**
   - `[Início]` `[Leads]` `[Conversas]` `[Vendas]` com ícones e rótulos legíveis.
2. **Dashboard Mobile com Card de Progresso:**
   - Card vertical: *"Olá, Mariana! Seu progresso: 2 de 3 [Continuar agora ->]"*.
3. **Conexão de Anúncios Mobile:**
   - Botões verticais confortáveis: `[f Conectar Facebook Ads]`, `[ig Conectar Instagram]`, `[G Conectar Google Ads]`.
   - Mensagem de confiança: *"🔒 É seguro e leva menos de 2 minutos"*.
4. **Lista de Contatos ("Meus Leads") em Cards Toque-Fácil:**
   - Filtros no topo em pílulas: `[Todos]` `[Novos]` `[Em conversa]` `[Venda]`.
   - Cards com foto/avatar, nome, origem identificada ("Chegou pelo Instagram"), tempo decorrido ("Há 5 min") e situação com badge colorido.
   - Toque no card abre a ficha completa com o botão direto para falar no WhatsApp.

---

## 6. Os Dois Formatos de Captação no Site do Cliente

```
                      ┌────────────────────────────────────────────────────────┐
                      │                 FORMATOS DE CAPTAÇÃO                   │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
             ┌────────────────────────────────────┴────────────────────────────────────┐
             ▼                                                                         ▼
[OPÇÃO A: MODAL EXPRESS WHATSAPP]                                       [OPÇÃO B: QUALIFICAÇÃO DINÂMICA]
- Velocidade máxima de contato                                          - Para serviços de alto valor e mentorias
- Campos: Nome + Telefone com DDI +55                                   - "Conte sobre seu momento."
- Abre o WhatsApp imediatamente com mensagem pronta                      - Pergunta e Dropdown customizados pelo dono
- Dispara pixel de conversão no ato                                     - Textarea para objetivos e envio qualificado
```

### O Construtor No-Code de Opções Dinâmicas no Painel:
O assinante tem uma interface visual onde ele mesmo digita:
1. A pergunta principal (ex: *"O que melhor descreve seu momento?"*).
2. Adiciona as opções de resposta livres (ex: *"Quero crescer na carreira"*, *"Quero mudar de área"*).
3. Atribui pontuação automática para cada opção (ex: +30 pontos coloca o lead como **Quente 🔥** no CRM).
4. Define a mensagem que o WhatsApp receberá com tags automáticas `{nome}`, `{momento}`, `{mensagem}`.

---

# PARTE III — ENGENHARIA, INTEGRAÇÕES E CIBERSEGURANÇA

## 7. Como Funciona a Integração Multi-Tenant com Meta & Google Ads

Como o Pinas Kit é um SaaS vendido por assinatura, **cada assinante possui sua própria conta de anúncios**. O sistema resolve isso em dois níveis:

### Nível 1: Atribuição Automática via Parâmetros de URL (Sem Fricção)
- O cliente cola a tag de rastreamento do Pinas Kit nos seus anúncios:
  - Meta: `utm_source=meta_ads&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_content={{ad.name}}`
  - Google: `utm_source=google_ads&utm_campaign={campaignid}&utm_term={keyword}&gclid={gclid}`
- Quando o lead chega no site e clica no botão, o Pinas Kit captura tudo automaticamente e etiqueta no CRM. **Zero burocracia.**

### Nível 2: Conexão Oficial via OAuth 2.0 (Para Trazer Gastos em R$ e Custo por Lead)
- O cliente clica em `[Conectar Meta Ads]` ou `[Conectar Google Ads]`.
- Autoriza via tela oficial do Facebook/Google.
- O Pinas Kit recebe um token de longa duração, criptografa com **AES-256** e vincula estritamente ao `workspace_id` dele.
- Um cron job consulta os gastos diariamente e cruza com os leads capturados no WhatsApp, gerando a tabela mais valiosa do mercado:

| Campanha | Investido R$ | Cliques | Leads no WhatsApp | Custo Real por Lead (CPL) |
| :--- | :--- | :--- | :--- | :--- |
| **Botox Outubro** | R$ 450,00 | 320 | 30 leads | **R$ 15,00 / lead** |
| **Lipo Sem Cortes** | R$ 600,00 | 210 | 12 leads | **R$ 50,00 / lead** |
| **Limpeza de Pele** | R$ 150,00 | 180 | 25 leads | **R$ 6,00 / lead 🔥** |

---

## 8. Arquitetura de Cibersegurança Máxima (Nível Bancário)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          FORTALEZA DE SEGURANÇA PINAS KIT                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Trânsito Seguro: HTTPS / TLS 1.3 obrigatório + HSTS + Headers CSP e X-Frame-Options │
│ 2. Criptografia em Repouso: Telefones, e-mails e tokens salvos com AES-256-GCM         │
│ 3. Blind Indexing: Hash determinístico HMAC-SHA256 para busca rápida sem descriptografar│
│ 4. Subscription Gatekeeper: Bloqueio automático de descriptografia se o plano expirar │
│ 5. Whitelist de Domínios & CORS: O widget só funciona em sites aprovados pelo cliente  │
│ 6. Defesa Anti-Bot: HoneyPot oculto + Validação de tempo (<800ms) + Rate Limit Redis   │
│ 7. Trilha de Auditoria: Registro imutável de quem exportou ou visualizou dados         │
│ 8. LGPD: Ferramenta de anonimização e exclusão permanente de dados a pedido            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Sistema de Cobrança, Planos e Infraestrutura de Hospedagem

### Planos Oficiais:
* **Plano Essencial Mensal:** R$ 49,90 / mês.
* **Plano Essencial Anual:** R$ 499,00 / ano (~R$ 41,58/mês — 17% de desconto).
* **7 Dias Grátis:** O cliente inicia o teste sem fricção; a cobrança recorrente automatizada via **Asaas** (Pix recorrente/Cartão) ou **Stripe** é ativada após o período de teste com o dinheiro caindo direto na sua conta bancária.

### Infraestrutura:
* **Frontend & Landing Page:** Vercel ou Cloudflare Pages (distribuição global, CDN ultrarrápida, SSL automático).
* **Script do Widget:** Cloudflare R2 / CDN (< 15KB, carrega em < 30ms em qualquer site).
* **Banco de Dados:** PostgreSQL (Supabase / Neon Tech) com RLS ativado e backups diários.
* **Cache & Rate Limit:** Upstash Redis Serverless.

---

## 10. Schema do Banco de Dados PostgreSQL (Multi-Tenant Seguro)

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Workspaces e Assinaturas
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL,
  subscription_status VARCHAR(50) DEFAULT 'trial', -- 'trial', 'active', 'past_due', 'canceled'
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  allowed_domains TEXT[] DEFAULT '{}',
  stripe_customer_id VARCHAR(100),
  asaas_customer_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Integrações de Anúncios por Cliente (Multi-Tenant)
CREATE TABLE workspace_ad_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'meta_ads' ou 'google_ads'
  account_id VARCHAR(100) NOT NULL,
  account_name VARCHAR(255),
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, platform, account_id)
);

-- 3. Métricas Financeiras e de Campanhas
CREATE TABLE ad_campaign_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  campaign_id VARCHAR(100) NOT NULL,
  campaign_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  spend_amount NUMERIC(10, 2) DEFAULT 0.00,
  impressions_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  cpc NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, platform, campaign_id, date)
);

-- 4. Formulários e Botões (Widgets)
CREATE TABLE capture_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'whatsapp_modal', 'qualification_form'
  site_url VARCHAR(255),
  primary_whatsapp VARCHAR(30),
  title VARCHAR(255) DEFAULT 'Conte sobre seu momento.',
  subtitle TEXT DEFAULT 'Preencha os campos para iniciar a conversa.',
  button_text VARCHAR(100) DEFAULT 'Preparar minha mensagem →',
  theme_preset VARCHAR(50) DEFAULT 'purple_gradient',
  question_label VARCHAR(255) DEFAULT 'O que melhor descreve seu momento?',
  dropdown_options JSONB NOT NULL DEFAULT '[]'::jsonb,
  whatsapp_template TEXT DEFAULT 'Olá! Meu nome é {nome}. Momento: {opcao}. Mensagem: {mensagem}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Leads Criptografados com Atribuição de Anúncio
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  widget_id UUID REFERENCES capture_widgets(id) ON DELETE SET NULL,
  name_encrypted TEXT NOT NULL,
  phone_encrypted TEXT NOT NULL,
  email_encrypted TEXT,
  answers_json_encrypted TEXT,
  phone_blind_index VARCHAR(64),
  origin VARCHAR(100) DEFAULT 'Direto',
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  selected_option_label TEXT,
  score INTEGER DEFAULT 0,
  temperature VARCHAR(50) DEFAULT 'Morno',
  crm_stage VARCHAR(50) DEFAULT 'new', -- 'new', 'in_progress', 'offer', 'won', 'lost'
  deal_value NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Logs de Auditoria
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  ip_address VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

# PARTE IV — ROTEIRO DE EXECUÇÃO TINTIM POR TINTIM

* **Fase 1: Fundação do Design System Modelo D & Tema Claro/Escuro**
  - Configurar fonte Poppins, tokens de cores oficiais (Violeta `#7C3AED`, Fundo `#F8F7FC`, Branco `#FFFFFF`, Verde `#10B981` e Dark `#09090B`).
  - Implementar alternador de tema suave e sem flicker.
* **Fase 2: A Landing Page Oficial de Alta Conversão**
  - Implementar exatamente a estrutura do Painel 1 da referência visual: Hero com foto humanizada acolhedora, badges de valor, 3 cards de benefícios simples, tabela de preços e FAQ.
* **Fase 3: O Dashboard Desktop & Mobile com Assistente Guiado**
  - Implementar o cabeçalho personalizado *"Olá, Mariana! 👋"*.
  - Implementar o card de onboarding *"Seu início no Pinas Kit (2 de 3 concluídos)"*.
  - Implementar o card dinâmico *"Próxima ação recomendada"*.
  - Implementar os 4 cards de métricas claras e a barra de ajuda inferior com botão direto para WhatsApp.
  - Implementar navegação mobile dedicada com bottom bar.
* **Fase 4: Formulários de Captação & Construtor No-Code**
  - Modal Express de WhatsApp + Formulário de Qualificação Roxo ("Conte sobre seu momento") com custom dropdown dinâmico e opções editáveis pelo assinante.
* **Fase 5: Módulo de Integrações de Anúncios Multi-Tenant**
  - Atribuição automática de UTMs no CRM + tela de conexão com Meta e Google Ads.
* **Fase 6: Fortaleza de Cibersegurança & Pagamentos**
  - Ativar criptografia AES-256, Subscription Gatekeeper e checkout com Asaas/Stripe.
  - Executar a bateria de testes da **Regra Obrigatória de Auditoria de Segurança**.
