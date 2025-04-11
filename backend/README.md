# H2OControl Backend

Backend do sistema de controle de água, desenvolvido com Django e PostgreSQL.

## Requisitos

- Docker
- Docker Compose

## Como executar

1. Clone o repositório
2. Entre na pasta do backend:
```bash
cd backend
```

3. Crie um arquivo `.env` com as seguintes variáveis (opcional, já existem valores padrão):
```
SECRET_KEY=your-secret-key-here
DEBUG=True
POSTGRES_DB=h2ocontrol
POSTGRES_USER=h2ocontrol
POSTGRES_PASSWORD=h2ocontrol
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

4. Execute o projeto com Docker Compose:
```bash
docker-compose up --build
```

5. Em outro terminal, execute as migrações:
```bash
docker-compose exec web python manage.py migrate
```

6. Crie um superusuário (opcional):
```bash
docker-compose exec web python manage.py createsuperuser
```

O projeto estará disponível em:
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/
- Documentação da API: http://localhost:8000/api/docs/

## Endpoints da API

A API possui os seguintes endpoints principais:

- `/api/usuarios/`: Gerenciamento de usuários
- `/api/clientes/`: Gerenciamento de clientes
- `/api/enderecos/`: Gerenciamento de endereços
- `/api/estoque/`: Gerenciamento de produtos em estoque
- `/api/movimentacoes/`: Gerenciamento de movimentações de estoque
- `/api/vendas/`: Gerenciamento de vendas

Para mais detalhes sobre os endpoints e seus parâmetros, consulte a documentação da API em `/api/docs/`. 