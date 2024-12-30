from django.db import models


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
    note = models.CharField(verbose_name="Заметка",
                            max_length=250, blank=True, null=True)
    teacher = models.CharField(verbose_name="Лектор", max_length=150)
    date = models.DateField(verbose_name='Дата')
    time_start = models.TimeField(verbose_name='Время начала')
    time_end = models.TimeField(verbose_name='Время окончания')
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Дата изменения")
    marked_as_proctoring = models.BooleanField(
        verbose_name="Установлена как прокторинг")
    marked_by_students_as_proctoring = models.BooleanField(
        verbose_name="Помечена студентами как прокторинг")

    def __str__(self):
        return f"{self.group.code} {self.discipline.name} {self.date} {str(self.time_start)[:5]} {str(self.time_end)[:5]}"
