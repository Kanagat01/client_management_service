import re
from django.db import models
from django.core.exceptions import ValidationError
from .university import Group, Activity


def validate_whatsapp_number(value):
    if not re.match(r'^\+\d{10,15}$', value):
        raise ValidationError(
            "Введите корректный номер WhatsApp (формат: +1234567890)")


class Student(models.Model):
    full_name = models.CharField(max_length=255, verbose_name="Полное имя")
    telegram_id = models.IntegerField(
        verbose_name="Telegram ID", blank=True, null=True)
    telegram_link = models.CharField(
        max_length=255, verbose_name="Ссылка на Telegram", blank=True, null=True)
    username = models.CharField(
        max_length=50, verbose_name="Логин", unique=True)
    # Пароль хранится в текстовом виде
    password = models.TextField(verbose_name="Пароль")
    group = models.ForeignKey(
        Group, on_delete=models.SET_NULL, verbose_name="Группа", blank=True, null=True)
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
        Student, on_delete=models.CASCADE, related_name='records', verbose_name="Студент")
    activity = models.ForeignKey(
        Activity, on_delete=models.SET_NULL, null=True, verbose_name="Активность")
    date = models.DateField(verbose_name='Дата')
    time_start = models.TimeField(verbose_name='Время начала')
    time_end = models.TimeField(verbose_name='Время конца')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

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
        return f"Лог #{self.pk} - {self.student}"

    class Meta:
        verbose_name = "Лог изменений"
        verbose_name_plural = "Логи изменений"
