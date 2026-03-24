# Sistema de Recomendacao para E-commerce com IA

Aplicacao web de estudo para recomendacao de produtos em e-commerce, com frontend em `TypeScript`, treinamento no navegador com `TensorFlow.js`, backend em `Node.js`, persistencia em `PostgreSQL` e modelagem com `Prisma`.

O projeto evoluiu de uma base local com JSON para uma arquitetura mais profissional, com:

- frontend separado
- API REST
- banco relacional
- migrations versionadas
- seed idempotente com dados fake
- ambiente completo via `Docker Compose`

## Objetivo

Este projeto foi construído para estudar, de forma aplicada:

- arquitetura frontend modular sem framework pesado
- tipagem com `TypeScript`
- recomendacao de produtos com `TensorFlow.js`
- processamento assíncrono com `Web Workers`
- persistencia relacional com `PostgreSQL`
- modelagem e migrations com `Prisma`
- qualidade com testes, lint e formatacao
- orquestracao local com `Docker`

## Arquitetura Atual

O sistema agora esta dividido em tres partes principais:

### 1. Frontend

Aplicacao Vite em `TypeScript`, responsiva, organizada em:

- `controllers`
- `services`
- `views`
- `events`
- `workers`

Responsabilidades:

- carregar usuarios e produtos via API
- registrar compras do usuario
- treinar o modelo no navegador
- exibir recomendacoes e graficos

### 2. API

Backend em `Node.js + Express + TypeScript`, organizado por modulos:

- `products`
- `users`

Responsabilidades:

- expor endpoints REST
- persistir usuarios, produtos e compras
- validar payloads
- entregar dados ao frontend no formato esperado

### 3. Banco de Dados

Banco `PostgreSQL` com modelagem relacional.

Responsabilidades:

- armazenar usuarios
- armazenar produtos
- armazenar historico de compras
- servir como base persistente da aplicacao

## Stack Tecnologica

### Frontend

- `Node.js 22`
- `Vite`
- `TypeScript`
- `TensorFlow.js`
- `TensorFlow.js Vis`
- `Bootstrap 5`
- `Vitest`
- `jsdom`
- `ESLint`
- `Prettier`

### Backend

- `Node.js 22`
- `Express`
- `TypeScript`
- `Prisma`
- `Zod`
- `@faker-js/faker`

### Infraestrutura

- `PostgreSQL 16`
- `Docker`
- `Docker Compose`

## Estrutura do Projeto

```text
ia-ecommerce-recomendations/
├── api/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── lib/
│   │   └── modules/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── package.json
│   └── tsconfig.json
├── data/
│   ├── products.json
│   └── users.json
├── src/
│   ├── controller/
│   ├── events/
│   ├── service/
│   ├── test/
│   ├── view/
│   ├── workers/
│   ├── main.ts
│   └── types.ts
├── Dockerfile
├── docker-compose.yml
├── entrypoint.sh
├── index.html
├── style.css
├── package.json
└── vite.config.ts
```

## Modelagem do Banco

O banco foi modelado com tres entidades principais:

### `User`

- `id`
- `name`
- `age`
- `createdAt`
- `updatedAt`

### `Product`

- `id`
- `name`
- `category`
- `price`
- `color`
- `createdAt`
- `updatedAt`

### `Purchase`

- `id`
- `userId`
- `productId`
- `createdAt`

Relacoes:

- um usuario pode ter muitas compras
- um produto pode aparecer em muitas compras
- cada compra liga um usuario a um produto

## Seed Profissional

O projeto agora possui um seed idempotente em [api/prisma/seed.ts](/home/candido/study/ia-engineer/ia-ecommerce-recomendations/api/prisma/seed.ts).

Ele faz o seguinte:

- limpa os dados anteriores
- popula produtos base
- cria produtos extras com `faker`
- popula usuarios base
- cria usuarios adicionais com dados fake
- gera compras relacionadas para treino e recomendacao
- reajusta as sequences do PostgreSQL apos inserts explicitos

Isso permite:

- ambiente reproduzivel
- dados consistentes para estudo
- reset seguro do banco em ambiente local

## Endpoints da API

### Healthcheck

- `GET /health`

### Produtos

- `GET /api/products`
- `GET /api/products/:id`

