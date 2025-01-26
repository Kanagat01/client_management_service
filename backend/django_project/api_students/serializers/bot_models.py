import base64
from rest_framework import serializers
from django.core.files.storage import default_storage
from api_students.models import *
from .base import create_model_serializer


DiscountSerializer = create_model_serializer(Discount)


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
            representation["student_id"] = instance.student.pk
            representation["student"] = f"{instance.student.fa_login} ({instance.student.full_name})"
            representation["telegram_link"] = instance.student.telegram_link
        return representation


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        extra_kwargs = {
            "schedule_datetime": {
                "format": "%d-%m-%Y %H:%M"
            }
        }

    def to_representation(self, instance: Message):
        representation = super().to_representation(instance)
        if instance.student:
            representation["student"] = str(instance.student)
            representation["student_id"] = instance.student.pk
        elif instance.group:
            representation["group"] = str(instance.group)
            representation["group_id"] = instance.group.pk
        return representation


class InstructionForProctoringSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructionForProctoring
        fields = '__all__'
