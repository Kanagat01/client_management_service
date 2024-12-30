from aiogram.fsm.state import State, StatesGroup


class UserFSM(StatesGroup):
    group = State()
    login = State()
    password = State()

    exams = State()