### Usuarios

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`

## Fluxo Funcional

1. O frontend carrega usuarios e produtos a partir da API.
2. O usuario seleciona um perfil na interface.
3. O historico de compras e o catalogo sao exibidos.
4. Novas compras podem ser adicionadas.
5. As compras persistem no banco por meio da API.
6. O treinamento do modelo e feito no navegador via `Web Worker`.
7. As recomendacoes sao calculadas com base no contexto dos usuarios e produtos.
8. O `tfjs-vis` exibe dados de treino ao longo das epocas.

## Responsividade

A interface foi ajustada para uso real em:

- `desktop`
- `tablet`
- `mobile`

Pontos tratados:

- grade principal adaptavel
- cards com largura fluida
- botoes empilhando em telas menores
- listagens de produtos e compras com leitura melhor
- hero e secoes reorganizados para navegacao mobile

## Execucao com Docker

Subir todo o ambiente:

```bash
docker compose up --build -d
```

Servicos disponiveis:

- frontend: `http://localhost:3000`
- api: `http://localhost:4000`
- postgres: `localhost:5432`

Entrar no frontend:

```bash
docker compose exec app bash
```

Entrar na API:

```bash
docker compose exec api bash
```

Parar o ambiente:

```bash
docker compose down
```

Remover volumes e recriar do zero:

```bash
docker compose down -v
docker compose up --build -d
```

## Execucao Local

### Frontend

```bash
npm install
npm start
```

### API

```bash
cd api
npm install
npm run prisma:generate
npm run build
```

Para rodar localmente fora do Docker, a API precisa de um `DATABASE_URL` valido apontando para PostgreSQL.

## Scripts Importantes

### Frontend

- `npm start`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`
- `npm test`
- `npm run test:watch`
- `npm run test:ui`

### API

Dentro de [api/package.json](/home/candido/study/ia-engineer/ia-ecommerce-recomendations/api/package.json):

- `npm run dev`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run db:seed`

## Testes e Qualidade

O frontend possui suite automatizada com `Vitest`.

Cobertura validada:

- `86.52%` statements
- `86.73%` branches
- `80.99%` functions
- `86.52%` lines

Comandos:

```bash
npm test
docker compose exec -T app npm test
docker compose exec -T api npm run build
```

## Validacao Ja Executada

Itens validados neste estado do projeto:

- `npm test`: OK
- `npm run build`: OK
- `cd api && npm run build`: OK
- `docker compose up --build -d`: OK
- `GET /health`: OK
- `GET /api/products`: OK
- `GET /api/users`: OK
- `POST /api/users`: OK
- `http://localhost:3000`: OK

## Checklist da Entrega

### Entregue

- [x] separar frontend, API e banco
- [x] adicionar `PostgreSQL` ao ambiente
- [x] configurar `Prisma`
- [x] criar schema relacional
- [x] versionar migration inicial
- [x] criar seed idempotente com dados fake
- [x] expor endpoints de usuarios e produtos
- [x] integrar frontend com API
- [x] manter treino com `TensorFlow.js` no frontend
- [x] manter interface responsiva
- [x] validar stack completo com Docker
- [x] manter cobertura do frontend acima de 80%

### Proxima Etapa Recomendada

- [ ] adicionar testes automatizados da API
- [ ] criar camada de autenticacao
- [ ] persistir historico de recomendacoes
- [ ] versionar execucoes de treino
- [ ] adicionar filtros, busca e paginação
- [ ] criar pipeline CI/CD
- [ ] instrumentar logs e observabilidade

## Decisoes Tecnicas

### Por que `PostgreSQL`?

Porque o dominio e relacional:

- usuario compra produto
- produto participa de recomendacao
- compras precisam ser persistidas
- a modelagem tende a crescer bem com SQL

### Por que `Prisma`?

Porque ele oferece:

- schema legivel
- migrations versionadas
- client tipado
- seed consistente
- boa integracao com `TypeScript`

### Por que nao ligar o frontend direto no banco?

Porque isso seria uma arquitetura incorreta para evolucao real.

A API faz o papel certo de:

- validar payload
- aplicar regra de negocio
- controlar persistencia
- isolar o frontend da modelagem interna do banco

## Limitacoes Conhecidas

- o modelo de recomendacao ainda treina no navegador, nao no backend
- a API ainda nao possui autenticacao
- o bundle do frontend ainda e pesado por causa do `TensorFlow.js`
- a API ainda nao possui suite de testes propria

## Proximos Passos

Se quisermos evoluir de forma profissional, a ordem mais natural agora e:

1. adicionar testes da API
2. criar persistencia de recomendacoes
3. mover parte da inteligencia para backend quando fizer sentido
4. adicionar autenticacao e perfis de acesso
5. preparar pipeline de deploy

fonte: Pós Graduação Engenharia de Software em IA Aplicada.
Projeto de estudo
