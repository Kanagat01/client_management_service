import pandas as pd
from rest_framework import mixins, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend.global_functions import error_with_text, success_with_text
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


@api_view(['POST'])
def import_disciplines_view(request):
    if 'file' not in request.FILES:
        return error_with_text("Файл не был загружен")

    file = request.FILES['file']
    try:
        df = pd.read_excel(file)
        if 'Название дисциплины' not in df.columns or 'FA ID' not in df.columns:
            return error_with_text('Файл должен содержать колонки "Название дисциплины" и "FA ID"')

        disciplines = []
        for _, row in df.iterrows():
            name = row['Название дисциплины']
            fa_id = row['FA ID']

            if Discipline.objects.filter(fa_id=fa_id).exists():
                continue

            disciplines.append(Discipline(name=name, fa_id=fa_id))

        Discipline.objects.bulk_create(disciplines)
        return success_with_text(f'Успешно импортировано {len(disciplines)} дисциплин')

    except Exception as e:
        return error_with_text(f'Ошибка при обработке файла: {str(e)}')


class GroupViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
