from rest_framework import serializers
from api_students.models import *
from .university import ActivitySerializer


class StudentSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()

    class Meta:
        model = Student
        fields = '__all__'
        extra_kwargs = {}

    def __init__(self, *args, **kwargs):
        extra_kwargs = kwargs.pop('extra_kwargs', None)
        if extra_kwargs:
            self.Meta.extra_kwargs.update(extra_kwargs)
        super().__init__(*args, **kwargs)


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
