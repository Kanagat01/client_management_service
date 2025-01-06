from rest_framework import serializers
from api_students.models import Student, StudentRecord, Log
from .university import ActivitySerializer


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
        extra_kwargs = {}

    def __init__(self, *args, **kwargs):
        extra_kwargs = kwargs.pop('extra_kwargs', None)
        if extra_kwargs:
            self.Meta.extra_kwargs.update(extra_kwargs)
        super().__init__(*args, **kwargs)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['group'] = str(instance.group)
        return representation


class StudentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRecord
        fields = '__all__'

    def to_representation(self, instance: StudentRecord) -> dict:
        representation = super().to_representation(instance)
        representation['student'] = str(instance.student)
        representation['student_id'] = instance.student.pk
        representation['telegram_link'] = instance.student.telegram_link
        representation['activity'] = ActivitySerializer(instance.activity).data
        return representation


class LogSerializer(serializers.ModelSerializer):
    student = serializers.CharField(source='student.telegram_link')
    telegram_id = serializers.IntegerField(source='student.telegram_id')

    class Meta:
        model = Log
        fields = '__all__'
