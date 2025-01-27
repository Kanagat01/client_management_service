import re
import requests
from bs4 import BeautifulSoup
from asgiref.sync import async_to_sync
from django.db import models
from rest_framework.exceptions import ValidationError
from aiogram.exceptions import TelegramBadRequest

from tgbot.create_bot import bot
from .university import Group, Activity


def validate_whatsapp_number(value):
    if not re.match(r'^\+\d{10,15}$', value):
        raise ValidationError(
            "Введите корректный номер WhatsApp (формат: +1234567890)")


class Student(models.Model):
    full_name = models.CharField(
        max_length=255, verbose_name="Полное имя", null=True)
    telegram_id = models.BigIntegerField(
        verbose_name="Telegram ID")
    telegram_link = models.CharField(
        max_length=255, verbose_name="Ссылка на Telegram", blank=True, null=True)
    fa_login = models.CharField(
        max_length=50, verbose_name="Логин", unique=True)
    # Пароль хранится в текстовом виде
    fa_password = models.CharField(max_length=100, verbose_name="Пароль")
    group = models.ForeignKey(
        Group, on_delete=models.SET_NULL, null=True, verbose_name="Группа", related_name="students")
    phone = models.CharField(
        max_length=16,
        verbose_name="Телефон (WhatsApp)",
        validators=[validate_whatsapp_number],
        blank=True, null=True
    )
    is_verified = models.BooleanField(
        default=False, verbose_name="Верифицирован")
    is_blocked = models.BooleanField(
        default=False, verbose_name="Заблокирован")
    registration_date = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата/время регистрации")

    class Meta:
        verbose_name = "Студент"
        verbose_name_plural = "Студенты"

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        if self.pk:
            old_instance = Student.objects.get(pk=self.pk)

            if old_instance.fa_login != self.fa_login or old_instance.fa_password != self.fa_password:
                self.update_full_name()

            for field in self._meta.fields:
                field_name = field.name
                old_value = getattr(old_instance, field_name)
                new_value = getattr(self, field_name)
                if old_value != new_value:
                    Log.objects.create(
                        student=self,
                        field_name=field.verbose_name,
                        old_value=old_value,
                        new_value=new_value
                    )
        else:
            self.update_full_name()

        if not self.telegram_link:
            self.update_telegram_link()

        super().save(*args, **kwargs)

    def update_full_name(self):
        response = requests.post(
            "https://campus.fa.ru/login/index.php",
            data={"username": self.fa_login, "password": self.fa_password}
        )
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string if soup.title else ""

        if "Личный кабинет" not in title:
            raise ValidationError(
                "Неправильный логин или пароль, проверьте введенные данные", code='invalid_credentials'
            )

        selector = "#inst110 > div > div > div.w-100.no-overflow > div.myprofileitem.fullname"
        self.full_name = soup.select_one(selector).text.strip()

    def update_telegram_link(self):
        try:
            user = async_to_sync(bot.get_chat)(self.telegram_id)
            if user.username:
                self.telegram_link = f"https://t.me/{user.username}"
        except TelegramBadRequest as e:
            raise ValidationError(
                f"Ошибка: чат с ID {self.telegram_id} не найден. \nДетали: {e}")
        except Exception as e:
            raise ValidationError(f"Произошла непредвиденная ошибка: {e}")


class StudentRecord(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name='records', verbose_name="Студент")
    activity = models.ForeignKey(
        Activity, on_delete=models.SET_NULL, null=True, verbose_name="Активность")
    marked_as_proctoring = models.BooleanField(
        default=False, verbose_name="Установлена как прокторинг")

    class Meta:
        verbose_name = "Записи студента"
        verbose_name_plural = "Записи студентов"

    def __str__(self):
        return f"{self.student.full_name} - {self.activity.discipline}"

    def save(self, *args, **kwargs):
        if self.pk:
            old_instance = StudentRecord.objects.get(pk=self.pk)
            for field in self._meta.fields:
                field_name = field.name
                old_value = getattr(old_instance, field_name)
                new_value = getattr(self, field_name)
                if old_value != new_value:
                    Log.objects.create(
                        student=self.student,
                        field_name=field.verbose_name,
                        old_value=old_value,
                        new_value=new_value
                    )
        super().save(*args, **kwargs)


class Log(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE,
                                verbose_name="Студент", related_name="logs", default=1)
    field_name = models.CharField(
        max_length=255, verbose_name="Измененное поле")
    old_value = models.TextField(
        null=True, blank=True, verbose_name="Старое значение")
    new_value = models.TextField(
        null=True, blank=True, verbose_name="Новое значение")
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата изменения")

    def __str__(self):
        return f"Лог #{self.pk} - {self.student}"

    class Meta:
        verbose_name = "Лог изменений"
        verbose_name_plural = "Логи изменений"
