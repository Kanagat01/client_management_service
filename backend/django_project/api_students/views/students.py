from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from api_students.models import *
from api_students.serializers import *
from backend.global_functions import export_to_excel, success_with_text


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


@api_view(['GET'])
def delete_all_students_view(request):
    Student.objects.all()
    return success_with_text("ok")


@api_view(['GET'])
@permission_classes([AllowAny])
def export_students_view(request):
    auth_token = request.GET.get('token')
    try:
        _token = Token.objects.get(key=auth_token)
    except Token.DoesNotExist:
        return Response({"detail": "Unauthorised"}, status=status.HTTP_401_UNAUTHORIZED)

    students = Student.objects.all()
    data = StudentSerializer(
        students, many=True, extra_kwargs={'registration_date': {'format': '%d.%m.%Y %H:%M'}}
    ).data
    columns = {
        "full_name": "Студент",
        "telegram_link": "Ссылка",
        "username": "Логин",
        "password": "Пароль",
        "group": "Группа",
        "phone": "Телефон",
        "is_verified": "Верифицирован",
        "registration_date": "Дата/время регистрации"
    }
    return export_to_excel(request, data, columns, filename="Данные студентов")


class StudentRecordViewSet(viewsets.ModelViewSet):
    queryset = StudentRecord.objects.all()
    serializer_class = StudentRecordSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def export_student_records_view(request):
    auth_token = request.GET.get('token')
    try:
        _token = Token.objects.get(key=auth_token)
    except Token.DoesNotExist:
        return Response({"detail": "Unauthorised"}, status=status.HTTP_401_UNAUTHORIZED)

    student_records = StudentRecord.objects.select_related('activity').all()
    data = []
    for record in student_records:
        data.append({
            "student": str(record.student),
            "telegram_link": record.student.telegram_link,
            "group": str(record.activity.group) if record.activity else "",
            "activity_type": str(record.activity.activity_type) if record.activity else "",
            "discipline": str(record.activity.discipline) if record.activity else "",
            "teacher": record.activity.teacher if record.activity else "",
            "note": record.activity.note if record.activity else "",
            "date": record.date,
            "time_start": str(record.time_start)[:5],
            "time_end": str(record.time_end)[:5],
        })
    columns = {
        "student": "Студент",
        "telegram_link": "Ссылка",
        "group": "Группа",
        "activity_type": "Тип активности",
        "discipline": "Дисциплина",
        "teacher": "Лектор",
        "note": "Заметка",
        "date": "Дата",
        "time_start": "Время начала",
        "time_end": "Время конца",
    }
    return export_to_excel(request, data, columns, filename="Записи студентов")


class LogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
