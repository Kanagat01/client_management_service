# Generated by Django 5.0.2 on 2025-01-07 11:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_students', '0013_remove_code_activity_remove_code_code_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='student',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api_students.student'),
        ),
    ]
