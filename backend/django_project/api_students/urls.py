from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'student-records', StudentRecordViewSet)
router.register(r'logs', LogViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'telegram-accounts', TelegramAccountViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
