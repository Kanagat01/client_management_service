from django.db import models
from rest_framework.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from .students import Student
from .university import Group


class Code(models.Model):
    value = models.CharField(verbose_name="Значение",
                             max_length=250, unique=True)
    status = models.CharField(
        max_length=10,
        choices=[
            ('used', 'Использован'),
            ('active', 'Активный'),
        ],
        default='active',
        verbose_name="Статус"
    )
    student = models.ForeignKey(
        Student, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(
        verbose_name="Дата получения", auto_now_add=True)

    def save(self, *args, **kwargs):
        self.status = "used" if self.student else "active"
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Код - {self.value}"


class Message(models.Model):
    receiver = models.CharField(verbose_name="Получатель", max_length=250)
    text = models.TextField(verbose_name="Текст сообщения")
    schedule_datetime = models.DateTimeField(
        verbose_name="Дата и время рассылки")
    is_sent = models.BooleanField(verbose_name="Отправлено", default=False)

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"

    def save(self, *args, **kwargs):
        if self.receiver.isdigit():
            if not Student.objects.filter(id=int(self.receiver)).exists():
                raise ValidationError("Студента с таким id не существует")
        else:
            if not Group.objects.filter(code=self.receiver).exists():
                raise ValidationError("Группы с таким кодом не существует")
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Рассылка #{self.pk}"


class InstructionForProctoring(models.Model):
    text = models.TextField(
        verbose_name="Текст инструкции", null=True, blank=True)
    video = models.FileField(
        verbose_name="Видео инструкция", upload_to="videos/",
        validators=[
            FileExtensionValidator(allowed_extensions=[
                                   'mp4', 'mov', 'avi', 'mkv']),
        ],
        null=True, blank=True
    )
    file = models.FileField(verbose_name="Файл инструкции",
                            upload_to="files/", null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.video and not self.file and not self.text:
            raise ValidationError("Нужно заполнить хотя бы одно поле")
        if InstructionForProctoring.objects.exists() and not self.pk:
            raise ValidationError(
                "Можно создать только один объект этой модели")
        return super().save(*args, **kwargs)


class Discount(models.Model):
    content = models.TextField(verbose_name="Текст")

    def __str__(self):
        return f"Скидка #{self.pk}"
