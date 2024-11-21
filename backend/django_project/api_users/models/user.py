from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser


class UserModel(AbstractUser):
    email = models.EmailField(max_length=300, blank=True, null=True,
                              verbose_name='Электронная почта')
    full_name = models.CharField(max_length=200, verbose_name='Полное имя')
    REQUIRED_FIELDS = ['full_name', 'user_type']

    def clean(self):
        if self.email:
            if UserModel.objects.exclude(pk=self.pk).filter(email=self.email).exists():
                raise ValidationError({
                    'email': 'Должен быть уникальным',
                })

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class PasswordReset(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
