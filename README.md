# Enkephalos

Espaço de estudos minimalista, fluxo de anotações técnicas, planejador inteligente baseado na **Curva do Esquecimento de Ebbinghaus** e gerenciador de foco com Pomodoro integrado.

Disponível em: **[enkephalos.mubadev.com.br](https://enkephalos.mubadev.com.br)**

---

## Funcionalidades

### 1. Planejador de Estudos & Repetição Espaçada (Curva de Ebbinghaus)
- **Gráfico Interativo da Curva de Retenção**: Cálculo matemático e visualização em tempo real do decaimento da memória e do ganho de retenção a cada ciclo de revisão ativa.
- **Modos de Visualização**:
  - *Visão Individual*: Análise detalhada do histórico de revisões, dias decorridos e curva de retenção de uma matéria específica.
  - *Visão Comparativa Geral*: Traçado simultâneo de todas as matérias cadastradas para acompanhamento macroscópico do aprendizado.
- **Calendário Inteligente de Revisões**: Sinalização automática das datas em que a memória se aproxima do limiar ideal (~80%), recomendando o momento exato para revisão ativa.
- **Guia Metodológico Completo**:
  - Contexto histórico e científico sobre Hermann Ebbinghaus e a repetição espaçada.
  - Diagrama dinâmico animado ilustrando a queda natural da memória e o repique restaurador de cada revisão.
  - Guia de boas práticas e complementaridade ao **Anki** (gestão panorâmica e macroscópica de temas gerais vs. flashcards atômicos diários).

### 2. Biblioteca de Estudos & Anotações Técnicas
- **Integração com Obsidian**: Visualização de artigos e anotações sincronizadas via Markdown estruturado.
- **Renderização Matemática & Código**: Suporte a fórmulas científicas com KaTeX, blocos de código com destaque de sintaxe e índices de navegação rápida por tópicos.
- **Localizador Inteligente no Artigo (`Ctrl + K` / `Ctrl + F`)**:
  - Busca estilo VS Code com destaque natural no texto.
  - Busca insensível a acentos (`faisca` localiza `Faísca`).
  - Navegação rápida palavra por palavra (`Enter` / `Shift + Enter`).

### 3. Pomodoro & Foco Profundo
- **Ciclos de Foco**: Modos Pomodoro (estudo), Pausa Curta e Pausa Longa com ajuste direto no cronômetro.
- **Modo Rígido**: Sem pausas artificiais, com reinício automático ao interromper a sessão.
- **Paisagem Sonora Otimizada**: Áudio contínuo de chuva e efeitos sonoros nativos gerenciados por pool de áudio sem vazamento de memória.

### 4. Customização Visual & Temas
- **Seletor Global de Paletas**: 6 combinações de destaque (*Verde Água/Ciano*, *Azul*, *Âmbar Ouro*, *Esmeralda*, *Violeta*, *Rosa Coral*).
- **Temas Claro e Escuro**: Totalmente integrado com suporte a variáveis CSS e persistência automática.

---

## Arquitetura & Otimizações de Performance

- **Code-Splitting Sob Demanda**: Rotas e módulos carregados de forma assíncrona (`React.lazy` + `Suspense`), reduzindo o bundle inicial em **~98%** (de 1,62 MB para **~32 kB** de payload inicial).
- **Separação Inteligente de Vendors**: Chunks segregados no Vite para bibliotecas pesadas (`katex`, `framer-motion`, `lucide-react`, `react/react-dom`), garantindo cache eficiente de longo prazo pelo navegador.
- **Gerenciamento Seguro de Memória**: Singleton de áudio com cache e descarte adequado de instâncias `HTMLAudioElement`, evitando vazamento de memória em sessões longas de estudo.
- **Código 100% Validado**: Cobertura estrita com ESLint e TypeScript sem erros ou advertências.

---

## Tecnologias

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [KaTeX](https://katex.org/), [Lucide Icons](https://lucide.dev/)
- **Backend**: [Java 21](https://www.oracle.com/java/), [Spring Boot](https://spring.io/projects/spring-boot), [Maven](https://maven.apache.org/)
- **DevOps & Infraestrutura**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), [Nginx](https://nginx.org/), [Certbot (SSL)](https://certbot.eff.org/), [GitHub Actions (CI/CD)](https://github.com/features/actions)

---

## Como Executar Localmente

### Opção 1: Frontend (Node.js)

1. Clone o repositório:
```bash
git clone https://github.com/murilofsouzaa/enkephalos.git
cd enkephalos
```

2. Instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd frontend
npm install
npm run dev
```

Acesse no navegador: `http://localhost:5173`

---

### Opção 2: Ambiente Completo com Docker Compose

Suba todo o ambiente containerizado (Frontend + Backend + Nginx) com um único comando:

```bash
docker compose up -d --build
```

- **Frontend**: `http://localhost:8088`
- **Backend**: `http://localhost:8089`

---

## Deploy em Produção

O projeto conta com esteira de **CI/CD contínua** via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

A cada `git push` na branch `main`, o GitHub conecta automaticamente na VPS via SSH, executa os builds, atualiza o código e reinicia os containers Docker na porta `8088`, atendendo requisições com SSL e HTTP/2 via Nginx no domínio `enkephalos.mubadev.com.br`.

---

## Licença

Projeto desenvolvido para estudos e organização pessoal de conhecimento.

