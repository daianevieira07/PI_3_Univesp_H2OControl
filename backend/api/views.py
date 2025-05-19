from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.hashers import make_password
from django.db import transaction
from .models import Usuario, Cliente, Endereco, Estoque, EstoqueMovimentacao, Venda
from .serializers import (
    UsuarioSerializer, ClienteSerializer, ClienteCreateSerializer,
    EnderecoSerializer, EstoqueSerializer, EstoqueMovimentacaoSerializer,
    VendaSerializer
)
from django.db import models

class DynamicListMixin:
    @action(detail=False, methods=['get'])
    def custom(self, request):
        # parse limit
        limit_param = request.query_params.get('limit', '')
        if limit_param.lower() == 'all':
            limit = None
        else:
            try:
                limit = int(limit_param)
            except (ValueError, TypeError):
                limit = 5  # default

        order = request.query_params.get('order', '-id')
        fields_param = request.query_params.get('fields', '')

        # parse fields
        if fields_param.lower() in ('', 'all'):
            fields = None
        else:
            fields = [f.strip() for f in fields_param.split(',')]

        # build queryset
        qs = self.get_queryset().order_by(order)
        if limit is not None:
            qs = qs[:limit]

        data = self.get_serializer(qs, many=True).data

        # se não há filtro de campos, retorna tudo
        if not fields:
            return Response(data)

        # filtra somente os campos solicitados
        filtered = []
        for item in data:
            row = {}
            for fld in fields:
                # acessa chaves aninhadas se houver
                val = item
                for key in fld.split('.'):
                    val = val.get(key, None)
                    if val is None:
                        break
                if val is not None:
                    row[key] = val
            filtered.append(row)
        return Response(filtered)




class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        try:
            usuario = Usuario.objects.get(user=request.user)
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=404)

        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)


    def perform_create(self, serializer):
        serializer.save()

class ClienteViewSet(DynamicListMixin, viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ClienteCreateSerializer
        return ClienteSerializer

    @action(detail=False, methods=['get'])
    def buscar(self, request):
        termo = request.query_params.get('termo', '')
        if not termo:
            return Response([])
        
        clientes = Cliente.objects.filter(
            models.Q(nome__icontains=termo) |
            models.Q(cpf__icontains=termo) |
            models.Q(telefone__icontains=termo)
        )
        
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)

class EnderecoViewSet(DynamicListMixin, viewsets.ModelViewSet):
    queryset = Endereco.objects.all()
    serializer_class = EnderecoSerializer
    permission_classes = [IsAuthenticated]

class EstoqueViewSet(DynamicListMixin, viewsets.ModelViewSet):
    queryset = Estoque.objects.all()
    serializer_class = EstoqueSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def buscar_produto(self, request):
        produto = request.query_params.get('produto')

        if not produto:
            return Response({'detail': 'Nome do produto é obrigatório.'}, status=400)

        try:
            estoque = Estoque.objects.get(produto=produto)
            serializer = self.get_serializer(estoque)
            return Response(serializer.data)
        except Estoque.DoesNotExist:
            return Response({'detail': 'Produto não encontrado.'}, status=404)

class EstoqueMovimentacaoViewSet(DynamicListMixin, viewsets.ModelViewSet):
    queryset = EstoqueMovimentacao.objects.all()
    serializer_class = EstoqueMovimentacaoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        with transaction.atomic():
            movimentacao = serializer.save()
            estoque = movimentacao.id_produto
            
            # Update stock quantity
            if movimentacao.tipo_movimentacao:  # Entry
                estoque.quantidade += movimentacao.quantidade
            else:  # Exit
                if estoque.quantidade < movimentacao.quantidade:
                    raise serializers.ValidationError(
                        {"quantidade": "Quantidade insuficiente em estoque"}
                    )
                estoque.quantidade -= movimentacao.quantidade

            if estoque.quantidade == 0:
            # Remove o item do estoque se zerar
                estoque.delete()

            else:
                estoque.save()

class VendaViewSet(DynamicListMixin, viewsets.ModelViewSet):
    queryset = Venda.objects.all()
    serializer_class = VendaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        with transaction.atomic():
            venda = serializer.save()
            
            # Create stock movement
            EstoqueMovimentacao.objects.create(
                id_produto=venda.id_produto,
                id_usuario=venda.id_usuario,
                tipo_movimentacao=False,  # Exit
                quantidade=venda.quantidade,
                valor=venda.valor_venda,
                observacoes=f"Venda #{venda.id_venda}"
            )
            
            # Update product's last sale date
            produto = venda.id_produto
            produto.data_ultima_venda = venda.data_venda
            produto.save()
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        venda = self.get_object()
        novo_status = request.data.get('status')

        if novo_status is None:
            return Response(
                {'detail': 'Status não fornecido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            novo_status = int(novo_status)
        except ValueError:
            return Response(
                {'detail': 'Status inválido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Se o status for "1 = concluído", faz a baixa no estoque
        if novo_status == 1 and venda.status_pedido != 1:
            with transaction.atomic():
                estoque = venda.id_produto

                if estoque.quantidade < venda.quantidade:
                    return Response(
                        {'detail': 'Estoque insuficiente para concluir a venda.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Cria movimentação de saída
                EstoqueMovimentacao.objects.create(
                    id_produto=estoque,
                    id_usuario=venda.id_usuario,
                    tipo_movimentacao=False,  # Saída
                    quantidade=venda.quantidade,
                    valor=venda.valor_venda,
                    observacoes=f"Conclusão da venda #{venda.id_venda}"
                )

                # Atualiza o estoque
                estoque.quantidade -= venda.quantidade
                if estoque.quantidade == 0:
                    estoque.delete()
                else:
                    estoque.save()

        # Atualiza o status da venda
        venda.status_pedido = novo_status
        venda.save()

        return Response({'status': 'Status atualizado com sucesso'})
