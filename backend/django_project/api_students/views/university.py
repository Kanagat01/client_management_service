from rest_framework import mixins, viewsets
from api_students.models import *
from api_students.serializers import *


class ActivityTypeViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = ActivityType.objects.all()
    serializer_class = ActivityTypeSerializer


class ActivityViewSet(
    viewsets.GenericViewSet,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class DisciplineViewSet(
    viewsets.GenericViewSet,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer


class GroupViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
