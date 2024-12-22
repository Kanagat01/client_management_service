from rest_framework import serializers
from api_students.models import Discipline, Group, ActivityType, Activity
from .base import create_model_serializer


DisciplineSerializer = create_model_serializer(Discipline)
GroupSerializer = create_model_serializer(Group)
ActivityTypeSerializer = create_model_serializer(ActivityType)


class ActivitySerializer(serializers.ModelSerializer):
    activity_type = serializers.StringRelatedField()
    group = serializers.StringRelatedField()
    discipline = serializers.StringRelatedField()

    class Meta:
        model = Activity
        fields = '__all__'
        extra_kwargs = {
            'time_start': {'format': '%H:%M'},
            'time_end': {'format': '%H:%M'},
        }
