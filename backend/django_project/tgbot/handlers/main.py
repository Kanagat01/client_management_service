from asgiref.sync import sync_to_async
from aiogram import F, Router
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from misc.states import UserFSM
from keyboards.reply import UserReplyKeyboard
from api_students.models import Group, Student
from handlers.helpers import get_schedule, get_student, parse_schedule, validate_group

router = Router()


@router.message(Command("start"))
async def start(message: Message, state: FSMContext):
    try:
        student = await get_student(message.from_user.id)
        group = await sync_to_async(lambda: student.group)()
        await state.update_data(group=group)
        await message.answer(f"Добрый день! С возвращением, {student.full_name}")
        await render_main_menu(state, message, group.fa_id)
    except Student.DoesNotExist:
        await state.set_state(UserFSM.group)
        await message.answer("Добрый день! Для продолжения, напишите название вашей группы \n\nНапример, «ПИ18-1»")


@router.message(UserFSM.group)
async def get_group(message: Message, state: FSMContext):
    group: Group = await validate_group(message.text)
    if group:
        await state.update_data(group=group)
        await message.answer(f"Группа {message.text} успешно зарегистрирована!")
        await render_main_menu(state, message, group.fa_id)
    else:
        await message.answer(f"Группа «{message.text}» не существует \n\nПроверьте название группы на http://ruz.fa.ru/ruz")


@router.callback_query(F.data == "back_to_main_menu")
async def back_to_main_menu(callback: CallbackQuery, state: FSMContext):
    state_data = await state.get_data()
    group_id = state_data["group"].fa_id
    await render_main_menu(state, callback.message, group_id)


async def render_main_menu(state: FSMContext, message: Message, group_id: int | str):
    schedule_data = get_schedule(group_id)
    state_data = await state.get_data()
    await state.clear()
    await state.set_data({**state_data, "schedule_data": schedule_data})

    parsed_schedule = parse_schedule(schedule_data)
    for idx, schedule in enumerate(parsed_schedule):
        kb = UserReplyKeyboard.main_menu_kb() if idx == len(parsed_schedule) - 1 else None
        await message.answer(schedule, reply_markup=kb)
