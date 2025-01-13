import requests
from django.db import models
from rest_framework.exceptions import ValidationError


class Group(models.Model):
    code = models.CharField(unique=True, max_length=50,
                            verbose_name="Код группы")
    fa_id = models.IntegerField(verbose_name="FA ID", unique=True)
    description = models.CharField(max_length=150, verbose_name="Описание")
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Последнее изменение")

    def __str__(self):
        return self.code

    @classmethod
    def create(cls, code):
        if Group.objects.filter(code=code).exists():
            raise ValidationError("Группа уже существует")

        group_data = None
        url = f"https://ruz.fa.ru/api/search?term={code}&type=group"
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            for group in response.json():
                if group.get("label") == code:
                    group_data = group
        if not group_data:
            raise ValidationError("Группа не существует")

        group_data = {
            "code": code, "fa_id": group_data.get("id"), "description": group_data.get("description", "")}
        group = cls(**group_data)
        group.full_clean()
        group.save()
        return group


class Discipline(models.Model):
    name = models.CharField(max_length=150, verbose_name="Название")
    fa_id = models.IntegerField(verbose_name="FA ID", unique=True)

    def __str__(self):
        return self.name


class ActivityType(models.Model):
    name = models.CharField(max_length=150, verbose_name="Название")
    fa_id = models.IntegerField(verbose_name="FA ID", unique=True)

    def __str__(self):
        return self.name


class Activity(models.Model):
    activity_type = models.ForeignKey(
        ActivityType, models.CASCADE, verbose_name="Тип активности")
    discipline = models.ForeignKey(
        Discipline, models.CASCADE, verbose_name="Дисциплина")
    group = models.ForeignKey(Group, models.CASCADE, verbose_name="Группа")
    note = models.CharField(
        verbose_name="Заметка", max_length=250, blank=True, null=True)
    teacher = models.CharField(verbose_name="Лектор", max_length=150)
    date = models.DateField(verbose_name='Дата')
    start_time = models.TimeField(verbose_name='Время начала')
    end_time = models.TimeField(verbose_name='Время окончания')
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Дата изменения")

    def __str__(self):
        return f"{self.group.code} {self.discipline.name} {self.date} {str(self.start_time)[:5]} {str(self.end_time)[:5]}"
