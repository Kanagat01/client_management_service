import random
import string
from datetime import datetime
from asgiref.sync import sync_to_async
from aiogram import F, Router
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from rest_framework.exceptions import ValidationError

from backend.global_functions import send_whatsapp_sms
from api_students.models import *
from handlers.main import render_main_menu
from handlers.helpers import get_student
from keyboards.inline import UserInlineKeyboard
from misc.states import UserFSM


router = Router()


@router.message(F.text == "Выборочная запись на экзамены")
@router.callback_query(F.data == "back_to_sign_up")
async def sign_up_for_activities(msg: Message | CallbackQuery, state: FSMContext):
    message = msg.message if isinstance(msg, CallbackQuery) else msg
    text = 'Напишите через "," номера экзаменов на которые хотите записаться. Например: 1, 2, 3'
    kb = UserInlineKeyboard.go_back_btn(cb_data="back_to_main_menu")
    await state.set_state(UserFSM.activities)
    await message.answer(text, reply_markup=kb)


@router.message(UserFSM.activities)
async def get_activities(message: Message, state: FSMContext):
    state_data = await state.get_data()
    schedule_data = state_data["schedule_data"]
    try:
        activity_nums = list(map(int, message.text.split(",")))
    except ValueError:
        await message.answer("Неверный формат ввода. Попробуйте снова")
        return

    for x in activity_nums:
        if x < 1 or x > len(schedule_data):
            await message.answer(f"Экзамен №{x} не найден. Попробуйте снова")
            return

    text = []
    activities = [schedule_data[x-1] for x in activity_nums]
    for activity in activities:
        text.append(
            f'{activity["discipline"]["name"]} {activity["date"]} {activity["start_time"][:5]} {activity["end_time"][:5]}')

    await state.update_data(activities=activities)
    try:
        await get_student(message.from_user.id)
        await choose_proctoring(message, state, activities, "back_to_sign_up")
    except Student.DoesNotExist:
        await render_login(message, state)


@router.message(F.text == "Запись на все экзамены")
async def sign_up_for_all_activities(message: Message, state: FSMContext):
    state_data = await state.get_data()
    await state.update_data(
        activities=state_data["schedule_data"], signed_up_for_all=True)

    try:
        await get_student(message.from_user.id)
        await choose_proctoring(message, state, state_data["schedule_data"], "back_to_main_menu")
    except Student.DoesNotExist:
        await render_login(message, state)


@router.callback_query(F.data == "back_to_login")
async def render_login(callback: Message | CallbackQuery, state: FSMContext):
    message = callback.message if isinstance(
        callback, CallbackQuery) else callback
    state_data = await state.get_data()
    cb_data = state_data.get(
        "signed_up_for_all", False) and "back_to_main_menu" or "back_to_sign_up"
    kb = UserInlineKeyboard.go_back_btn(cb_data=cb_data)
    await state.set_state(UserFSM.login)
    await message.answer("Запись происходит в автоматическом режиме, введите пожалуйста ваш логин от сайта campus.fa.ru", reply_markup=kb)


@router.message(UserFSM.login)
async def get_login(message: Message, state: FSMContext):
    kb = UserInlineKeyboard.go_back_btn(cb_data="back_to_login")
    await state.update_data(login=message.text)
    await state.set_state(UserFSM.password)
    await message.answer("Введите ваш пароль от сайта campus.fa.ru", reply_markup=kb)


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
        await choose_proctoring(message, state, state_data["activities"], "back_to_main_menu")

    except ValidationError as e:
        if isinstance(e.detail, list):
            error_message = e.detail[0]
        elif isinstance(e.detail, dict):
            error_message = ", ".join([str(msg) for msg in e.detail.values()])
        else:
            error_message = str(e.detail)

        await message.answer(error_message)
        await render_login(message, state)
        return


@router.callback_query(F.data == "choose_proctoring")
async def choose_proctoring(msg: Message | CallbackQuery, state: FSMContext, activities: list[dict], cb_data: str):
    message = msg.message if isinstance(msg, CallbackQuery) else msg

    disciplines = []
    for idx, activity in enumerate(activities, 1):
        disciplines.append(f'{idx}. {activity["discipline"]["name"]}')
    await message.answer("Дисциплины: \n\n" + "\n".join(disciplines))

    text = "Напишите через ',' номера дисциплин на которые хотите записаться с прокторингом. Например: 1, 2, 3"
    kb = UserInlineKeyboard.choose_proctoring_kb(back_btn_cb=cb_data)
    await state.set_state(UserFSM.proctoring)
    await message.answer(text, reply_markup=kb)


