# Generated by Django 5.0.2 on 2025-01-02 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_students', '0010_discount'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activity',
            name='marked_as_proctoring',
        ),
        migrations.RemoveField(
            model_name='activity',
            name='marked_by_students_as_proctoring',
        ),
        migrations.AddField(
            model_name='studentrecord',
            name='marked_as_proctoring',
            field=models.BooleanField(default=False, verbose_name='Установлена как прокторинг'),
        ),
    ]
