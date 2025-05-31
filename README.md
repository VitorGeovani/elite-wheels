<div align="center">
    <img src="frontend/src/assets/logo.png" alt="EliteWheels Logo" width="100"/>
</div>

# EliteWheels - Sistema de Locadora de Veículos

## 📋 Sobre o Projeto

O **EliteWheels** é um sistema completo de gerenciamento para locadoras de veículos, desenvolvido com React no frontend e Node.js no backend. O sistema permite o controle completo de clientes, veículos e locações, oferecendo uma interface moderna e intuitiva para administradores.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Sistema de login seguro com JWT
- Controle de acesso por token
- Middleware de autenticação

### 👥 Gestão de Clientes
- Cadastro completo de clientes (nome, email, telefone, CPF, CNH)
- Busca por nome, email ou CPF
- Edição e exclusão de registros

### 🚗 Gestão de Veículos
- Cadastro de veículos por tipo (Hatch, SUV, Utilitário, Sedan, Pickup)
- Controle de modelo, marca, ano e placa
- Sistema de disponibilidade automática

### 📋 Gestão de Locações
- Criação de novas locações
- Controle de KM de retirada
- Opção de seguro
- Sistema de entrega com cálculo automático de valores
- Histórico completo de locações

### 📊 Dashboard
- Estatísticas em tempo real
- Contadores de clientes, veículos e locações
- Ações rápidas para principais funcionalidades

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** 18.2.0
- **React Router DOM** 6.15.0
- **Axios** para requisições HTTP
- **SCSS** para estilização
- **Font Awesome** para ícones

### Backend
- **Node.js** com **Express**
- **MySQL2** para banco de dados
- **JWT** para autenticação
- **Bcrypt** para criptografia de senhas
- **CORS** para permitir requisições cross-origin
- **Dotenv** para variáveis de ambiente

## 📁 Estrutura do Projeto

```
EliteWheels/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── clients/
│   │   │   ├── cars/
│   │   │   ├── location/
│   │   │   ├── entrega/
│   │   │   ├── login/
│   │   │   └── components/
│   │   └── index.js
│   └── package.json
└── backend/
    ├── src/
    │   ├── controller/
    │   ├── repository/
    │   ├── middleware/
    │   └── index.js
    ├── .env
    ├── package.json
    └── script.sql
```

## 💾 Banco de Dados

### Script SQL Completo

```sql
-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS locadoraDB;
USE locadoraDB;

-- Tabela de Usuários (para autenticação)
CREATE TABLE TB_USUARIO (
    ID_USUARIO INT PRIMARY KEY AUTO_INCREMENT,
    NM_USUARIO VARCHAR(200) NOT NULL,
    DS_EMAIL VARCHAR(100) NOT NULL UNIQUE,
    DS_SENHA VARCHAR(255) NOT NULL,
    BT_ATIVO BOOLEAN DEFAULT TRUE,
    DT_CRIACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE TB_CLIENTE (
    ID_CLIENTE INT PRIMARY KEY AUTO_INCREMENT,
    NM_CLIENTE VARCHAR(200) NOT NULL,
    DS_CPF VARCHAR(50) NOT NULL,
    DS_TELEFONE VARCHAR(50) NOT NULL,
    DS_EMAIL VARCHAR(100) NOT NULL,
    DS_CNH VARCHAR(50) NOT NULL
);

-- Tabela de Tipos de Veículos
CREATE TABLE TB_TIPO_VEICULO (
    ID_TIPO_VEICULO INT PRIMARY KEY AUTO_INCREMENT,
    DS_TIPO VARCHAR(100) NOT NULL
);

-- Tabela de Veículos
CREATE TABLE TB_VEICULO (
    ID_VEICULO INT PRIMARY KEY AUTO_INCREMENT,
    ID_TIPO_VEICULO INT NOT NULL,
    DS_MODELO VARCHAR(50) NOT NULL,
    DS_MARCA VARCHAR(50) NOT NULL,
    DS_PLACA VARCHAR(50) NOT NULL,
    NR_ANO INT NOT NULL,
    FOREIGN KEY (ID_TIPO_VEICULO) REFERENCES TB_TIPO_VEICULO(ID_TIPO_VEICULO)
);

-- Tabela de Locações
CREATE TABLE TB_LOCACAO (
    ID_LOCACAO INT PRIMARY KEY AUTO_INCREMENT,
    ID_CLIENTE INT NOT NULL,
    ID_VEICULO INT NOT NULL,
    DT_LOCACAO DATETIME NOT NULL,
    NR_KM_RETIRADA INT NOT NULL,
    BT_SEGURO BOOL NOT NULL,
    DS_OBSERVACAO VARCHAR(500) NULL,
    DS_SITUACAO VARCHAR(50) NOT NULL DEFAULT 'pendente',
    NR_KM_ENTREGA INT NULL,
    DT_ENTREGA DATETIME NULL,
    VL_TOTAL DECIMAL(15,2) NULL,
    FOREIGN KEY (ID_CLIENTE) REFERENCES TB_CLIENTE(ID_CLIENTE),
    FOREIGN KEY (ID_VEICULO) REFERENCES TB_VEICULO(ID_VEICULO)
);

-- Inserção de dados iniciais
INSERT INTO TB_TIPO_VEICULO (DS_TIPO) VALUES 
    ('Hatch'),
    ('SUV'),
    ('Utilitário'),
    ('Sedan'),
    ('Pickup');

-- Dados de exemplo para testes
INSERT INTO TB_CLIENTE (NM_CLIENTE, DS_CPF, DS_TELEFONE, DS_EMAIL, DS_CNH) VALUES 
    ('João Silva', '123.456.789-00', '(11) 99999-8888', 'joao@email.com', '12345678901'),
    ('Maria Santos', '987.654.321-00', '(11) 88888-7777', 'maria@email.com', '10987654321');

INSERT INTO TB_VEICULO (ID_TIPO_VEICULO, DS_MODELO, DS_MARCA, NR_ANO, DS_PLACA) VALUES
    (1, 'Civic', 'Honda', 2020, 'ABC-1234'),
    (2, 'HR-V', 'Honda', 2021, 'DEF-5678'),
    (1, 'Corolla', 'Toyota', 2019, 'GHI-9012');

-- Usuário administrativo padrão (senha será criada via script)
-- Email: admin@elitewheels.com
-- Senha: admin123

SELECT 'Banco de dados locadoraDB criado com sucesso!' AS resultado;
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL Server
- Git

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd EliteWheels
```