@router.message(UserFSM.proctoring)
async def get_proctoring(message: Message, state: FSMContext):
    state_data = await state.get_data()
    activities = state_data["activities"]

    try:
        proctoring_nums = list(map(int, message.text.split(",")))
    except ValueError:
        await message.answer("Неверный формат ввода. Попробуйте снова")
        return

    for x in proctoring_nums:
        if x < 1 or x > len(activities):
            await message.answer(f"Дисциплина №{x} не найдена. Попробуйте снова")
            return

    for x in proctoring_nums:
        activities[x-1]["marked_as_proctoring"] = True

    await state.update_data(activities=activities)
    await set_whatsapp_query(message, state)


@router.callback_query(F.data == "all_exams_proctoring")
async def all_exams_proctoring(callback: CallbackQuery, state: FSMContext):
    state_data = await state.get_data()
    activities = state_data["activities"]
    for activity in activities:
        activity["marked_as_proctoring"] = True
    await state.update_data(activities=activities)
    await set_whatsapp_query(callback, state)


@router.callback_query(F.data == "without_proctoring")
async def without_proctoring(callback: CallbackQuery, state: FSMContext):
    await set_whatsapp_query(callback, state)


@router.callback_query(F.data == "set_whatsapp")
async def set_whatsapp_query(msg: Message | CallbackQuery, state: FSMContext):
    student = await get_student(msg.from_user.id)
    if student.phone:
        await create_student_records(msg, state)
        return

    message = msg.message if isinstance(msg, CallbackQuery) else msg
    kb = UserInlineKeyboard.set_whatsapp_kb()
    await state.set_state(UserFSM.set_whatsapp)
    await message.answer("Введите номер телефона для получения уведомлений в WhatsApp", reply_markup=kb)


@router.message(UserFSM.set_whatsapp)
async def set_whatsapp(message: Message, state: FSMContext):
    code = ''.join(random.choices(string.digits, k=4))
    send_whatsapp_sms(message.text, f"Код подтверждения: {code}")
    await state.update_data(whatsapp_number=message.text, confirmation_code=code)
    await state.set_state(UserFSM.confirm_set_whatsapp)

    kb = UserInlineKeyboard.go_back_btn("set_whatsapp")
    await message.answer("На ваш номер отправлено сообщение с кодом подтверждения. Пожалуйста, введите его", reply_markup=kb)


@router.message(UserFSM.confirm_set_whatsapp)
async def confirm_set_whatsapp(message: Message, state: FSMContext):
    state_data = await state.get_data()
    if message.text != state_data["confirmation_code"]:
        kb = UserInlineKeyboard.go_back_btn("change_whatsapp")
        await message.answer("Неверный код подтверждения. Попробуйте еще раз", reply_markup=kb)
        return

    student = await get_student(message.from_user.id)
    student.phone = state_data["whatsapp_number"]
    await sync_to_async(student.save)()
    await message.answer("Номер в WhatsApp подтвержден")
    await create_student_records(message, state)


@router.callback_query(F.data == "only_tg_notifications")
async def only_tg_notifications(callback: CallbackQuery, state: FSMContext):
    await create_student_records(callback, state)


async def create_student_records(msg: Message | CallbackQuery, state: FSMContext):
    message = msg.message if isinstance(msg, CallbackQuery) else msg

    state_data = await state.get_data()
    activities = state_data["activities"]
    student = await get_student(msg.from_user.id)
    group = await sync_to_async(lambda: student.group)()

    text = []
    has_proctoring = False
    for activity in activities:
        marked_as_proctoring = activity.pop("marked_as_proctoring", False)
        if marked_as_proctoring:
            has_proctoring = True

        activity_type_data = activity.pop("activity_type")
        activity_type, _ = await sync_to_async(ActivityType.objects.get_or_create)(
            fa_id=activity_type_data["fa_id"],
            defaults={"name": activity_type_data["name"]}
        )
        discipline_data = activity.pop("discipline")
        discipline, _ = await sync_to_async(Discipline.objects.get_or_create)(
            fa_id=discipline_data["fa_id"],
            defaults={"name": discipline_data["name"]}
        )
        activity["date"] = datetime.strptime(
            activity["date"], "%Y.%m.%d").strftime("%Y-%m-%d")
        kwargs = {
            "activity_type": activity_type, "discipline": discipline, "group": group, **activity}
        try:
            activity = await sync_to_async(Activity.objects.get)(**kwargs)
        except Activity.DoesNotExist:
            activity = await sync_to_async(Activity.objects.create)(**kwargs)

        await sync_to_async(StudentRecord.objects.create)(student=student, activity=activity, marked_as_proctoring=marked_as_proctoring)
        text.append(await sync_to_async(lambda: str(activity))())

    await state.clear()
    await message.answer(f"Вы успешно записались на следующие экзамены:\n\n" + "\n".join(text))
    if has_proctoring and not student.is_verified:
        await get_verifiction_for_proctoring(message)

    await render_main_menu(state, message, group.fa_id)


async def get_verifiction_for_proctoring(message: Message):
    url = "https://t.me/tteessttfa"
    await message.answer(f"Запросите верификацию в нашем телеграмм аккаунте для получения инструкции для прокторинга \n\n{url}")
