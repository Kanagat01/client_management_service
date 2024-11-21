from aiogram.types import ReplyKeyboardMarkup, KeyboardButton


class UserReplyKeyboard:
    """Клавиатура юзера для передачи телефона"""

    @classmethod
    def current_menu_kb(cls):
        kb = [
            [KeyboardButton(
                text="Записаться / Информация о ближайшей записи")],
            [
                KeyboardButton(text="Написать отзыв"),
                KeyboardButton(text="Прайс"),
            ],
            [KeyboardButton(text="Написать Оксане в личку")],
        ]
        keyboard = ReplyKeyboardMarkup(
            keyboard=kb, resize_keyboard=True, one_time_keyboard=False)
        return keyboard
