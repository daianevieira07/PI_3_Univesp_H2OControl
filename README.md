# H2OControl

Sistema de controle de água desenvolvido com Django (backend) e HTML/CSS/JavaScript (frontend).

## Requisitos

- Docker
- Docker Compose
- Python 3.x (para desenvolvimento local)
- Node.js (opcional, para servir o frontend)

## Como Executar o Projeto

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Crie um arquivo `.env` com as seguintes variáveis (opcional, já existem valores padrão):
```
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
POSTGRES_DB=h2ocontrol
POSTGRES_USER=h2ocontrol
POSTGRES_PASSWORD=h2ocontrol
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

3. Execute o projeto com Docker Compose:
```bash
docker-compose up --build
```

4. Em outro terminal, execute as migrações:
```bash
docker-compose exec web python manage.py migrate
```

5. Crie um superusuário para acessar a área administrativa:
```bash
docker-compose exec web python manage.py createsuperuser
```
Sugestão de credenciais:
- Username: admin
- Email: admin@h2ocontrol.com
- Password: h2ocontrol123

O backend estará disponível em:
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/
- Documentação da API: http://localhost:8000/api/docs/

### Frontend

1. Em outro terminal, entre na pasta do frontend:
```bash
cd frontend
```

2. Você pode servir os arquivos de várias formas:

   Opção 1 - Usando Python:
   ```bash
   python -m http.server 3000
   ```

   Opção 2 - Usando Node.js:
   ```bash
   # Instale o serve globalmente (apenas uma vez)
   npm install -g serve
   
   # Execute o servidor
   serve -l 3000
   ```

   Opção 3 - Usando extensão Live Server do VS Code:
   1. Instale a extensão "Live Server"
   2. Clique com o botão direito no arquivo `login.html`
   3. Selecione "Open with Live Server"

O frontend estará disponível em:
- http://localhost:3000 (se usar Python ou Node.js)
- http://127.0.0.1:5500 (se usar Live Server do VS Code)

### Acessando o Sistema

1. Acesse o frontend através do navegador
2. Use as seguintes credenciais para teste:
   - Email: admin@h2ocontrol.com
   - Senha: h2ocontrol123

### Desenvolvimento

Para desenvolvimento local sem Docker:

1. Configure o backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

2. Configure o frontend:
   - Use qualquer servidor HTTP simples (Python, Node.js, Live Server)
   - Edite os arquivos HTML, CSS e JavaScript conforme necessário
   - As alterações serão refletidas automaticamente ao recarregar o navegador

### Estrutura do Projeto

```
h2ocontrol/
├── backend/
│   ├── api/              # Aplicação Django
│   ├── core/             # Configurações do projeto
│   ├── requirements.txt  # Dependências Python
│   └── manage.py        # Script de gerenciamento Django
│
└── frontend/
    ├── login.html       # Página de login
    ├── index.html       # Página principal
    ├── api.js          # Utilitário para comunicação com API
    ├── login-script.js # Lógica da página de login
    └── *.css           # Arquivos de estilo
```

### Endpoints da API

A API possui os seguintes endpoints principais:

- `/api/usuarios/`: Gerenciamento de usuários
- `/api/clientes/`: Gerenciamento de clientes
- `/api/enderecos/`: Gerenciamento de endereços
- `/api/estoque/`: Gerenciamento de produtos em estoque
- `/api/movimentacoes/`: Gerenciamento de movimentações de estoque
- `/api/vendas/`: Gerenciamento de vendas

Para mais detalhes sobre os endpoints e seus parâmetros, consulte a documentação da API em `/api/docs/`

### Autenticação

O sistema utiliza autenticação JWT (JSON Web Token):
1. Faça login através da interface web ou via `/api/token/`
2. O token JWT será armazenado automaticamente no navegador
3. As requisições à API são autenticadas automaticamente
4. O token expira em 24 horas
5. A renovação do token é automática
