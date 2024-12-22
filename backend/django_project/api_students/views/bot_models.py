from rest_framework import mixins, viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from api_students.models import *
from api_students.serializers import *
from backend.global_functions import export_to_excel


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


class MessageViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
