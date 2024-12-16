from django.db import models
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
    is_sent = models.BooleanField(verbose_name="Отправлено")

    def __str__(self):
        return f"Рассылка #{self.pk} - Группа {self.group}"

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"
