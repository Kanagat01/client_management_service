from asgiref.sync import sync_to_async
from aiogram import F, Router
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from django.core.exceptions import ValidationError
from handlers.main import parse_schedule
from keyboards.inline import UserInlineKeyboard
from misc.states import UserFSM
from api_students.models import Student, Group


router = Router()


@router.message(F.text == "Выборочная запись на экзамены")
@router.callback_query(F.data == "back_to_sign_up")
async def sign_up_for_exams(message: Message | CallbackQuery, state: FSMContext):
    await state.set_state(UserFSM.exams)
    message = message.message if isinstance(
        message, CallbackQuery) else message

    text = 'Напишите через "," номера экзаменов на которые хотите записаться. Например: 1, 2, 3'
    kb = UserInlineKeyboard.prev_btn(cb_data="back_to_main_menu")
    await message.answer(text, reply_markup=kb)


@router.message(UserFSM.exams)
async def get_exams(message: Message, state: FSMContext):
    state_data = await state.get_data()
    schedule_data = state_data["schedule_data"]

    try:
        exams = list(map(int, message.text.split(",")))
    except ValueError:
        await message.answer("Неверный формат ввода. Попробуйте снова")
        return

    for exam in exams:
        if exam <= 0 or exam > len(schedule_data):
            await message.answer(f"Экзамен №{exam} не найден. Попробуйте снова")
            return

    await message.answer(f"Вы записались на следующие экзамены:")

    schedule_data = [schedule_data[exam - 1] for exam in exams]
    for exam in parse_schedule(schedule_data):
        await message.answer(exam)

    kb = UserInlineKeyboard.prev_btn(cb_data="back_to_sign_up")
    await state.update_data(exams=schedule_data)
    await state.set_state(UserFSM.login)
    await message.answer("Введите пожалуйста ваш логин от сайте campus.fa.ru", reply_markup=kb)


@router.message(F.text == "Запись на все экзамены")
async def sign_up_for_all_exams(message: Message, state: FSMContext):
    state_data = await state.get_data()
    await state.update_data(exams=state_data["schedule_data"])
    await state.set_state(UserFSM.login)
    kb = UserInlineKeyboard.prev_btn(cb_data="back_to_main_menu")
    await message.answer("Запись происходит в автоматическом режиме введите пожалуйста ваш логин от сайте campus.fa.ru", reply_markup=kb)


@router.callback_query(F.data == "back_to_login")
async def back_to_login(callback: CallbackQuery, state: FSMContext):
    await state.set_state(UserFSM.login)
    state_data = await state.get_data()
    cb_data = len(state_data["exams"]) == len(
        state_data["schedule_data"]) and "back_to_main_menu" or "back_to_sign_up"
    kb = UserInlineKeyboard.prev_btn(cb_data=cb_data)
    await callback.message.answer("Введите пожалуйста ваш логин от сайта campus.fa.ru", reply_markup=kb)


@router.message(UserFSM.login)
async def get_login(message: Message, state: FSMContext):
    await state.update_data(login=message.text)
    kb = UserInlineKeyboard.prev_btn(cb_data="back_to_login")
    await state.set_state(UserFSM.password)
    await message.answer("Введите пожалуйста ваш пароль от сайта campus.fa.ru", reply_markup=kb)


@router.message(UserFSM.password)
async def get_password(message: Message, state: FSMContext):
    state_data = await state.get_data()
    group = state_data["group"]
    login = state_data["login"]
    password = message.text

    try:
        await sync_to_async(Student.objects.create)(
            telegram_id=message.from_user.id,
            telegram_link=f"https://t.me/{message.from_user.username}",
            fa_login=login,
            fa_password=password,
            group=group,
        )
    except ValidationError as e:
        await message.answer(str(e))
        await state.set_state(UserFSM.login)
        return
    await state.update_data(password=message.text)
