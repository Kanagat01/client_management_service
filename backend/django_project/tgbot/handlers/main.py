import requests
from datetime import datetime, timedelta
from aiogram import F, Router
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from misc.states import UserFSM
from keyboards.reply import UserReplyKeyboard


def validate_group(group_name):
    url = f"https://ruz.fa.ru/api/search?term={group_name}&type=group"
    response = requests.get(url)

    if not response.status_code == 200:
        return None

    for group in response.json():
        if group.get("label") == group_name:
            return group


def get_schedule(group_id):
    data = []

    now = datetime.now()
    if now.month >= 9:
        last_date_in_year = datetime(year=now.year + 1, month=7, day=1)
    else:
        last_date_in_year = datetime(year=now.year, month=7, day=1)

    start_date = now
    base_url = "https://ruz.fa.ru/api/schedule/group"
    work_types = ["Зачеты", "Экзамены", "Семинар+зачет",
                  "Повторная промежуточная аттестация (зачет)", "Повторная промежуточная аттестация (экзамен)"]

    while start_date < last_date_in_year:
        finish_date = min(start_date + timedelta(days=120), last_date_in_year)
        url = f"{base_url}/{group_id}?start={start_date.strftime('%Y.%m.%d')}&finish={finish_date.strftime('%Y.%m.%d')}"
        response = requests.get(url)

        if response.status_code == 200:
            resp_data = [x for x in response.json() if x["kindOfWork"]
                         in work_types]
            data.extend(resp_data)

        start_date = finish_date + timedelta(days=1)

    return data


def parse_schedule(data: list[dict]):
    if len(data) == 0:
        return ["Нет данных о расписании"]

    schedule = {}
    for lesson in data:
        subject = lesson.get("discipline", "").strip()
        if not subject:
            continue

        lesson_info = f'⏱️ {lesson["beginLesson"]} - {lesson["endLesson"]} ⏱️\n' \
                      f'<b>{subject}</b>\n' \
                      f'{lesson["kindOfWork"]}\n' \
                      f'Кто: {lesson.get("lecturer", "")}\n'

        date = datetime.strptime(lesson["date"], "%Y.%m.%d")
        date_str = date.strftime("%d.%m.%Y")
        if date_str in schedule:
            schedule[date_str].append(lesson_info)
        else:
            weekday = date.strftime("%A")
            days_of_week = {
                "Monday": "Понедельник",
                "Tuesday": "Вторник",
                "Wednesday": "Среда",
                "Thursday": "Четверг",
                "Friday": "Пятница",
                "Saturday": "Суббота",
                "Sunday": "Воскресенье"
            }
            nums = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣",
                    "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
            schedule[date_str] = [
                f'{nums[len(schedule)]} {days_of_week.get(weekday, weekday)}, {date_str}\n\n{lesson_info}']
    return ["\n".join(lessons) for lessons in schedule.values()]


router = Router()


@router.message(Command("start"))
async def start(message: Message, state: FSMContext):
    await state.set_state(UserFSM.group)
    await message.answer("Добрый день! Для продолжения, напишите название вашей группы \n\nНапример, «ПИ18-1»")


@router.message(UserFSM.group)
async def get_group(message: Message, state: FSMContext):
    group: dict = validate_group(message.text)
    if group:
        await state.update_data(group=group)
        await state.set_state(UserFSM.password)
        await message.answer(f"Группа {group['label']} успешно зарегистрирована!")

        await render_main_menu(state, message, group["id"])
    else:
        await message.answer(f"Группа «{group}» не существует \n\nПроверьте название группы на http://ruz.fa.ru/ruz")


@router.callback_query(F.data == "back_to_main_menu")
async def back_to_main_menu(callback: CallbackQuery, state: FSMContext):
    state_data = await state.get_data()
    group_id = state_data["group"]["id"]
    await render_main_menu(state, callback.message, group_id)


async def render_main_menu(state: FSMContext, message: Message, group_id: int | str):
    schedule_data = get_schedule(group_id)
    await state.update_data(schedule_data=schedule_data)

    for idx, schedule in enumerate(parse_schedule(schedule_data)):
        kb = UserReplyKeyboard.main_menu_kb() if idx == len(schedule_data) - 1 else None
        await message.answer(schedule, reply_markup=kb)
