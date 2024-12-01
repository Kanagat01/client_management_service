from django.contrib import admin
from .models import Student, TypeActivity, StudentRecord, Discipline, Log, Group, Message, TelegramAccount, Notification

# Админка для модели Student
class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'group', 'is_verified', 'registration_date')
    list_filter = ('is_verified', 'group', 'registration_date')  # Добавил фильтрацию по дате регистрации
    search_fields = ('full_name', 'phone', 'group__name')  # Поиск по полям
    ordering = ('registration_date',)
    actions = None  # Отключаем экспорт

admin.site.register(Student, StudentAdmin)

# Админка для модели TypeActivity
@admin.register(TypeActivity)
class TypeActivityAdmin(admin.ModelAdmin):
    list_display = ('status',)
    search_fields = ('status',)

# Админка для модели StudentRecord
@admin.register(StudentRecord)
class StudentRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'type_activity', 'discipline', 'date')  # Добавлено отображение дисциплины
    search_fields = ('student__full_name', 'type_activity__status', 'discipline__name')  # Поиск по дисциплине
    ordering = ('date',)
    list_filter = ('type_activity', 'discipline')  # Добавлен фильтр по типу активности и дисциплине

# Админка для модели Discipline
@admin.register(Discipline)
class DisciplineAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'date', 'quantity_users')  # Поля, отображаемые в списке
    search_fields = ('name', 'code')  # Поиск по названию дисциплины и коду
    list_filter = ('date',)  # Фильтр по дате

# Админка для модели Log
@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('student', 'field_name', 'old_value', 'new_value', 'timestamp')
    list_filter = ('field_name', 'timestamp')
    search_fields = ('student__full_name', 'field_name', 'old_value', 'new_value')
    ordering = ('timestamp',)  # Сортировка по времени

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')  # Поле создано в модели
    search_fields = ('name', 'description')
    ordering = ('name',)
    list_filter = ('created_at',)  # Фильтр по дате создания

# Админка для модели Message
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('text', 'date_sent', 'scheduled_date', 'is_sent', 'group', 'student', 'is_group_message')
    list_filter = ('is_sent', 'is_group_message', 'date_sent')  # Добавлен фильтр по дате отправки
    search_fields = ('text', 'group__name', 'student__username')
    ordering = ('scheduled_date',)
    actions = ['mark_as_sent']

    def mark_as_sent(self, request, queryset):
        queryset.update(is_sent=True)
    mark_as_sent.short_description = "Отметить как отправленные"

# Админка для модели TelegramAccount
@admin.register(TelegramAccount)
class TelegramAccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'telegram_id', 'group')
    search_fields = ('user__username', 'telegram_id', 'group__name')

# Админка для модели Notification
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('group', 'message', 'notification_date', 'is_notified')
    list_filter = ('is_notified', 'notification_date')
    search_fields = ('group__name', 'message__text')
    ordering = ('notification_date',)
