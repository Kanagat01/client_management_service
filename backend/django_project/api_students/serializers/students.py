from rest_framework import serializers
from api_students.models import *
from .university import ActivitySerializer


class StudentSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()

    class Meta:
        model = Student
        fields = '__all__'


class StudentRecordSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField()
    telegram_link = serializers.CharField(source='student.telegram_link')
    activity = ActivitySerializer()

    class Meta:
        model = StudentRecord
        fields = '__all__'
        extra_kwargs = {
            'time_start': {'format': '%H:%M'},
            'time_end': {'format': '%H:%M'},
        }


class LogSerializer(serializers.ModelSerializer):
    student = serializers.CharField(source='student.telegram_link')
    telegram_id = serializers.IntegerField(source='student.telegram_id')

    class Meta:
        model = Log
        fields = '__all__'