### 2. Configuração do Backend
```bash
cd backend
npm install
```

### 3. Configuração do Banco de Dados
- Execute o script SQL no MySQL
- Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:

```bash
cp .env.example .env
```

- Edite o arquivo `.env` com suas configurações:

```env
PORT=5000
HOST=localhost
DB=locadoraDB
USER=root
PWD=sua_senha_mysql
JWT_SECRET=elite123456
```

> **Nota:** O arquivo `.env` está incluído no `.gitignore` por segurança. Use o arquivo `.env.example` como referência para as variáveis necessárias.

### 4. Criação do Usuário Administrativo
```bash
node src/criarUsuario.js
```

### 5. Configuração do Frontend
```bash
cd ../frontend
npm install
```

## 🚀 Executando o Projeto

### Backend
```bash
cd backend
npm start
```
O servidor será executado em `http://localhost:5000`

### Frontend
```bash
cd frontend
npm start
```
A aplicação será executada em `http://localhost:3000`

## 🔑 Credenciais de Acesso

- **Email:** admin@elitewheels.com
- **Senha:** admin123

## 📡 API Endpoints

### Autenticação
- `POST /login` - Fazer login
- `POST /register` - Registrar usuário
- `GET /verify` - Verificar token

### Clientes
- `GET /cliente` - Listar clientes
- `POST /cliente` - Criar cliente
- `PUT /cliente/:id` - Atualizar cliente
- `DELETE /cliente/:id` - Deletar cliente

### Veículos
- `GET /veiculo` - Listar veículos
- `GET /veiculo/disponiveis` - Listar veículos disponíveis
- `GET /veiculo/tipo` - Listar tipos de veículos
- `POST /veiculo` - Criar veículo
- `PUT /veiculo/:id` - Atualizar veículo
- `DELETE /veiculo/:id` - Deletar veículo

### Locações
- `GET /locacao` - Listar locações pendentes
- `GET /locacao/todas` - Listar todas as locações
- `GET /locacao/:id` - Buscar locação por ID
- `POST /locacao` - Criar locação
- `PUT /locacao/:id` - Atualizar locação
- `PUT /locacao/entrega/:id` - Finalizar entrega
- `DELETE /locacao/:id` - Deletar locação

## 🎨 Características do Design

- Interface responsiva e moderna
- Paleta de cores com destaque para laranja (#FF7101) e roxo (#7A14C0)
- Menu lateral fixo com navegação intuitiva
- Cards informativos no dashboard
- Formulários organizados e validados
- Tabelas com ações de edição e exclusão

## 🔒 Segurança

- Autenticação JWT com middleware de proteção
- Senhas criptografadas com bcrypt
- Validação de tokens em todas as rotas protegidas
- Controle de acesso por usuário
- Variáveis de ambiente protegidas via `.gitignore`

## 📈 Funcionalidades Futuras

- Relatórios de locações
- Sistema de multas
- Integração com sistemas de pagamento
- Notificações por email
- App mobile

## 👨‍💻 Desenvolvedor

Projeto desenvolvido como parte do curso de Desenvolvimento de Sistemas Web - SENAC, 4º Semestre.

---

**EliteWheels** - Sua locadora digital! 🚗✨