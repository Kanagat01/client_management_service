from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


class UserInlineKeyboard:
    @classmethod
    def prev_btn(cls, cb_data: str):
        keyboard = [
            [InlineKeyboardButton(text="Назад",
                                  callback_data=cb_data)],
        ]
        return InlineKeyboardMarkup(inline_keyboard=keyboard)
