from rest_framework import serializers
from api_students.models import *
from .base import create_model_serializer


class CodeSerializer(serializers.ModelSerializer):
    recipient = serializers.StringRelatedField()
    activity = serializers.StringRelatedField()

    class Meta:
        model = Code
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()

    class Meta:
        model = Message
        fields = '__all__'
