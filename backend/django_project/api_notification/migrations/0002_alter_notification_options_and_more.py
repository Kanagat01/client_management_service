# Generated by Django 5.0.2 on 2024-07-14 13:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_notification', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='notification',
            options={'verbose_name': 'Уведомление', 'verbose_name_plural': 'Уведомления'},
        ),
        migrations.RemoveField(
            model_name='notification',
            name='to_users',
        ),
        migrations.AddField(
            model_name='notification',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
