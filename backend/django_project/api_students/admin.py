from django.contrib import admin
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
    list_display = ('student', 'type_activity', 'discipline',
                    'date')
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


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('text', 'date_sent', 'scheduled_date',
                    'is_sent', 'group', 'student', 'is_group_message')
    list_filter = ('is_sent', 'is_group_message', 'date_sent')
    search_fields = ('text', 'student__username')
    ordering = ('scheduled_date',)
    actions = ['mark_as_sent']

    def mark_as_sent(self, request, queryset):
        queryset.update(is_sent=True)
    mark_as_sent.short_description = "Отметить как отправленные"


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('group', 'message', 'notification_date', 'is_notified')
    list_filter = ('is_notified', 'notification_date')
    search_fields = ('message__text',)
    ordering = ('notification_date',)
