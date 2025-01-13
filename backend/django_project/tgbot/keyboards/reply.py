from aiogram.types import ReplyKeyboardMarkup, KeyboardButton


class UserReplyKeyboard:
    @classmethod
    def main_menu_kb(cls):
        kb = [
            [
                KeyboardButton(text="Запись на все экзамены"),
                KeyboardButton(text="Выборочная запись на экзамены"),
            ],
            [
                KeyboardButton(text="Подтверждение для прокторинга"),
                KeyboardButton(text="Акции"),
            ],
            [
                KeyboardButton(text="Настройки")
            ],
        ]
        keyboard = ReplyKeyboardMarkup(
            keyboard=kb, resize_keyboard=True, one_time_keyboard=False)
        return keyboard
