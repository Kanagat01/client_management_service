# Generated by Django 5.0.2 on 2024-12-13 12:44

import api_students.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityType',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, verbose_name='Название')),
                ('fa_id', models.IntegerField(verbose_name='FA ID')),
            ],
        ),
        migrations.CreateModel(
            name='Discipline',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, verbose_name='Название')),
                ('fa_id', models.IntegerField(verbose_name='FA ID')),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50,
                 unique=True, verbose_name='Код группы')),
                ('fa_id', models.IntegerField(verbose_name='FA ID')),
                ('description', models.CharField(
                    max_length=150, verbose_name='Описание')),
                ('created_at', models.DateTimeField(
                    auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(
                    auto_now=True, verbose_name='Последнее изменение')),
            ],
        ),
        migrations.CreateModel(
            name='PasswordReset',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('token', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('note', models.CharField(blank=True,
                 max_length=250, null=True, verbose_name='Заметка')),
                ('teacher', models.CharField(max_length=150, verbose_name='Лектор')),
                ('date', models.DateField(verbose_name='Дата')),
                ('time_start', models.TimeField(verbose_name='Время начала')),
                ('time_end', models.TimeField(verbose_name='Время окончания')),
                ('updated_at', models.DateTimeField(
                    auto_now=True, verbose_name='Дата изменения')),
                ('marked_as_proctoring', models.BooleanField(
                    verbose_name='Установлена как прокторинг')),
                ('marked_by_students_as_proctoring', models.BooleanField(
                    verbose_name='Помечена студентами как прокторинг')),
                ('activity_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 to='api_students.activitytype', verbose_name='Тип активности')),
                ('discipline', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 to='api_students.discipline', verbose_name='Дисциплина')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 to='api_students.group', verbose_name='Группа')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(verbose_name='Текст сообщения')),
                ('schedule_date', models.DateTimeField(
                    verbose_name='Дата и время рассылки')),
                ('is_sent', models.BooleanField(verbose_name='Отправлено')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 to='api_students.group', verbose_name='Группа')),
            ],
            options={
                'verbose_name': 'Сообщение',
                'verbose_name_plural': 'Сообщения',
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(
                    max_length=255, verbose_name='Полное имя')),
                ('telegram_id', models.CharField(blank=True,
                 max_length=50, null=True, verbose_name='Telegram ID')),
                ('telegram_link', models.CharField(blank=True, max_length=255,
                 null=True, verbose_name='Ссылка на Telegram')),
                ('username', models.CharField(
                    max_length=50, unique=True, verbose_name='Логин')),
                ('password', models.TextField(verbose_name='Пароль')),
                ('phone', models.CharField(max_length=16, validators=[
                 api_students.models.validate_whatsapp_number], verbose_name='Телефон (WhatsApp)')),
                ('is_verified', models.BooleanField(
                    default=False, verbose_name='Верифицирован')),
                ('registration_date', models.DateTimeField(
                    auto_now_add=True, verbose_name='Дата/время регистрации')),
                ('group', models.ForeignKey(blank=True, null=True,
                 on_delete=django.db.models.deletion.SET_NULL, to='api_students.group', verbose_name='Группа')),
            ],
            options={
                'verbose_name': 'Студент',
                'verbose_name_plural': 'Студенты',
            },
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.CharField(
                    max_length=255, verbose_name='Измененное поле')),
                ('old_value', models.TextField(blank=True,
                 null=True, verbose_name='Старое значение')),
                ('new_value', models.TextField(blank=True,
                 null=True, verbose_name='Новое значение')),
                ('created_at', models.DateTimeField(
                    auto_now_add=True, verbose_name='Дата изменения')),
                ('student', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE,
                 related_name='logs', to='api_students.student', verbose_name='Студент')),
            ],
            options={
                'verbose_name': 'Лог изменений',
                'verbose_name_plural': 'Логи изменений',
            },
        ),
        migrations.CreateModel(
            name='Code',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=250, verbose_name='Код')),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 to='api_students.activity', verbose_name='Активность')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 to='api_students.student', verbose_name='Получатель')),
            ],
        ),
        migrations.CreateModel(
            name='StudentRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(verbose_name='Дата')),
                ('time_start', models.TimeField(verbose_name='Время начала')),
                ('time_end', models.TimeField(verbose_name='Время конца')),
                ('activity', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                 to='api_students.activity', verbose_name='Активность')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='records', to='api_students.student', verbose_name='Студент')),
            ],
            options={
                'verbose_name': 'Записи студента',
                'verbose_name_plural': 'Записи студентов',
            },
        ),
    ]
