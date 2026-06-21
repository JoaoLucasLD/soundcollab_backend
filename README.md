# SoundCollab Backend

API REST do SoundCollab, uma aplicação web para descoberta e conexão entre músicos por critérios de compatibilidade.

- Frontend: [soundcollab_frontend](https://github.com/JoaoLucasLD/soundcollab_frontend)
- Versão utilizada na avaliação do TCC: commit [`cf737b216ab3`](https://github.com/JoaoLucasLD/soundcollab_backend/tree/cf737b216ab3f4011e3fa89b8782a3e8552347e9)

## Tecnologias

- Node.js e TypeScript
- NestJS
- PostgreSQL
- Prisma ORM
- JWT e Passport
- `bcryptjs`
- `class-validator` e `class-transformer`

## Módulos principais

| Módulo | Responsabilidade |
| --- | --- |
| `auth` | Cadastro, autenticação, emissão e validação de JWT. |
| `users` | Consulta da conta e do perfil do usuário autenticado. |
| `profiles` | Criação e edição do perfil musical, instrumentos e estilos. |
| `instruments` | Consulta e administração de instrumentos e categorias. |
| `styles` | Consulta e administração dos estilos musicais. |
| `matchmaking` | Cálculo e ordenação do ranking de compatibilidade. |
| `collaborations` | Envio e gerenciamento de convites de colaboração. |
| `chat` | Estruturas de conversas e mensagens; não integra o fluxo avaliado do MVP. |

Todas as rotas possuem o prefixo `/api/v1`.

## Pré-requisitos

- [Node.js](https://nodejs.org/) `20.19+` ou `22.12+`;
- npm;
- PostgreSQL acessível localmente;
- Git.

## Instalação local

### 1. Clonar o repositório

```bash
git clone https://github.com/JoaoLucasLD/soundcollab_backend.git
cd soundcollab_backend
```

Para reproduzir exatamente a versão avaliada no TCC:

```bash
git checkout cf737b216ab3f4011e3fa89b8782a3e8552347e9
```

### 2. Instalar as dependências

```bash
npm ci
```

### 3. Criar o banco PostgreSQL

Crie um banco vazio chamado `soundcollab`. Pelo `psql`:

```sql
CREATE DATABASE soundcollab;
```

O nome pode ser diferente, desde que as URLs da etapa seguinte sejam ajustadas.

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```dotenv
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/soundcollab?schema=public"
DIRECT_URL="postgresql://postgres:SUA_SENHA@localhost:5432/soundcollab?schema=public"

PORT=3000
FRONTEND_URL="http://localhost:5173"

JWT_SECRET="SUBSTITUA_POR_UM_SEGREDO_ALEATORIO"
JWT_ISSUER="soundcollab"
JWT_AUDIENCE="soundcollab-web"
JWT_EXPIRES_IN_SECONDS=1200

AUTH_MAX_FAILED_LOGIN_ATTEMPTS=5
AUTH_LOCK_MINUTES=15

PROFILE_ENCRYPTION_KEY="SUBSTITUA_POR_OUTRO_SEGREDO_ALEATORIO"

CATALOG_ADMIN_EMAILS="admin@example.com"
```

Não reutilize os valores de exemplo em ambientes publicados. Um segredo pode ser gerado com Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use valores diferentes em `JWT_SECRET` e `PROFILE_ENCRYPTION_KEY`. Não envie o arquivo `.env` ao repositório.

### 5. Preparar o banco

Gere o cliente Prisma e aplique as migrações:

```bash
npx prisma generate
npx prisma migrate deploy
```

As migrações criam a estrutura do banco, mas não carregam todos os instrumentos e estilos utilizados na avaliação. A configuração do catálogo é explicada em [Configuração inicial dos catálogos](#configuração-inicial-dos-catálogos).

Uma das migrações cria a categoria genérica `outros`. Para manter apenas as oito categorias da versão avaliada, ela pode ser renomeada por `PATCH /api/v1/instruments/categories/:id` ou excluída, caso não possua instrumentos associados.

### 6. Iniciar a API

```bash
npm run start:dev
```

A API ficará disponível em:

```text
http://localhost:3000/api/v1
```

Mantenha o backend em execução e siga as instruções do [frontend](https://github.com/JoaoLucasLD/soundcollab_frontend).

## Configuração inicial dos catálogos

Os instrumentos, categorias e estilos da versão avaliada foram cadastrados manualmente pelas rotas administrativas. Uma instalação nova precisa executar essa etapa para disponibilizar as opções no onboarding e na edição do perfil.

### 1. Definir o administrador

Informe em `CATALOG_ADMIN_EMAILS` o e-mail que será usado para administrar o catálogo. Mais de um endereço pode ser informado, separado por vírgula.

### 2. Criar a conta e obter o token

Cadastre uma conta com o mesmo e-mail configurado. A senha deve possuir de 8 a 72 caracteres, com ao menos uma letra maiúscula, uma minúscula e um número.

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Senha123"}'
```

Copie o valor de `accessToken` retornado. Nos exemplos seguintes, substitua `SEU_TOKEN` e os identificadores retornados pela API.

> No PowerShell, use `curl.exe` ou um cliente REST como Postman, Insomnia ou a extensão REST Client do VS Code.

### 3. Criar categorias, instrumentos e estilos

Criar uma categoria:

```bash
curl -X POST http://localhost:3000/api/v1/instruments/categories \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teclas"}'
```

Criar um instrumento usando o `id` da categoria retornada:

```bash
curl -X POST http://localhost:3000/api/v1/instruments \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Piano","categoryId":"ID_DA_CATEGORIA"}'
```

Criar um estilo:

```bash
curl -X POST http://localhost:3000/api/v1/styles \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bossa Nova"}'
```

Reutilizar um nome existente resulta em conflito. Consulte os itens cadastrados com `GET /api/v1/instruments`, `GET /api/v1/instruments/categories` e `GET /api/v1/styles`.

<details>
<summary>Catálogo de instrumentos utilizado na avaliação</summary>

- **Teclas:** Acordeão, Órgão, Piano, Sintetizador, Teclado, Vibrafone e Xilofone.
- **Vocal:** Backing vocal, Barítono, Beatbox, Contralto, Mezzo-soprano, Rap, Soprano, Tenor e Vocalista.
- **Percussão:** Atabaque, Bateria, Bongô, Cajón, Conga, Pandeiro, Percussão geral, Surdo e Tamborim.
- **Sopro:** Clarinete, Escaleta, Flauta, Gaita, Oboé, Ocarina, Saxofone, Trombone, Trompa e Trompete.
- **Composição e arranjo:** Arranjo, Composição, Orquestração e Rearmonização.
- **Cordas clássicas:** Harpa, Viola, Violino e Violoncelo.
- **Cordas populares:** Baixo, Banjo, Cavaquinho, Contrabaixo acústico, Guitarra, Ukulele, Viola caipira e Violão.
- **Produção musical:** Beatmaker, DJ, Masterização, Mixagem e Sound design.

</details>

<details>
<summary>Estilos musicais utilizados na avaliação</summary>

Axé, Blues, Bossa Nova, Country, Eletrônica, Folk, Forró, Funk, Gospel, Hip Hop, Indie, Jazz, Metal, MPB, Música Clássica, Pagode, Pop, R&B, Rap, Reggae, Rock, Samba e Sertanejo.

</details>

## Rotas principais

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | Cria uma conta e retorna um JWT. | Não |
| `POST` | `/api/v1/auth/login` | Autentica uma conta existente. | Não |
| `GET` | `/api/v1/users/me` | Retorna a conta autenticada e seu perfil. | Sim |
| `PATCH` | `/api/v1/profiles/me` | Cria ou atualiza os dados gerais do perfil. | Sim |
| `PUT` | `/api/v1/profiles/me/instruments` | Substitui os instrumentos do perfil. | Sim |
| `PUT` | `/api/v1/profiles/me/styles` | Substitui os estilos do perfil. | Sim |
| `GET` | `/api/v1/matchmaking/ranking` | Retorna músicos ordenados por compatibilidade. | Sim |
| `GET` | `/api/v1/collaborations` | Lista os convites do usuário. | Sim |
| `POST` | `/api/v1/collaborations` | Envia um convite de colaboração. | Sim |
| `PATCH` | `/api/v1/collaborations/:id/accept` | Aceita um convite. | Sim |
| `PATCH` | `/api/v1/collaborations/:id/reject` | Recusa um convite. | Sim |
| `DELETE` | `/api/v1/collaborations/:id` | Cancela um convite pendente. | Sim |

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run start:dev` | Inicia a API em desenvolvimento com recarregamento. |
| `npm run build` | Compila o projeto para `dist/`. |
| `npm run start:prod` | Executa o conteúdo compilado de `dist/`. |
| `npm test` | Executa os testes com Jest. |
| `npm run test:cov` | Executa os testes e gera cobertura. |

Para simular a execução de produção localmente:

```bash
npm run build
npm run start:prod
```

## Solução de problemas

### O Prisma não consegue acessar o banco

- Confirme se o PostgreSQL está em execução.
- Verifique usuário, senha, porta e nome do banco em `DATABASE_URL` e `DIRECT_URL`.
- Confirme que a porta padrão `5432` não está sendo usada por outra instância.

### A criação de categorias, instrumentos ou estilos retorna `403`

- Confirme que `CATALOG_ADMIN_EMAILS` contém o e-mail da conta autenticada.
- Reinicie o backend após alterar o `.env`.
- Gere um novo token efetuando login novamente.

### O frontend apresenta erro de CORS

Confirme que `FRONTEND_URL` corresponde exatamente à origem do frontend, normalmente `http://localhost:5173`.

### A data de nascimento não pode ser salva ou lida

Confirme que `PROFILE_ENCRYPTION_KEY` está definida e permaneceu igual desde a gravação dos dados. A alteração dessa chave impede a leitura de datas já criptografadas.

### As listas de instrumentos e estilos estão vazias

As migrações não carregam o catálogo completo. Execute a etapa de [configuração inicial dos catálogos](#configuração-inicial-dos-catálogos).

## Observações de segurança

- Não publique arquivos `.env`, URLs com credenciais ou segredos JWT.
- Use segredos diferentes dos exemplos em qualquer ambiente compartilhado.
- Restrinja `CATALOG_ADMIN_EMAILS` às contas autorizadas.
- O valor de `PROFILE_ENCRYPTION_KEY` deve ser preservado para permitir a leitura das datas já armazenadas.
