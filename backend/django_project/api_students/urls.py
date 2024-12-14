from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api_students.views import *

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'student-records', StudentRecordViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('logs/', LogView.as_view()),

    path('login/', Login.as_view()),
    path('reset_password/', PasswordResetView.as_view()),
    path('reset_password_confirm/<str:token>/',
         PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
]
