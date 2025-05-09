# Generated by Django 5.0.2 on 2025-04-11 03:45

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id_cliente', models.AutoField(primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=100)),
                ('cpf', models.CharField(max_length=11, unique=True)),
                ('telefone', models.CharField(max_length=15)),
                ('observacoes', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Estoque',
            fields=[
                ('id_produto', models.AutoField(primary_key=True, serialize=False)),
                ('produto', models.CharField(max_length=200)),
                ('quantidade', models.IntegerField()),
                ('data_ultima_venda', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Endereco',
            fields=[
                ('id_cliente', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='api.cliente')),
                ('logradouro', models.CharField(max_length=200)),
                ('numero', models.IntegerField()),
                ('bairro', models.CharField(max_length=100)),
                ('complemento', models.CharField(blank=True, max_length=50, null=True)),
                ('cep', models.CharField(max_length=8)),
            ],
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id_usuario', models.AutoField(primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=100)),
                ('login', models.CharField(max_length=50, unique=True)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'api_usuario',
            },
        ),
        migrations.CreateModel(
            name='EstoqueMovimentacao',
            fields=[
                ('id_movimentacao', models.AutoField(primary_key=True, serialize=False)),
                ('tipo_movimentacao', models.BooleanField()),
                ('quantidade', models.IntegerField()),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('data_movimentacao', models.DateTimeField(auto_now_add=True)),
                ('observacoes', models.TextField(blank=True, null=True)),
                ('fornecedor', models.CharField(blank=True, max_length=200, null=True)),
                ('id_produto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.estoque')),
                ('id_usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.usuario')),
            ],
        ),
        migrations.CreateModel(
            name='Venda',
            fields=[
                ('id_venda', models.AutoField(primary_key=True, serialize=False)),
                ('quantidade', models.IntegerField()),
                ('valor_venda', models.DecimalField(decimal_places=2, max_digits=10)),
                ('data_venda', models.DateTimeField(auto_now_add=True)),
                ('tipo_pagamento', models.CharField(choices=[('dinheiro', 'Dinheiro'), ('cartao', 'Cartão'), ('pix', 'PIX'), ('boleto', 'Boleto')], max_length=50)),
                ('status_pedido', models.SmallIntegerField(choices=[(0, 'Pendente'), (1, 'Confirmado'), (2, 'Cancelado')], default=0)),
                ('observacoes', models.TextField(blank=True, null=True)),
                ('id_cliente', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.cliente')),
                ('id_produto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.estoque')),
                ('id_usuario', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.usuario')),
            ],
        ),
    ]
