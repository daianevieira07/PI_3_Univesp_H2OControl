FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro para aproveitar o cache do Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o resto do projeto
COPY . .

# Tornar o manage.py executável
RUN chmod +x manage.py

EXPOSE 8000

# Comando para executar o servidor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 