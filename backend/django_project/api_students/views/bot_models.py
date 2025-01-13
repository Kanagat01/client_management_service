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


class CodeViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        instruction = InstructionForProctoring.objects.first()
        instruction_data = InstructionForProctoringSerializer(
            instruction).data if instruction else None
        response.data = {
            "codes": response.data,
            "instruction_for_proctoring": instruction_data
        }
        return response


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
        "value": "Значение",
        "status": "Статус",
        "telegram_link": "Телеграмм",
        "student": "Кем использован",
        "created_at": "Дата получения",
    }
    return export_to_excel(request, data, columns, filename="Коды для прокторинга")


@api_view(['POST'])
def import_codes_view(request):
    if 'file' not in request.FILES:
        return error_with_text("Файл не был загружен")

    file = request.FILES['file']
    try:
        df = pd.read_excel(file)
        columns = ["Значение"]
        if not all(col in df.columns for col in columns):
            return error_with_text('Файл должен содержать колонку "Значение"')

        codes = []
        existing_values = set(Code.objects.values_list('value', flat=True))
        new_values = set()

        for _, row in df.iterrows():
            value = row['Значение']

            if value in existing_values or value in new_values:
                continue
            new_values.add(value)
            codes.append(Code(value=value))

        Code.objects.bulk_create(codes)
        return success_with_text(CodeSerializer(codes, many=True).data)

    except Exception as e:
        return error_with_text(f'Ошибка при обработке файла: {str(e)}')


class MessageViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class InstructionForProctoringViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin):
    queryset = InstructionForProctoring.objects.all()
    serializer_class = InstructionForProctoringSerializer

    def create(self, request, *args, **kwargs):
        if InstructionForProctoring.objects.exists():
            return self.update(request, *args, **kwargs)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = InstructionForProctoring.objects.first()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
