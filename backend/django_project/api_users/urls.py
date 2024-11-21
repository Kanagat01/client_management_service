from django.urls import path, include
from .views import *

auth = [
    path('login/', Login.as_view()),
    path('reset_password/', PasswordResetView.as_view()),
    path('reset_password_confirm/<str:token>/',
         PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
]


urlpatterns = [
    path('auth/', include(auth)),
]
