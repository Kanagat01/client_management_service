# Generated by Django 5.0.2 on 2024-08-18 07:02

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_users', '0008_delete_fullnamemodel_remove_driverprofile_companies_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='driverprofile',
            name='user',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE,
                                       related_name='driver_profile', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
