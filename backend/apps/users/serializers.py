from rest_framework import serializers
from .models import User

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_picture', 'rating', 'is_verified']

class UserPrivateSerializer(serializers.ModelSerializer):
    balance = serializers.DecimalField(source='wallet.available_balance', max_digits=15, decimal_places=2, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'balance', 'is_verified']