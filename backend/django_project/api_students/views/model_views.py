from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from backend.global_functions import success_with_text, error_with_text
from api_students.models import *
from api_students.serializers import *


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentRecordViewSet(viewsets.ModelViewSet):
    queryset = StudentRecord.objects.all()
    serializer_class = StudentRecordSerializer


class LogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = Log.objects.all()
        return success_with_text(LogSerializer(logs, many=True).data)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
