# Generated by Django 5.0.2 on 2024-12-22 16:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_students', '0005_delete_passwordreset'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='password',
            field=models.CharField(max_length=100, verbose_name='Пароль'),
        ),
    ]
