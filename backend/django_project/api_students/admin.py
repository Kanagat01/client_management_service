from django.contrib import admin
from django.apps import apps
from .models import *


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'group',
                    'is_verified', 'registration_date')
    list_filter = ('is_verified', 'group', 'registration_date')
    search_fields = ('full_name', 'phone',)
    ordering = ('registration_date',)
    actions = None  # Отключаем экспорт


@admin.register(StudentRecord)
class StudentRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'activity', 'date')
    search_fields = ('student__full_name',)
    ordering = ('date',)


@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('student', 'field_name', 'old_value',
                    'new_value', 'created_at')
    readonly_fields = ('created_at',)
    list_filter = ('field_name', 'created_at')
    search_fields = ('student__full_name', 'field_name',
                     'old_value', 'new_value')
    ordering = ('created_at',)


app = apps.get_app_config('api_students')

for model in app.get_models():
    if model not in admin.site._registry:
        admin.site.register(model)
