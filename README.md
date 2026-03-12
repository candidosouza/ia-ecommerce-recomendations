# Sistema de Recomendação para E-commerce

Aplicação web de estudo para simular um fluxo de recomendação de produtos em e-commerce com foco em organização de frontend, uso de Web Workers e integração com TensorFlow.js no navegador.

O projeto exibe usuários, catálogo de produtos, histórico de compras e um fluxo de treinamento de modelo com visualização de métricas. A implementação atual foi migrada para `Vite + TypeScript`, preservando a arquitetura modular original baseada em `controllers`, `services`, `views` e `workers`.

## Objetivo

Este projeto foi construído para estudar:

- organização de aplicações frontend sem backend dedicado
- tipagem com TypeScript em aplicações web modulares
- uso de `Web Workers` para processamento assíncrono
- visualização de treinamento com `TensorFlow.js` e `tfjs-vis`
- simulação de recomendação de produtos a partir de dados de usuários

## Stack Utilizada

- `Node.js 22`
- `Vite`
- `TypeScript`
- `Vitest`
- `jsdom`
- `TensorFlow.js`
- `TensorFlow.js Vis`
- `Bootstrap 5`
- `Docker` e `Docker Compose`

## Arquitetura Atual

O projeto segue uma separação simples por responsabilidade:

- `controllers`: coordenam fluxo de tela, eventos e regras de interação
- `services`: acesso a dados locais e persistência em `sessionStorage`
- `views`: renderização e manipulação direta do DOM
- `events`: barramento de eventos da aplicação via `CustomEvent`
- `workers`: processamento isolado para treino e recomendação
- `data`: base local em JSON para usuários e produtos

Essa arquitetura é adequada para um projeto de estudo de pequeno e médio porte. Ela mantém clareza suficiente sem introduzir a complexidade de um framework completo como React.

## Estrutura do Projeto

```text
ia-ecommerce-recomendations/
├── data/
│   ├── products.json
│   └── users.json
├── src/
│   ├── controller/
│   ├── events/
│   ├── service/
│   ├── test/
│   ├── view/
│   │   └── templates/
│   ├── workers/
│   ├── main.ts
│   ├── types.ts
│   └── vite-env.d.ts
├── coverage/
├── Dockerfile
├── docker-compose.yml
├── entrypoint.sh
├── index.html
├── package.json
├── style.css
├── tsconfig.json
└── vite.config.ts
```

## Requisitos

Para executar o projeto localmente, você precisa ter instalado:

- `Node.js 22` ou superior
- `npm`
- `Docker`
- `Docker Compose`

## Execução Local

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Abra no navegador:

```text
http://localhost:3000
```

## Execução com Docker

Na raiz do projeto, execute:

```bash
docker compose up --build -d
```

Abra no navegador:

```text
http://localhost:3000
```

Para acessar o container:

