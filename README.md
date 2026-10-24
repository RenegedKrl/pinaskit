# 🟣 Pinas Kit v7.0 — CRM Simples e Intuitivo

> **Seu negócio organizado e sem complicação.**  
> O Pinas Kit é uma plataforma SaaS brasileira inspirada na CentralKit, desenvolvida com o **Modelo D: Assistido e Didático** — uma experiência pensada para quem quer crescer e organizar contatos, conversas e vendas sem sofrer com termos técnicos ou interfaces intimidantes.

---

## ✨ Destaques & Funcionalidades

- **🌐 Landing Page Comercial Completa:**
  - Apresentação acolhedora com foto humana e prova social direta.
  - Tabela de preços interativa com alternância entre plano mensal (R$ 49,90) e anual (R$ 41,58/mês com 17% OFF).
  - Seção de dúvidas frequentes (FAQ) em sanfona expansível.
- **📊 Dashboard do CRM Guiado (Painel da Mariana):**
  - **Card de Início Guiado (Onboarding):** Barra de progresso visual (2 de 3 concluídos) conduzindo os primeiros passos.
  - **Próxima Ação Recomendada:** Card dinâmico orientando o usuário sobre o que fazer a seguir (ex: conectar Facebook Ads).
  - **4 Indicadores Essenciais:** *Leads hoje*, *Conversas em andamento*, *Vendas este mês* e *Investimento em anúncios*.
  - **Gerenciador de Contatos:** Tabela visual com badges de temperatura (*🔥 Quente*, *❄️ Morno*), pontuação de qualificação e botão de contato direto no WhatsApp.
  - **Filtros por Etapa:** Visualização rápida por *Todos*, *Novos*, *Em conversa* e *Vendas*.
- **📝 Formulário de Qualificação Roxo ("Conte sobre seu momento"):**
  - Seletor suspenso customizado com microanimações e badges visuais (não utiliza `<select>` nativo cinza).
  - Captura imediata de nome, WhatsApp e objetivos.
  - Formatação automática de mensagem pré-pronta e redirecionamento seguro para o WhatsApp.
- **📈 Central de Anúncios & Atribuição de Tráfego (Multi-Tenant):**
  - Tabela com rastreamento completo de campanhas da **Meta (Facebook & Instagram)** e **Google Ads**.
  - Cruzamento de dados de investimento em R$ com contatos reais capturados no WhatsApp.
  - Cálculo automático e em tempo real de **Custo por Lead (CPL / CAC)**, **Faturamento Gerado** e **Retorno sobre Investimento (ROI / ROAS)**.
  - **💡 Diagnóstico Inteligente de Tráfego:** Análise assistida em linguagem clara indicando a melhor campanha para escalar orçamento.
  - **🎯 Simulador de Retorno:** Slider interativo que projeta novos contatos e faturamento previsto para investimentos adicionais.
  - **🏷️ Gerador Assistido de Links com UTM:** Construtor rápido de URLs oficiais prontas para colar nos anúncios em 1 clique.
- **🛠️ Construtor Visual No-Code:**
  - Permite aos clientes personalizarem a pergunta do formulário e criarem novas opções dinâmicas diretamente pela interface.
- **🌓 Alternância Instantânea de Tema (Dark / Light):**
  - **Modo Claro (padrão):** Fundo acolhedor `#F8F7FC` e cartões brancos `#FFFFFF`.
  - **Modo Escuro:** Fundo `#09090B` e cartões `#18181D` com alto contraste e sem cansaço visual.
- **📱 100% Responsivo no Celular (Mobile):**
  - Barra de navegação inferior dedicada (*Bottom Nav*) para fácil uso no smartphone.

---

## 🎨 Design System (Modelo D)

- **Tipografia:** [Poppins](https://fonts.google.com/specimen/Poppins) para títulos amigáveis e [Inter](https://fonts.google.com/specimen/Inter) para dados e tabelas.
- **Cores Principais:**
  - Violeta Neon: `#7C3AED` (hover: `#6D28D9`)
  - Fundo Claro: `#F8F7FC`
  - Fundo Escuro: `#09090B`
  - Verde WhatsApp: `#10B981`
  - Rubi Quente: `#DC2626`

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior instalado.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/RenegedKrl/pinaskit.git
   cd pinaskit
   ```

2. **Inicie o servidor local:**
   ```bash
   node server.js
   ```

3. **Acesse no seu navegador:**
   - Abra [http://localhost:3334](http://localhost:3334) (ou a porta informada no terminal).

---

## 🧪 Suíte de Testes Automatizados (Zero-Bug Protocol)

O Pinas Kit possui duas camadas rigorosas de validação automatizada:

### 1. Testes de Integração e Regras de Negócio (123 testes)
Valida a camada de gerenciamento de estado (`storage.js`), componentes de UI, campanhas, cálculo de CPL/ROI, persistência de dados, tokens CSS e conformidade com o plano mestre:
```bash
node test-all.js
```

### 2. Testes Ponta a Ponta no Navegador Real (73 testes E2E)
Executa o **Google Chrome** via Chrome DevTools Protocol (CDP), realizando cliques reais, testes da Central de Anúncios, Simulador de ROI, Gerador de UTMs, preenchimento de formulários, navegação, responsividade mobile (375x812) e captura de tela:
```bash
node test-e2e-suite.js
```

---

## 📂 Estrutura de Arquivos

```
pinas-kit/
├── index.html                   # Estrutura HTML5 com Google Fonts e metatags SEO
├── server.js                    # Servidor HTTP puro Node.js com fallback de portas
├── package.json                 # Metadados e scripts de execução
├── planejamento_pinas_kit.md   # Plano Mestre de Arquitetura, Segurança e UI/UX v7.0
├── public/
│   └── assets/images/           # Avatares humanizados (Hero e Suporte Mariana)
├── src/
│   ├── main.js                  # Orquestrador da aplicação e gerenciador de eventos
│   ├── components/
│   │   ├── Header.js            # Cabeçalho da Landing Page e alternador de tema
│   │   ├── LandingPage.js       # Seções Hero, Como Funciona, Preços e FAQ
│   │   ├── Dashboard.js         # Painel CRM da Mariana, métricas e lista de leads
│   │   ├── QualificationModal.js# Formulário roxo "Conte sobre seu momento"
│   │   ├── ConnectAdsModal.js   # Modal de conexão Meta Ads & Google Ads
│   │   └── FormBuilderModal.js  # Construtor No-Code de opções e perguntas
│   ├── services/
│   │   └── storage.js           # Gerenciador de estado local e persistência
│   └── styles/
│       ├── tokens.css           # Tokens do Design System Modelo D
│       ├── components.css       # Estilos de botões, modais, dropdowns e cards
│       └── layout.css           # Grid, barra de navegação, sidebar e responsividade
├── test-all.js                  # Suíte de testes unitários e de integração
└── test-e2e-suite.js            # Suíte de testes E2E via Chrome CDP
```

---

## 🔒 Segurança e Privacidade

- **Multi-Tenant Seguro:** Isolamento estrito por `workspace_id`.
- **Criptografia:** Planejado para proteção de credenciais e tokens de API com padrão bancário AES-256-GCM.
- **Proteção contra Abuso:** Verificação de domínios autorizados e limitação de requisições por IP no widget de captação.

---

## 📄 Licença

Distribuído sob licença comercial privada. Todos os direitos reservados.
