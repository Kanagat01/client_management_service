from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


class UserSignUpInline:
    @classmethod
    def create_reg_gender_kb(cls):
        keyboard = [
            [InlineKeyboardButton(text="Для девушки 👱‍♀️",
                                  callback_data="create_reg|gender:girls")],
            [InlineKeyboardButton(text="Для мужчины 👱‍♂️",
                                  callback_data="create_reg|gender:boys")],
        ]
        return InlineKeyboardMarkup(inline_keyboard=keyboard)
