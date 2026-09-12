# Enkephalos

Espaço de estudos minimalista, fluxo de anotações técnicas e gerenciador de foco com Pomodoro integrado.

Disponível em: **[enkephalos.mubadev.com.br](https://enkephalos.mubadev.com.br)**

---

## Funcionalidades

- **Biblioteca de Estudos & Notas**: Visualização limpa de artigos e anotações técnicas (sincronizadas com Markdown do Obsidian), suporte a fórmulas matemáticas em KaTeX, blocos de código e links de navegação rápida por tópicos.
- **Localizador Inteligente no Artigo (`Ctrl + K` / `Ctrl + F`)**: Busca estilo VS Code que destaca as ocorrências no texto com destaque natural por cor de fundo, compatibilidade com/sem acentos (`faisca` encontra `Faísca`) e navegação palavra por palavra (`Enter` / `Shift+Enter`).
- **Timer Pomodoro Real & Foco Profundo**:
  - Modos Pomodoro, Pausa Curta e Pausa Longa com ajuste direto no cronômetro.
  - Modo rígido: sem pausas artificiais e reinício ao interromper.
  - Sons ambientes (chuva contínua) e efeitos sonoros de transição.
- **Paleta de Cores Dinâmica Global**: Seletor com 6 paletas de destaque (*Azul*, *Âmbar Ouro*, *Esmeralda*, *Violeta*, *Ciano*, *Rosa Coral*) e alternância entre Temas Claro e Escuro.

---

## Tecnologias

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [KaTeX](https://katex.org/), [Lucide Icons](https://lucide.dev/)
- **Backend**: [Java 21](https://www.oracle.com/java/), [Spring Boot](https://spring.io/projects/spring-boot), [Maven](https://maven.apache.org/)
- **DevOps & Infraestrutura**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), [Nginx](https://nginx.org/), [Certbot (SSL)](https://certbot.eff.org/), [GitHub Actions (CI/CD)](https://github.com/features/actions)

---

## Como Executar Localmente

### Opção 1: Desenvolvimento com Node.js

1. Clone o repositório:
```bash
git clone https://github.com/murilofsouzaa/enkephalos.git
cd enkephalos
```

2. Instale as dependências e inicie o frontend:
```bash
cd frontend
npm install
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5173`

---

### Opção 2: Com Docker Compose

Suba todo o ambiente containerizado com um único comando:

```bash
docker compose up -d --build
```

- Frontend: `http://localhost:8088`
- Backend: `http://localhost:8089`

---

## Deploy em Produção

O projeto conta com pipeline de **CI/CD contínua** via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

A cada `git push` na branch `main`, o GitHub conecta automaticamente na VPS via SSH, atualiza o código e reinicia os containers Docker na porta `8088`, atendendo requisições com SSL e HTTP/2 via Nginx no domínio `enkephalos.mubadev.com.br`.

---

## Licença

Projeto desenvolvido para estudos e organização pessoal de conhecimento.
