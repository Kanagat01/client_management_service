# Generated by Django 5.0.2 on 2024-08-12 11:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api_auction', '0009_alter_ordermodel_options_alter_ordermodel_adr_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='ordermodel',
            options={'ordering': ['-transportation_number'], 'verbose_name': 'Заказ', 'verbose_name_plural': 'Заказы'},
        ),
    ]
