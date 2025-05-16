# H2OControl

Sistema de controle de água desenvolvido com Django (backend) e Vue.js (frontend).

## 🚀 Requisitos

- Docker
- Docker Compose
- Python 3.x (para desenvolvimento local)
- Node.js 16+ (para o frontend Vue)

## 🔧 Como Executar o Projeto

### Backend (Django/DRF)

1. Entre na pasta do backend:
```bash
cd backend
```

2. Crie/atualize o arquivo `.env` (opcional, já existem valores padrão):
```ini
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

### Frontend (Vue.js)

1. Em outro terminal, entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

## 🌐 Acesso

- **Frontend Vue**: http://localhost:5173

### Acessando o Sistema

1. Acesse o frontend através do navegador e crie uma conta para acesso
   
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

## 🏗️ Estrutura do Projeto

```
h2ocontrol/
├── backend/              # Django (mantido)
│   ├── api/              
│   ├── core/             
│   └── ...
│
└── frontend/             # Novo frontend Vue
    ├── public/           # Assets estáticos
    ├── src/
    │   ├── assets/       # CSS/Imagens
    │   ├── components/   # Componentes Vue
    │   ├── router/       # Vue Router
    │   ├── stores/       # Pinia (gerenciamento de estado)
    │   ├── views/        # Páginas
    │   └── main.js       # Inicialização Vue
    ├── package.json
    └── ...
```

## 🔄 Migração de HTML/JS para Vue

As principais mudanças na nova versão incluem:

- **SPA (Single Page Application)** com Vue Router
- **Gerenciamento de estado** com Pinia
- **Autenticação JWT** com renovação automática
- **Componentes reutilizáveis** (Formulários, Toasts, etc.)
- **Integração moderna com API** via Axios

## 🛠️ Comandos Úteis (Frontend)

| Comando               | Descrição                          |
|-----------------------|-----------------------------------|
| `npm run dev`         | Inicia servidor de desenvolvimento|
| `npm run build`       | Gera build para produção          |
| `npm run lint`        | Verifica erros de código          |
| `npm run serve`       | Serve build de produção localmente|

## 📚 Documentação Adicional

- [Vue.js](https://vuejs.org/guide/introduction.html)
- [Pinia](https://pinia.vuejs.org/)
- [Django REST Framework](https://www.django-rest-framework.org/)
