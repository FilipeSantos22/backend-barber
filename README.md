# 🗄️ AppBarbearia - Backend

API REST robusta para sistema de agendamento de barbearias desenvolvida com **Node.js**, **Express** e **PostgreSQL**.

## 🚀 Sobre o Projeto

O **AppBarbearia Backend** é a API que alimenta o sistema de gerenciamento de agendamentos para barbearias. Fornece endpoints seguros para autenticação, gerenciamento de usuários, barbearias, serviços e agendamentos com sistema inteligente de horários.

### ✨ Funcionalidades

- 🔐 **Autenticação JWT** e integração com OAuth
- 👥 **Gerenciamento de usuários** (clientes, barbeiros, admins)
- 🏪 **CRUD de barbearias** e seus dados
- ⚙️ **Gerenciamento de serviços** com duração personalizada
- 📅 **Sistema de agendamentos** inteligente
- ⏰ **Controle de disponibilidade** de horários
- 🕐 **Agendamentos com duração flexível** (30, 60, 90+ minutos)
- 🔄 **Soft delete** para manter histórico
- 📊 **Validações robustas** e tratamento de erros

## 🛠️ Tecnologias Utilizadas

- **Node.js** (Runtime JavaScript)
- **Express.js** (Framework web)
- **TypeScript** (Tipagem estática)
- **PostgreSQL** (Banco de dados)
- **Knex.js** (Query builder)
- **JWT** (Autenticação)
- **Bcrypt** (Hash de senhas)
- **Cors** (Cross-origin requests)
- **Dotenv** (Variáveis de ambiente)

## 🏗️ Arquitetura

O backend segue o padrão **MVC** com separação clara de responsabilidades:

```
src/
├── controllers/     # Lógica de controle das rotas
├── services/        # Regras de negócio
├── repositories/    # Acesso aos dados
├── models/          # Definição dos tipos/interfaces
├── routes/          # Definição das rotas
├── middleware/      # Middlewares customizados
├── database/        # Configuração do banco
│   ├── migrations/  # Migrações do banco
│   └── seeds/       # Dados iniciais
└── utils/           # Funções auxiliares
```

## 📊 Modelo de Dados

### Principais Entidades

- **Users** - Clientes, barbeiros e administradores
- **Barbearias** - Estabelecimentos cadastrados
- **Servicos** - Serviços oferecidos pelas barbearias
- **Agendamentos** - Reservas de horários

### Relacionamentos

- Usuários podem ser vinculados a barbearias (barbeiros)
- Serviços pertencem a barbearias específicas
- Agendamentos conectam usuários, barbeiros, serviços e barbearias
- Sistema de horários flexível com duração personalizada

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- npm/yarn/pnpm

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/FilipeSantos22/backend-barbert
cd backend-barber
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:
```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=app_barbearia

# Autenticação
JWT_SECRET=seu-jwt-secret-super-seguro
BCRYPT_ROUNDS=10

# CORS
FRONTEND_URL=http://localhost:3000
```

4. **Configure o banco de dados**
```bash
# Execute as migrações
npm run migrate

# Execute os seeds (dados iniciais)
npm run seed
```

5. **Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

6. **API disponível em**
```
http://localhost:3001
```

## 📡 Endpoints da API

### Autenticação
```http
POST /auth/login         # Login de usuário
POST /auth/register      # Registro de usuário
POST /auth/refresh       # Renovar token
```

### Usuários
```http
GET    /usuarios         # Listar usuários
GET    /usuarios/:id     # Buscar usuário por ID
POST   /usuarios         # Criar usuário
PUT    /usuarios/:id     # Atualizar usuário
DELETE /usuarios/:id     # Excluir usuário
```

### Barbearias
```http
GET    /barbearias       # Listar barbearias
GET    /barbearias/:id   # Buscar barbearia por ID
POST   /barbearias       # Criar barbearia
PUT    /barbearias/:id   # Atualizar barbearia
DELETE /barbearias/:id   # Excluir barbearia
```

### Serviços
```http
GET    /servicos                    # Listar serviços
GET    /servicos/:id                # Buscar serviço por ID
GET    /servicos/barbearia/:id      # Serviços por barbearia
POST   /servicos                    # Criar serviço
PUT    /servicos/:id                # Atualizar serviço
DELETE /servicos/:id                # Excluir serviço
```

### Agendamentos
```http
GET    /agendamentos                # Listar agendamentos
GET    /agendamentos/:id            # Buscar agendamento por ID
GET    /agendamentos/usuario/:id    # Agendamentos do usuário
GET    /agendamentos/disponiveis    # Horários disponíveis
POST   /agendamentos                # Criar agendamento
PUT    /agendamentos/:id            # Atualizar agendamento
DELETE /agendamentos/:id            # Excluir agendamento
```

## 🕐 Sistema de Horários

### Funcionamento

- **Horários padrão**: 08:00 às 19:30 (intervalos de 30 minutos)
- **Duração flexível**: Serviços podem durar 30, 60, 90+ minutos
- **Reserva inteligente**: Agendamentos longos bloqueiam múltiplos horários
- **Validação**: Sistema impede conflitos de horários

### Exemplo de Agendamento

Para um serviço de **60 minutos** às **09:00**:
- O sistema reserva: `09:00` e `09:30`
- Ambos os horários ficam indisponíveis para outros agendamentos
- Na exclusão, todos os horários do intervalo são liberados

## 🔒 Segurança

- **Autenticação JWT** em rotas protegidas
- **Hash de senhas** com bcrypt
- **Validação de entrada** em todos os endpoints
- **Sanitização** de dados
- **CORS configurado** para frontend específico
- **Rate limiting** (recomendado para produção)

## 🗃️ Banco de Dados

### Migrações

```bash
# Criar nova migração
npm run make:migration nome_da_migracao

# Executar migrações
npm run migrate

# Reverter última migração
npm run migrate:rollback
```

### Seeds

```bash
# Executar seeds
npm run seed

# Criar novo seed
npm run make:seed nome_do_seed
```

## 🔗 Frontend

Este backend funciona em conjunto com o **frontend-barber**:
- **Repositório**: [frontend-barber](https://github.com/FilipeSantos22/frontend-barber.git)
- **Tecnologias**: Next.js 14, TypeScript, Tailwind CSS
- **Porta padrão**: 3000

## 🧪 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Compila TypeScript
npm start           # Executa versão compilada
npm run migrate     # Executa migrações
npm run seed        # Executa seeds
npm run test        # Executa testes (se configurado)
```

## 🚀 Deploy

### Opções de Deploy

1. **Heroku**
2. **DigitalOcean**
3. **AWS EC2**
4. **Railway**
5. **Render**

### Configuração de Produção

```env
NODE_ENV=production
PORT=3001
DB_HOST=seu-host-producao
JWT_SECRET=jwt-secret-super-seguro-producao
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📋 Roadmap

- [ ] Testes unitários e de integração
- [ ] Sistema de notificações (email/SMS)
- [ ] API de relatórios e analytics
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Documentação Swagger/OpenAPI

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por **[Seu Nome]**

- GitHub: [@seu-usuario](https://github.com/FilipeSantos22)
- LinkedIn: [Seu LinkedIn](https://www.linkedin.com/in/filipe-gomes22)

---

⭐ Se este projeto te ajudou, deixe uma estrela!