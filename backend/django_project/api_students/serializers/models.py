from rest_framework import serializers
from api_students.models import *


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class StudentRecordSerializer(serializers.ModelSerializer):
    student = StudentSerializer()

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
