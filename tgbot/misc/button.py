from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardButton, InlineKeyboardMarkup


main_menu_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Запись на все экзамены"), KeyboardButton(text="Выборочная запись на экзамен")],
        [KeyboardButton(text="Подтверждение для прокторинга"), KeyboardButton(text="Акции")],
        [KeyboardButton(text="Настройки")],
    ],
    resize_keyboard=True
)


registration_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Запись на прокторинг"), KeyboardButton(text="Запись без прокторинга")],
        [KeyboardButton(text="Назад")],
        [KeyboardButton(text="Главное меню")],
    ],
    resize_keyboard=True
)


proctoring_choice_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Все"),KeyboardButton(text="Указать номер")],
        [KeyboardButton(text="Назад")],
        [KeyboardButton(text="Главное меню")],
    ],
    resize_keyboard=True
)


notification_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Ввести номер телефона для получения уведомлений в WhatsApp"), KeyboardButton(text="Буду получать уведомление только в Telegram")],
        [KeyboardButton(text="Назад")],
        [KeyboardButton(text="Главное меню")],
    ],
    resize_keyboard=True
)



settings_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Изменить логин", callback_data="change_login")],
        [KeyboardButton(text="Изменить пароль", callback_data="change_password")],
        [KeyboardButton(text="Изменить номер телефона", callback_data="change_phone")],
        [KeyboardButton(text="Изменить группу", callback_data="change_group")],
        [KeyboardButton(text="Записаться на обычные экзамены", callback_data="register_exams")],
        [KeyboardButton(text="Записаться на прокторинг", callback_data="register_proctoring")],
    ],
    resize_keyboard = True
)