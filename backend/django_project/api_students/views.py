# api_students/views.py
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets
from .models import Student, TypeActivity, StudentRecord, Discipline, Log, Group, Message, Notification, TelegramAccount
from .serializers import StudentSerializer, TypeActivitySerializer, StudentRecordSerializer, DisciplineSerializer, LogSerializer, GroupSerializer, MessageSerializer, NotificationSerializer, TelegramAccountSerializer
from backend.global_functions import success_with_text, error_with_text

# ViewSet для модели Student
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

# ViewSet для модели TypeActivity
class TypeActivityViewSet(viewsets.ModelViewSet):
    queryset = TypeActivity.objects.all()
    serializer_class = TypeActivitySerializer

# ViewSet для модели StudentRecord
class StudentRecordViewSet(viewsets.ModelViewSet):
    queryset = StudentRecord.objects.all()
    serializer_class = StudentRecordSerializer

# ViewSet для модели Discipline
class DisciplineViewSet(viewsets.ModelViewSet):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer

# ViewSet для модели Log
class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer

# ViewSet для модели Group
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

# ViewSet для модели Message
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

# ViewSet для модели Notification
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

# ViewSet для модели TelegramAccount
class TelegramAccountViewSet(viewsets.ModelViewSet):
    queryset = TelegramAccount.objects.all()
    serializer_class = TelegramAccountSerializer


# Обычные views для работы с HTML-страницами
def add_discipline(request):
    discipline = Discipline.objects.create(name="New Discipline")
    return success_with_text('Discipline added successfully!')

def students_list(request):
    students = Student.objects.all()
    return render(request, 'students_list.html', {'students': students})

def add_record(request):
    if request.method == 'POST':
        student_id = request.POST.get('student_id')
        activity_id = request.POST.get('activity_id')
        discipline_id = request.POST.get('discipline_id')

        student = get_object_or_404(Student, id=student_id)
        type_activity = get_object_or_404(TypeActivity, id=activity_id)
        discipline = get_object_or_404(Discipline, id=discipline_id)

        record = StudentRecord.objects.create(
            student=student,
            type_activity=type_activity,
            discipline=discipline,
            date=request.POST.get('date')
        )
        return success_with_text("Record added successfully")

    return error_with_text('Invalid request method')

def disciplines_list(request):
    disciplines = Discipline.objects.all()
    return render(request, 'disciplines_list.html', {'disciplines': disciplines})

def logs_list(request):
    logs = Log.objects.select_related('student').all().order_by('-timestamp')
    return render(request, 'logs_list.html', {'logs': logs})

def groups_list(request):
    groups = Group.objects.all()
    return render(request, 'groups_list.html', {'groups': groups})

def add_group(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        group = Group.objects.create(name=name, description=description)
        return success_with_text('Group added successfully!')

    return error_with_text('Invalid request method')

def messages_list(request):
    messages = Message.objects.all().order_by('-scheduled_date')
    return render(request, 'messages_list.html', {'messages': messages})

def send_message(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        group_id = request.POST.get('group_id')
        student_id = request.POST.get('student_id')
        scheduled_date = request.POST.get('scheduled_date')
        is_group_message = request.POST.get('is_group_message') == 'on'

        group = get_object_or_404(Group, id=group_id) if is_group_message else None
        student = get_object_or_404(Student, id=student_id) if not is_group_message else None

        message = Message.objects.create(
            text=text,
            group=group,
            student=student,
            scheduled_date=timezone.now() if not scheduled_date else scheduled_date,
            is_group_message=is_group_message
        )
        return success_with_text('Message sent successfully!')

    return error_with_text('Invalid request method')

def notifications_list(request):
    notifications = Notification.objects.all().order_by('-notification_date')
    return render(request, 'notifications_list.html', {'notifications': notifications})

def send_notification(request):
    if request.method == 'POST':
        message_id = request.POST.get('message_id')
        group_id = request.POST.get('group_id')
        notification_date = request.POST.get('notification_date')

        message = get_object_or_404(Message, id=message_id)
        group = get_object_or_404(Group, id=group_id)

        notification = Notification.objects.create(
            message=message,
            group=group,
            notification_date=timezone.now() if not notification_date else notification_date
        )
        return success_with_text('Notification sent successfully!')

    return error_with_text('Invalid request method')

def add_telegram_account(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        telegram_id = request.POST.get('telegram_id')
        group_id = request.POST.get('group_id')

        user = get_object_or_404(Student, id=user_id)
        group = get_object_or_404(Group, id=group_id)

        telegram_account = TelegramAccount.objects.create(
            user=user,
            telegram_id=telegram_id,
            group=group
        )
        return success_with_text('Telegram account added successfully!')

    return error_with_text('Invalid request method')
