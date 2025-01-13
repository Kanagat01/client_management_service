from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


class UserInlineKeyboard:
    @classmethod
    def go_back_btn(cls, cb_data: str):
        keyboard = [
            [InlineKeyboardButton(text="Назад",
                                  callback_data=cb_data)],
        ]
        return InlineKeyboardMarkup(inline_keyboard=keyboard)

    @classmethod
    def choose_proctoring_kb(cls, back_btn_cb: str):
        keyboard = [
            [
                InlineKeyboardButton(text="Все экзамены",
                                     callback_data="all_exams_proctoring"),
            ],
            [
                InlineKeyboardButton(text="Запись без прокторинга",
                                     callback_data="without_proctoring"),
            ],
            [
                InlineKeyboardButton(text="Назад",
                                     callback_data=back_btn_cb)
            ]
        ]
        if back_btn_cb != "back_to_main_menu":
            keyboard[2].append(InlineKeyboardButton(
                text="Главное меню", callback_data="back_to_main_menu"))
        return InlineKeyboardMarkup(inline_keyboard=keyboard)

    @classmethod
    def set_whatsapp_kb(cls):
        keyboard = [
            [
                InlineKeyboardButton(
                    text="Буду получать уведомления только в телеграмм", callback_data="only_tg_notifications"),
            ],
            [
                InlineKeyboardButton(text="Назад",
                                     callback_data="choose_proctoring"),
                InlineKeyboardButton(text="Главное меню",
                                     callback_data="back_to_main_menu"),
            ],
        ]
        return InlineKeyboardMarkup(inline_keyboard=keyboard)

    @classmethod
    def settings_kb(cls):
        keyboard = [
            [
                InlineKeyboardButton(text="Изменить логин и пароль",
                                     callback_data="change_login"),
                InlineKeyboardButton(text="Изменить группу",
                                     callback_data="change_group"),
            ],
            [
                InlineKeyboardButton(text="Изменить номер WhatsApp",
                                     callback_data="change_whatsapp"),
            ],
            [
                InlineKeyboardButton(text="Изменить записи на экзамены",
                                     callback_data="change_student_records"),
            ],
        ]
        return InlineKeyboardMarkup(inline_keyboard=keyboard)

    @classmethod
    def change_record(cls, record_id: int | str, marked_as_proctoring: bool):
        keyboard = [
            [
                InlineKeyboardButton(text=f"{'Выкл' if marked_as_proctoring else 'Вкл'} прокторинг",
                                     callback_data=f"toggle_proctoring:{record_id}"),
                InlineKeyboardButton(text="Удалить",
                                     callback_data=f"confirm_delete:{record_id}")
            ],
        ]
        return InlineKeyboardMarkup(inline_keyboard=keyboard)

    @classmethod
    def confirm_delete(cls, record_id: int | str, message_id: int | str):
        keyboard = [
            [
                InlineKeyboardButton(text="Да, удалить",
                                     callback_data=f"delete_record:{record_id}:{message_id}"),
                InlineKeyboardButton(text="Отмена",
                                     callback_data=f"cancel_delete:{record_id}")
            ],
        ]
        return InlineKeyboardMarkup(inline_keyboard=keyboard)
