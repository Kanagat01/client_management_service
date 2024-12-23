import pandas as pd
from rest_framework import mixins, viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from api_students.models import *
from api_students.serializers import *
from backend.global_functions import error_with_text, export_to_excel, success_with_text


class CodeViewSet(viewsets.ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def export_codes_view(request):
    auth_token = request.GET.get('token')
    try:
        _token = Token.objects.get(key=auth_token)
    except Token.DoesNotExist:
        return Response({"detail": "Unauthorised"}, status=status.HTTP_401_UNAUTHORIZED)

    codes = Code.objects.all()
    data = CodeSerializer(codes, many=True).data
    columns = {
        "id": "ID",
        "code": "Код",
        "recipient": "Получатель",
        "activity": "Активность"
    }
    return export_to_excel(request, data, columns, filename="Коды для прокторинга")


# -------------------------  НАДО ПОФИКСИТЬ  -------------------------
@api_view(['POST'])
def import_codes_view(request):
    if 'file' not in request.FILES:
        return error_with_text("Файл не был загружен")

    file = request.FILES['file']
    try:
        df = pd.read_excel(file)
        if 'Название дисциплины' not in df.columns or 'FA ID' not in df.columns:
            return error_with_text('Файл должен содержать колонки "Название дисциплины" и "FA ID"')

        codes = []
        for _, row in df.iterrows():
            name = row['Название дисциплины']
            fa_id = row['FA ID']

            if Code.objects.filter(fa_id=fa_id).exists():
                continue

            codes.append(Code(name=name, fa_id=fa_id))

        Code.objects.bulk_create(codes)
        return success_with_text(f'Успешно импортировано {len(codes)} дисциплин')

    except Exception as e:
        return error_with_text(f'Ошибка при обработке файла: {str(e)}')


class MessageViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
