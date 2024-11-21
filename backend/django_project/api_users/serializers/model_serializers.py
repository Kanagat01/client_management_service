from api_users.models import *
from rest_framework import serializers


class UserModelSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = UserModel
        fields = ['user_id', 'email', 'user_type', 'full_name']
