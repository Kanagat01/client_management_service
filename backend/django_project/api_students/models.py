import re
import requests
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.timezone import now


def validate_whatsapp_number(value):
    if not re.match(r'^\+\d{10,15}$', value):
        raise ValidationError(
            "Введите корректный номер WhatsApp (формат: +1234567890)")


def validate_group(group):
    url = f'https://rus.fs.ru/check_group/{group}'
    response = requests.get(url)
    if response.status_code != 200 or not response.json().get('exists'):
        raise ValidationError("Группа не существует или недоступна")


class Student(models.Model):
    full_name = models.CharField(max_length=255, verbose_name="Полное имя")
    telegram_id = models.CharField(
        max_length=50, verbose_name="Telegram ID", blank=True, null=True)
    telegram_link = models.CharField(
        max_length=255, verbose_name="Ссылка на Telegram", blank=True, null=True)
    username = models.CharField(
        max_length=50, verbose_name="Логин", unique=True)
    # Пароль хранится в текстовом виде
    password = models.TextField(verbose_name="Пароль")
    group = models.CharField(
        max_length=50, verbose_name="Группа", blank=True, null=True)
    phone = models.CharField(
        max_length=16,
        verbose_name="Телефон (WhatsApp)",
        validators=[validate_whatsapp_number]
    )
    is_verified = models.BooleanField(
        default=False, verbose_name="Верифицирован")
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
            for field in self._meta.fields:
                field_name = field.name
                old_value = getattr(old_instance, field_name)
                new_value = getattr(self, field_name)
                if old_value != new_value:
                    Log.objects.create(
                        student=self,
                        field_name=field_name,
                        old_value=old_value,
                        new_value=new_value
                    )
        super().save(*args, **kwargs)


class StudentRecord(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name='records', default=1)
    type_activity = models.CharField(max_length=150)
    discipline = models.CharField(max_length=150)
    date = models.DateField(verbose_name="Дата экзамена")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Записи студента"
        verbose_name_plural = "Записи студентов"

    def __str__(self):
        return f"{self.student.full_name} - {self.type_activity} - {self.discipline}"

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
                        field_name=field_name,
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
        return f"Лог #{self.pk} - Студент {self.student.full_name}"

    class Meta:
        verbose_name = "Лог изменений"
        verbose_name_plural = "Логи изменений"


class Message(models.Model):
    text = models.TextField(verbose_name="Текст сообщения")
    date_sent = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата отправки")
    scheduled_date = models.DateTimeField(
        null=True, blank=True, verbose_name="Дата отправки по расписанию")
    is_sent = models.BooleanField(default=False, verbose_name="Отправлено?")
    group = models.CharField(max_length=150)
    student = models.ForeignKey(
        Student, related_name='messages', on_delete=models.CASCADE, null=True, blank=True)
    # True for group, False for individual
    is_group_message = models.BooleanField(default=True)

    def __str__(self):
        return f"Сообщение для {self.group if self.is_group_message else self.student.username}"

    def send_message(self):
        '''Эта функция будет отправлять сообщения через API (например, Telegram или WhatsApp)'''
        if self.is_group_message:
            pass
        else:
            pass

    def schedule_message(self):
        if self.scheduled_date and self.scheduled_date <= now():
            self.send_message()
            self.is_sent = True
            self.save()

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"


class Notification(models.Model):
    group = models.CharField(max_length=150)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    notification_date = models.DateTimeField(default=now)
    is_notified = models.BooleanField(default=False)

    def send_telegram_notification(self):
        '''Этот метод отправляет уведомление через Telegram API'''
        pass

    def __str__(self):
        return f"Уведомления для {self.group} | {self.message.text[:20]}"

    class Meta:
        verbose_name = "Уведомление"
        verbose_name_plural = "Уведомления"
