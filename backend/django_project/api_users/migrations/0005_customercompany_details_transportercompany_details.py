# Generated by Django 5.0.2 on 2024-07-23 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_users', '0004_passwordreset_alter_driverprofile_birth_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customercompany',
            name='details',
            field=models.TextField(blank=True, null=True, verbose_name='Реквизиты'),
        ),
        migrations.AddField(
            model_name='transportercompany',
            name='details',
            field=models.TextField(blank=True, null=True, verbose_name='Реквизиты'),
        ),
    ]
