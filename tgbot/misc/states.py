from aiogram.fsm.state import State, StatesGroup


class UserFSM(StatesGroup):
    login = State()
    password = State()
    group = State()
    proctoring_choice = State()
    notification_choice = State()
    phone = State()
    confirm_phone = State()  # Подтверждение номера
    next_step = State()