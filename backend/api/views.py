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

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save()

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ClienteCreateSerializer
        return ClienteSerializer

class EnderecoViewSet(viewsets.ModelViewSet):
    queryset = Endereco.objects.all()
    serializer_class = EnderecoSerializer
    permission_classes = [IsAuthenticated]

class EstoqueViewSet(viewsets.ModelViewSet):
    queryset = Estoque.objects.all()
    serializer_class = EstoqueSerializer
    permission_classes = [IsAuthenticated]

class EstoqueMovimentacaoViewSet(viewsets.ModelViewSet):
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
            
            estoque.save()

class VendaViewSet(viewsets.ModelViewSet):
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
        status = request.data.get('status')
        
        if status is None:
            return Response(
                {'status': 'Status não fornecido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        venda.status_pedido = status
        venda.save()
        
        return Response({'status': 'Status atualizado com sucesso'}) 