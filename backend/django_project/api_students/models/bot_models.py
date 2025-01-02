from django.db import models
from rest_framework.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from .students import Student
from .university import Activity, Group


class Code(models.Model):
    code = models.CharField(verbose_name="Код", max_length=250)
    recipient = models.ForeignKey(
        Student, models.CASCADE, verbose_name="Получатель")
    activity = models.ForeignKey(
        Activity, models.CASCADE, verbose_name="Активность")

    def __str__(self):
        return f"Код #{self.pk}"


class Message(models.Model):
    group = models.ForeignKey(Group, models.CASCADE, verbose_name="Группа")
    text = models.TextField(verbose_name="Текст сообщения")
    schedule_datetime = models.DateTimeField(
        verbose_name="Дата и время рассылки")
    is_sent = models.BooleanField(verbose_name="Отправлено", default=False)

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"

    def __str__(self):
        return f"Рассылка #{self.pk} - Группа {self.group}"


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
