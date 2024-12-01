from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, TypeActivityViewSet, StudentRecordViewSet, DisciplineViewSet, LogViewSet, GroupViewSet, MessageViewSet, NotificationViewSet, TelegramAccountViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'type-activities', TypeActivityViewSet)
router.register(r'student-records', StudentRecordViewSet)
router.register(r'disciplines', DisciplineViewSet)
router.register(r'logs', LogViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'telegram-accounts', TelegramAccountViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
