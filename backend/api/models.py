from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    nome = models.CharField(max_length=100)
    login = models.CharField(max_length=50, unique=True)

    def save(self, *args, **kwargs):
        if not self.user_id:
            # Create a new User instance
            user = User.objects.create_user(
                username=self.login,
                email=self.login,  # Using login as email
            )
            self.user = user
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome

    class Meta:
        db_table = 'api_usuario'

class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=11, unique=True)
    telefone = models.CharField(max_length=15)
    observacoes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome

class Endereco(models.Model):
    id_cliente = models.OneToOneField(Cliente, on_delete=models.CASCADE, primary_key=True)
    logradouro = models.CharField(max_length=200)
    numero = models.IntegerField()
    bairro = models.CharField(max_length=100)
    complemento = models.CharField(max_length=50, blank=True, null=True)
    cep = models.CharField(max_length=8)

    def __str__(self):
        return f"{self.logradouro}, {self.numero} - {self.bairro}"

class Estoque(models.Model):
    id_produto = models.AutoField(primary_key=True)
    produto = models.CharField(max_length=200)
    quantidade = models.IntegerField()
    data_ultima_venda = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.produto

class EstoqueMovimentacao(models.Model):
    id_movimentacao = models.AutoField(primary_key=True)
    id_produto = models.ForeignKey(Estoque, on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    tipo_movimentacao = models.BooleanField()  # True para entrada, False para saída
    quantidade = models.IntegerField()
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_movimentacao = models.DateTimeField(auto_now_add=True)
    observacoes = models.TextField(blank=True, null=True)
    fornecedor = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.id_produto} - {'Entrada' if self.tipo_movimentacao else 'Saída'}"

class Venda(models.Model):
    FORMA_PAGAMENTO_CHOICES = [
        ('dinheiro', 'Dinheiro'),
        ('cartao', 'Cartão'),
        ('pix', 'PIX'),
        ('boleto', 'Boleto'),
    ]

    STATUS_CHOICES = [
        (0, 'Pendente'),
        (1, 'Confirmado'),
        (2, 'Cancelado'),
    ]

    id_venda = models.AutoField(primary_key=True)
    id_produto = models.ForeignKey(Estoque, on_delete=models.PROTECT)
    id_cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    quantidade = models.IntegerField()
    valor_venda = models.DecimalField(max_digits=10, decimal_places=2)
    data_venda = models.DateTimeField(auto_now_add=True)
    tipo_pagamento = models.CharField(max_length=50, choices=FORMA_PAGAMENTO_CHOICES)
    status_pedido = models.SmallIntegerField(choices=STATUS_CHOICES, default=0)
    observacoes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Venda {self.id_venda} - {self.id_cliente.nome}" 