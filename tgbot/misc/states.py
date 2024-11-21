from aiogram.fsm.state import State, StatesGroup


class UserFSM(StatesGroup):
    login = State()
    password = State()
