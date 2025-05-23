from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db.models import Sum
from .models import Usuario, Cliente, Endereco, Estoque, EstoqueMovimentacao, Venda

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class UsuarioSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Usuario
        fields = ('id_usuario', 'nome', 'login', 'password', 'password_confirm')
        extra_kwargs = {
            'password': {'write_only': True},
            'id_usuario': {'read_only': True}
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({"password": "As senhas não coincidem"})
        
        # Remove password_confirm from attrs since it's not a model field
        attrs.pop('password_confirm')
        return attrs

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_login(self, value):
        if Usuario.objects.filter(login=value).exists():
            raise serializers.ValidationError("Este login já está em uso")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(
            username=validated_data['login'],
            email=validated_data['login'],
            password=password
        )
        validated_data['user'] = user
        return super().create(validated_data)

class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        exclude = ['id_cliente']

class ClienteSerializer(serializers.ModelSerializer):
    endereco = EnderecoSerializer(read_only=True)

    class Meta:
        model = Cliente
        fields = ('id_cliente', 'nome', 'cpf', 'telefone', 'observacoes', 'endereco')

class ClienteCreateSerializer(serializers.ModelSerializer):
    endereco = EnderecoSerializer(required=False)

    class Meta:
        model = Cliente
        fields = ('id_cliente', 'nome', 'cpf', 'telefone', 'observacoes', 'endereco')
        read_only_fields = ('id_cliente',)

    def create(self, validated_data):
        endereco_data = validated_data.pop('endereco', None)
        cliente = Cliente.objects.create(**validated_data)

        if endereco_data:
            Endereco.objects.create(id_cliente=cliente, **endereco_data)

        return cliente

class EstoqueSerializer(serializers.ModelSerializer):
    estoque_disponivel = serializers.SerializerMethodField()
    class Meta:
        model = Estoque
        fields = '__all__'

    def get_estoque_disponivel(self, obj):
        reservas = Venda.objects.filter(
            id_produto=obj,
            status_pedido=0
        ).aggregate(total=Sum('quantidade'))['total'] or 0
        return obj.quantidade - reservas

class EstoqueMovimentacaoSerializer(serializers.ModelSerializer):
    produto = EstoqueSerializer(source='id_produto', read_only=True)
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)

    class Meta:
        model = EstoqueMovimentacao
        fields = '__all__'

class VendaSerializer(serializers.ModelSerializer):
    produto = EstoqueSerializer(source='id_produto', read_only=True)
    cliente = ClienteSerializer(source='id_cliente', read_only=True)
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)

    class Meta:
        model = Venda
        fields = ('id_venda', 'id_produto', 'produto', 'id_cliente', 'cliente',
                 'id_usuario', 'usuario', 'quantidade', 'valor_venda', 'data_venda',
                 'tipo_pagamento', 'status_pedido', 'observacoes') 