# Generated by Django 5.0.2 on 2025-01-02 10:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_students', '0011_remove_activity_marked_as_proctoring_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='is_blocked',
            field=models.BooleanField(default=False, verbose_name='Заблокирован'),
        ),
    ]
