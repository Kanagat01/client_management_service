from aiogram.fsm.state import State, StatesGroup


class UserFSM(StatesGroup):
    group = State()
    login = State()
    password = State()

    activities = State()
    proctoring = State()
    set_whatsapp = State()
    confirm_set_whatsapp = State()

    change_login = State()
    change_password = State()
    change_group = State()
    change_whatsapp = State()
    confirm_change_whatsapp = State()
