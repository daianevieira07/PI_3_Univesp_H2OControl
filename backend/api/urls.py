from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.utils import extend_schema, extend_schema_view
from .views import (
    UsuarioViewSet, ClienteViewSet, EnderecoViewSet,
    EstoqueViewSet, EstoqueMovimentacaoViewSet, VendaViewSet
)

@extend_schema_view(
    list=extend_schema(description='Lista todos os usuários'),
    create=extend_schema(description='Cria um novo usuário'),
    retrieve=extend_schema(description='Recupera um usuário específico'),
    update=extend_schema(description='Atualiza um usuário'),
    partial_update=extend_schema(description='Atualiza parcialmente um usuário'),
    destroy=extend_schema(description='Remove um usuário'),
)
class DocumentedUsuarioViewSet(UsuarioViewSet):
    pass

@extend_schema_view(
    list=extend_schema(description='Lista todos os clientes'),
    create=extend_schema(description='Cria um novo cliente'),
    retrieve=extend_schema(description='Recupera um cliente específico'),
    update=extend_schema(description='Atualiza um cliente'),
    partial_update=extend_schema(description='Atualiza parcialmente um cliente'),
    destroy=extend_schema(description='Remove um cliente'),
)
class DocumentedClienteViewSet(ClienteViewSet):
    pass

@extend_schema_view(
    list=extend_schema(description='Lista todos os endereços'),
    create=extend_schema(description='Cria um novo endereço'),
    retrieve=extend_schema(description='Recupera um endereço específico'),
    update=extend_schema(description='Atualiza um endereço'),
    partial_update=extend_schema(description='Atualiza parcialmente um endereço'),
    destroy=extend_schema(description='Remove um endereço'),
)
class DocumentedEnderecoViewSet(EnderecoViewSet):
    pass

@extend_schema_view(
    list=extend_schema(description='Lista todos os itens do estoque'),
    create=extend_schema(description='Cria um novo item no estoque'),
    retrieve=extend_schema(description='Recupera um item específico do estoque'),
    update=extend_schema(description='Atualiza um item do estoque'),
    partial_update=extend_schema(description='Atualiza parcialmente um item do estoque'),
    destroy=extend_schema(description='Remove um item do estoque'),
)
class DocumentedEstoqueViewSet(EstoqueViewSet):
    pass

@extend_schema_view(
    list=extend_schema(description='Lista todas as movimentações de estoque'),
    create=extend_schema(description='Cria uma nova movimentação de estoque'),
    retrieve=extend_schema(description='Recupera uma movimentação específica'),
    update=extend_schema(description='Atualiza uma movimentação'),
    partial_update=extend_schema(description='Atualiza parcialmente uma movimentação'),
    destroy=extend_schema(description='Remove uma movimentação'),
)
class DocumentedEstoqueMovimentacaoViewSet(EstoqueMovimentacaoViewSet):
    pass

@extend_schema_view(
    list=extend_schema(description='Lista todas as vendas'),
    create=extend_schema(description='Cria uma nova venda'),
    retrieve=extend_schema(description='Recupera uma venda específica'),
    update=extend_schema(description='Atualiza uma venda'),
    partial_update=extend_schema(description='Atualiza parcialmente uma venda'),
    destroy=extend_schema(description='Remove uma venda'),
)
class DocumentedVendaViewSet(VendaViewSet):
    pass

router = DefaultRouter()
router.register(r'usuarios', DocumentedUsuarioViewSet, basename='usuario')
router.register(r'clientes', DocumentedClienteViewSet, basename='cliente')
router.register(r'enderecos', DocumentedEnderecoViewSet, basename='endereco')
router.register(r'estoque', DocumentedEstoqueViewSet, basename='estoque')
router.register(r'movimentacoes', DocumentedEstoqueMovimentacaoViewSet, basename='movimentacao')
router.register(r'vendas', DocumentedVendaViewSet, basename='venda')

urlpatterns = [
    path('', include(router.urls)),
] 