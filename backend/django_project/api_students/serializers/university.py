from rest_framework import serializers
from api_students.models import Discipline, Group, ActivityType, Activity
from .base import create_model_serializer


GroupSerializer = create_model_serializer(Group)
DisciplineSerializer = create_model_serializer(Discipline)
ActivityTypeSerializer = create_model_serializer(ActivityType)


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        extra_kwargs = {
            'start_time': {'format': '%H:%M'},
            'end_time': {'format': '%H:%M'},
        }

    def to_representation(self, instance: Activity) -> dict:
        representation = super().to_representation(instance)
        representation['activity_type_id'] = instance.activity_type.pk
        representation['activity_type'] = str(instance.activity_type)
        representation['group_id'] = instance.group.pk
        representation['group'] = str(instance.group)
        representation['discipline_id'] = instance.discipline.pk
        representation['discipline'] = str(instance.discipline)
        return representation
