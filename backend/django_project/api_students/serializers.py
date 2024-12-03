from rest_framework import serializers
from .models import *


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class StudentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRecord
        fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class TelegramAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramAccount
        fields = '__all__'
