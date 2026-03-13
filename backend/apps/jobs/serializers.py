from rest_framework import serializers
from .models import Job, Offer, Category
from users.serializers import UserPublicSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class OfferSerializer(serializers.ModelSerializer):
    worker = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = Offer
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    client = UserPublicSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    offers_count = serializers.IntegerField(source='offers.count', read_only=True)

    class Meta:
        model = Job
        fields = '__all__'