from rest_framework import viewsets
from .models import *
from .serializers import *
from backend.global_functions import success_with_text, error_with_text


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentRecordViewSet(viewsets.ModelViewSet):
    queryset = StudentRecord.objects.all()
    serializer_class = StudentRecordSerializer


class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class TelegramAccountViewSet(viewsets.ModelViewSet):
    queryset = TelegramAccount.objects.all()
    serializer_class = TelegramAccountSerializer
