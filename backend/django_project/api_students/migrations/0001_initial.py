# Generated by Django 5.0.2 on 2024-11-29 14:24

import api_students.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Discipline',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Название дисциплины')),
                ('code', models.IntegerField(unique=True, verbose_name='Fa ID')),
                ('date', models.DateField(verbose_name='Дата')),
                ('quantity_users', models.IntegerField(default=0, verbose_name='Количество пользователей')),
            ],
            options={
                'verbose_name': 'Дисциплина',
                'verbose_name_plural': 'Дисциплины',
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255, verbose_name='Полное имя')),
                ('telegram_id', models.CharField(blank=True, max_length=50, null=True, verbose_name='Telegram ID')),
                ('telegram_link', models.CharField(blank=True, max_length=255, null=True, verbose_name='Ссылка на Telegram')),
                ('username', models.CharField(max_length=50, unique=True, verbose_name='Логин')),
                ('password', models.TextField(verbose_name='Пароль')),
                ('group', models.CharField(blank=True, max_length=50, null=True, verbose_name='Группа')),
                ('phone', models.CharField(max_length=16, validators=[api_students.models.validate_whatsapp_number], verbose_name='Телефон (WhatsApp)')),
                ('is_verified', models.BooleanField(default=False, verbose_name='Верифицирован')),
                ('registration_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата/время регистрации')),
            ],
            options={
                'verbose_name': 'Студент',
                'verbose_name_plural': 'Студенты',
            },
        ),
        migrations.CreateModel(
            name='TypeActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('test', 'Зачет'), ('seminar+test', 'Семинар+Зачет')], default='test', max_length=50)),
            ],
            options={
                'verbose_name': 'Тип активности',
                'verbose_name_plural': 'Тип активности',
            },
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.CharField(max_length=255, verbose_name='Измененное поле')),
                ('old_value', models.TextField(blank=True, null=True, verbose_name='Старое значение')),
                ('new_value', models.TextField(blank=True, null=True, verbose_name='Новое значение')),
                ('timestamp', models.DateTimeField(auto_now_add=True, verbose_name='Дата изменения')),
                ('student', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='api_students.student', verbose_name='Студент')),
            ],
            options={
                'verbose_name': 'Лог изменений',
                'verbose_name_plural': 'Логи изменений',
            },
        ),
        migrations.CreateModel(
            name='StudentRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(verbose_name='Дата экзамена')),
                ('discipline', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api_students.discipline')),
                ('student', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='records_students_student', to='api_students.student')),
                ('type_activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_students.typeactivity')),
            ],
            options={
                'verbose_name': 'Записи студента',
                'verbose_name_plural': 'Записи студентов',
            },
        ),
    ]