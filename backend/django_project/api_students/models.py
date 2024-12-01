import re
import requests
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from datetime import timedelta

# Функция для проверки WhatsApp номера
def validate_whatsapp_number(value):
    if not re.match(r'^\+\d{10,15}$', value):
        raise ValidationError("Введите корректный номер WhatsApp (формат: +1234567890)")

# Функция для проверки группы через rus.fs.ru
def validate_group(group):
    url = f'https://rus.fs.ru/check_group/{group}'
    response = requests.get(url)
    if response.status_code != 200 or not response.json().get('exists'):
        raise ValidationError("Группа не существует или недоступна")

# Студенты
class Student(models.Model):
    full_name = models.CharField(max_length=255, verbose_name="Полное имя")
    telegram_id = models.CharField(max_length=50, verbose_name="Telegram ID", blank=True, null=True)
    telegram_link = models.CharField(max_length=255, verbose_name="Ссылка на Telegram", blank=True, null=True)
    username = models.CharField(max_length=50, verbose_name="Логин", unique=True)
    password = models.TextField(verbose_name="Пароль")  # Пароль хранится в текстовом виде
    group = models.CharField(max_length=50, verbose_name="Группа", blank=True, null=True)
    phone = models.CharField(
        max_length=16, 
        verbose_name="Телефон (WhatsApp)", 
        validators=[validate_whatsapp_number]
    )
    is_verified = models.BooleanField(default=False, verbose_name="Верифицирован")
    registration_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата/время регистрации")

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Студент"
        verbose_name_plural = "Студенты"

# Тип активности
class TypeActivity(models.Model):
    status = models.CharField(max_length=50, choices=[('test', 'Зачет'), ('seminar+test', 'Семинар+Зачет')], default='test')

    def __str__(self):
        return dict(self._meta.get_field('status').choices).get(self.status, self.status)

    class Meta:
        verbose_name = "Тип активности"
        verbose_name_plural = "Тип активности"

# Дисциплина
class Discipline(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название дисциплины")
    code = models.IntegerField(verbose_name="Fa ID", unique=True)
    date = models.DateField(verbose_name="Дата")
    quantity_users = models.IntegerField(default=0, verbose_name="Количество пользователей")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Дисциплина"
        verbose_name_plural = "Дисциплины"


# Записи студентов
class StudentRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='records_students_student', default=1)
    type_activity = models.ForeignKey(TypeActivity, on_delete=models.CASCADE)
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, default=1)
    date = models.DateField(verbose_name="Дата экзамена")

    def save(self, *args, **kwargs):
        # Сохраняем запись студента
        super().save(*args, **kwargs)

        # Обновляем количество пользователей для дисциплины
        discipline = self.discipline
        discipline.quantity_users = discipline.studentrecord_set.count()
        discipline.save()

    def __str__(self):
        return f"{self.student.full_name} - {self.type_activity} - {self.discipline.name}"

    class Meta:
        verbose_name = "Записи студента"
        verbose_name_plural = "Записи студентов"


# Логи
class Log(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE, verbose_name="Студент", related_name="logs", default=1)
    field_name = models.CharField(max_length=255, verbose_name="Измененное поле")
    old_value = models.TextField(null=True, blank=True, verbose_name="Старое значение")
    new_value = models.TextField(null=True, blank=True, verbose_name="Новое значение")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Дата изменения")

    def __str__(self):
        return f"{self.student.full_name} ({self.student.telegram_link}) - {self.field_name}"

    class Meta:
        verbose_name = "Лог изменений"
        verbose_name_plural = "Логи изменений"


# Модели для рассылки сообщений
class Group(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  # Поле для даты создания

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Группа"
        verbose_name_plural = "Группы"

class Message(models.Model):
    text = models.TextField(verbose_name="Текст сообщения")
    date_sent = models.DateTimeField(auto_now_add=True, verbose_name="Дата отправки")
    scheduled_date = models.DateTimeField(null=True, blank=True, verbose_name="Дата отправки по расписанию")
    is_sent = models.BooleanField(default=False, verbose_name="Отправлено?")
    group = models.ForeignKey(Group, related_name='messages', on_delete=models.CASCADE, null=True, blank=True)
    student = models.ForeignKey(Student, related_name='messages', on_delete=models.CASCADE, null=True, blank=True)
    is_group_message = models.BooleanField(default=True)  # True for group, False for individual

    def __str__(self):
        return f"Message to {self.group.name if self.is_group_message else self.student.username}"

    def send_message(self):
        # Эта функция будет отправлять сообщения через API (например, Telegram или WhatsApp)
        if self.is_group_message:
            # Send message to the whole group
            pass
        else:
            # Send message to the individual student
            pass

    def schedule_message(self):
        if self.scheduled_date and self.scheduled_date <= now():
            self.send_message()
            self.is_sent = True
            self.save()

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"


class TelegramAccount(models.Model):
    user = models.OneToOneField(Student, on_delete=models.CASCADE)
    telegram_id = models.CharField(max_length=100)
    group = models.ForeignKey(Group, related_name='telegram_accounts', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.telegram_id}"
    
    class Meta:
        verbose_name = "Телеграм аккаунт"
        verbose_name_plural = "Телеграм аккаунты"

class Notification(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    notification_date = models.DateTimeField(default=now)
    is_notified = models.BooleanField(default=False)

    def send_telegram_notification(self):
        # Этот метод отправляет уведомление через Telegram API
        pass

    def __str__(self):
        return f"Notification for {self.group.name} | {self.message.text[:20]}"
    
    class Meta:
        verbose_name = "Уведомление"
        verbose_name_plural = "Уведомления"