```bash
docker compose exec app bash
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

Para parar o ambiente:

```bash
docker compose down
```

## Scripts Disponíveis

No [package.json](./package.json):

- `npm start`: inicia o Vite em `0.0.0.0:3000`
- `npm run dev`: alias para desenvolvimento com Vite
- `npm run build`: executa validação TypeScript e gera build de produção
- `npm run preview`: sobe a versão buildada localmente
- `npm test`: executa a suíte de testes com cobertura
- `npm run test:watch`: executa a suíte em modo watch
- `npm run test:ui`: abre a interface visual do Vitest

## Suíte de Testes

O projeto possui uma suíte de testes automatizados configurada de forma compatível com a stack atual.

Ferramentas utilizadas:

- `Vitest` como test runner
- `jsdom` para simulação de navegador
- `@vitest/coverage-v8` para geração de cobertura
- `setupTests.ts` para bootstrap de ambiente de teste
- `factories.ts` para construção de dados reutilizáveis

### Cobertura atual da suíte

Neste momento, a suíte cobre principalmente:

- barramento de eventos da aplicação
- services de usuários e produtos
- fluxo principal do `UserController`
- integração de mensagens no `WorkerController`

### Execução dos testes

Executar todos os testes com cobertura:

```bash
npm test
```

Executar em modo watch:

```bash
npm run test:watch
```

Executar com interface visual:

```bash
npm run test:ui
```

### Relatórios de cobertura

Após a execução dos testes, o relatório é gerado em:

```text
coverage/
```

### Estado atual da cobertura

A infraestrutura de testes já está pronta e validada, mas a cobertura ainda está concentrada em `events`, `services` e alguns `controllers`.

As próximas áreas recomendadas para expansão da suíte são:

- `views`
- `ModelTrainingController`
- `ProductController`
- `TFVisorController`
- `modelTrainingWorker`

## Como a Aplicação Funciona

O fluxo principal da aplicação é:

1. carregar usuários e produtos a partir dos arquivos JSON locais
2. renderizar a interface inicial no navegador
3. permitir seleção de usuário e registro de compras
4. disparar eventos internos para atualizar tela e histórico
5. acionar um `Web Worker` para simular treino e recomendação
6. apresentar logs e visualizações de treinamento com `tfjs-vis`

Atualmente, a parte de treino e recomendação está estruturada para evolução incremental. O worker já está isolado, mas a lógica de recomendação ainda é simplificada e voltada a estudo.

## Persistência de Dados

Os dados de usuários carregados do arquivo JSON são copiados para `sessionStorage`. Isso significa:

- os dados persistem apenas durante a sessão do navegador
- alterações feitas na interface não são gravadas de volta nos arquivos JSON
- ao abrir uma nova sessão, os dados voltam ao estado original

## Principais Arquivos

- [src/main.ts](./src/main.ts): ponto de entrada da aplicação
- [src/types.ts](./src/types.ts): contratos principais da aplicação
- [src/controller/UserController.ts](./src/controller/UserController.ts): fluxo de usuários e compras
- [src/controller/ProductController.ts](./src/controller/ProductController.ts): fluxo de catálogo e compra
- [src/controller/ModelTrainingController.ts](./src/controller/ModelTrainingController.ts): controle de treino e recomendação
- [src/controller/WorkerController.ts](./src/controller/WorkerController.ts): integração com o worker
- [src/workers/modelTrainingWorker.ts](./src/workers/modelTrainingWorker.ts): processamento assíncrono de treino e recomendação
- [Dockerfile](./Dockerfile): imagem base do ambiente
- [entrypoint.sh](./entrypoint.sh): bootstrap do container

## Decisões Técnicas

### Por que Vite + TypeScript?

Essa combinação foi adotada porque:

- melhora a experiência de desenvolvimento
- reduz atrito com módulos ES modernos
- facilita build, hot reload e empacotamento
- adiciona segurança de tipos sem exigir mudança completa para framework

### Por que não React neste momento?

Para o estado atual do projeto, a interface ainda é relativamente simples e a arquitetura atual é suficiente. Migrar para React agora aumentaria o custo de manutenção sem ganho proporcional.

Se o projeto crescer em:

- complexidade de estado
- número de telas
- composição de componentes
- integrações externas

então uma migração futura para `React + TypeScript` pode passar a fazer sentido.

## Build de Produção

Para gerar o build:

```bash
npm run build
```

Os arquivos gerados ficarão em:

```text
dist/
```

## Ferramentas de Desenvolvimento

O projeto possui tarefas auxiliares para VS Code em [`.vscode/tasks.json`](./.vscode/tasks.json).

Tarefas disponíveis:

- `Start E-commerce App`: inicia a aplicação em modo desenvolvimento
- `Run Tests`: executa a suíte completa
- `Watch Tests`: executa a suíte em modo contínuo

## Limitações Atuais

- a lógica de recomendação ainda está em estágio inicial
- o worker ainda usa um fluxo simplificado de treinamento
- o bundle final é grande por causa das dependências de TensorFlow
- não há backend real nem persistência em banco de dados

## Próximos Passos Recomendados

- evoluir a lógica real de recomendação dentro do worker
- separar melhor o carregamento de módulos de ML para reduzir bundle
- ampliar a cobertura de testes para views, worker e controllers restantes
- considerar divisão por feature dentro de `src/`
- avaliar migração para React apenas se a UI crescer de forma significativa

## Comandos Úteis

Reinstalar dependências:

```bash
rm -rf node_modules package-lock.json
npm install
```

Subir o ambiente Docker do zero:

```bash
docker compose down -v
docker compose up --build -d
```

Executar build manual dentro do container:

```bash
docker compose exec app bash
npm run build
```

Executar testes dentro do container:

```bash
docker compose exec app bash
npm test
```

## Observações

- o container já inclui ferramentas úteis de desenvolvimento como `bash`, `git`, `curl`, `procps`, `iproute2` e `net-tools`
- o projeto foi configurado para desenvolvimento local e estudo, não para produção final

fonte: Pós Graduação Engenharia de Software em IA Aplicada.  
Projeto de estudo
