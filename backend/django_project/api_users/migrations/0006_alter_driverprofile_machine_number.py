# Generated by Django 5.0.2 on 2024-08-13 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_users', '0005_customercompany_details_transportercompany_details'),
    ]

    operations = [
        migrations.AlterField(
            model_name='driverprofile',
            name='machine_number',
            field=models.CharField(max_length=20, unique=True, verbose_name='Номер авто'),
        ),
    ]
