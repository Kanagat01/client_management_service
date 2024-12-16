from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api_students.views import *

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'student-records', StudentRecordViewSet)
router.register(r'activity-types', ActivityTypeViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'disciplines', DisciplineViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'codes', CodeViewSet)
router.register(r'logs', LogViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path('login/', Login.as_view()),
    path('reset_password/', PasswordResetView.as_view()),
    path('reset_password_confirm/<str:token>/',
         PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
]
