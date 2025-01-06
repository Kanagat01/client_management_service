from rest_framework import serializers
from api_students.models import *
from .base import create_model_serializer


class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = '__all__'
        extra_kwargs = {
            "created_at": {"format": "%d-%m-%Y %H:%M"}
        }

    def to_representation(self, instance: Code):
        representation = super().to_representation(instance)
        representation["status"] = "Использован" if instance.status == "used" else "Активный"
        if instance.student:
            representation["student"] = f"{instance.student.fa_login} ({instance.student.full_name})"
            representation["telegram_link"] = instance.student.telegram_link
        return representation


class MessageSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()

    class Meta:
        model = Message
        fields = '__all__'
