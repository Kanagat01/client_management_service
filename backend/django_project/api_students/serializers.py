# api_students/serializers.py
from rest_framework import serializers
from .models import Student, TypeActivity, StudentRecord, Discipline, Log, Group, Message, Notification, TelegramAccount

# Сериализатор для модели Student
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'  # или перечислить конкретные поля, если необходимо

# Сериализатор для модели TypeActivity
class TypeActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeActivity
        fields = '__all__'

# Сериализатор для модели StudentRecord
class StudentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRecord
        fields = '__all__'

# Сериализатор для модели Discipline
class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = '__all__'

# Сериализатор для модели Log
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'

# Сериализатор для модели Group
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

# Сериализатор для модели Message
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

# Сериализатор для модели Notification
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

# Сериализатор для модели TelegramAccount
class TelegramAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramAccount
        fields = '__all__'
