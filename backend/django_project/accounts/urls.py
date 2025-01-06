from django.urls import path
from .views import *

urlpatterns = [
    path('login/', Login.as_view()),
    path('reset_password/', PasswordResetView.as_view()),
    path('reset_password_confirm/<str:token>/',
         PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path('user_profile/', UserProfileView.as_view()),
    path('change_password/', ChangePasswordView.as_view()),
]
