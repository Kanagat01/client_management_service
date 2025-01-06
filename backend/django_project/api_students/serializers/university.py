from rest_framework import serializers
from api_students.models import Discipline, Group, ActivityType, Activity
from .base import create_model_serializer


GroupSerializer = create_model_serializer(Group)
DisciplineSerializer = create_model_serializer(Discipline)
ActivityTypeSerializer = create_model_serializer(ActivityType)


class ActivitySerializer(serializers.ModelSerializer):
    activity_type = serializers.StringRelatedField()
    group = serializers.StringRelatedField()
    discipline = serializers.StringRelatedField()

    class Meta:
        model = Activity
        fields = '__all__'
        extra_kwargs = {
            'start_time': {'format': '%H:%M'},
            'end_time': {'format': '%H:%M'},
        }
