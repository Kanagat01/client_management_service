# Generated by Django 5.0.2 on 2025-01-27 08:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_students', '0016_alter_code_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='students', to='api_students.group', verbose_name='Группа'),
        ),
    ]
