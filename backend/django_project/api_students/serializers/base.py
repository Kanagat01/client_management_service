from django.db.models import Model
from rest_framework import serializers


def create_model_serializer(model_class: Model):
    class GenericSerializer(serializers.ModelSerializer):
        class Meta:
            model = model_class
            fields = '__all__'
    return GenericSerializer
