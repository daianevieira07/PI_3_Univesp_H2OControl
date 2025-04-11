from django.contrib import admin
from .models import Usuario, Cliente, Endereco, Estoque, EstoqueMovimentacao, Venda

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('user', 'nome', 'login')
    search_fields = ('nome', 'login')
    ordering = ('nome',)

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id_cliente', 'nome', 'cpf', 'telefone')
    search_fields = ('nome', 'cpf')
    ordering = ('nome',)

@admin.register(Endereco)
class EnderecoAdmin(admin.ModelAdmin):
    list_display = ('id_cliente', 'logradouro', 'numero', 'bairro')
    search_fields = ('logradouro', 'bairro')
    ordering = ('logradouro',)

@admin.register(Estoque)
class EstoqueAdmin(admin.ModelAdmin):
    list_display = ('id_produto', 'produto', 'quantidade')
    search_fields = ('produto',)
    ordering = ('produto',)

@admin.register(EstoqueMovimentacao)
class EstoqueMovimentacaoAdmin(admin.ModelAdmin):
    list_display = ('id_movimentacao', 'id_produto', 'id_usuario', 'tipo_movimentacao', 'quantidade')
    search_fields = ('id_produto__produto', 'id_usuario__nome')
    ordering = ('-data_movimentacao',)

@admin.register(Venda)
class VendaAdmin(admin.ModelAdmin):
    list_display = ('id_venda', 'id_produto', 'id_cliente', 'id_usuario', 'quantidade', 'valor_venda', 'status_pedido')
    search_fields = ('id_produto__produto', 'id_cliente__nome', 'id_usuario__nome')
    ordering = ('-data_venda',) 