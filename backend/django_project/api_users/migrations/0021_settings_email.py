# Generated by Django 5.0.2 on 2024-09-03 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_users', '0020_alter_customercompany_allowed_transporter_companies'),
    ]

    operations = [
        migrations.AddField(
            model_name='settings',
            name='email',
            field=models.EmailField(default='example@gmail.com', max_length=300, verbose_name='Почта поддержки'),
            preserve_default=False,
        ),
    ]
