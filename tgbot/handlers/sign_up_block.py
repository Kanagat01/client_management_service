import requests
from bs4 import BeautifulSoup
from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from datetime import datetime, timedelta
from aiogram.utils.markdown import bold


class UserFSM(StatesGroup):
    login = State()
    password = State()
    group = State()
    schedule_action = State()


router = Router()

keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Сегодня")],
        [KeyboardButton(text="Завтра")],
        [KeyboardButton(text="Эта неделя")],
        [KeyboardButton(text="Следующая неделя")]
    ],
    resize_keyboard=True
)


@router.message(Command("start"))
async def start(message: Message, state: FSMContext):
    await state.set_state(UserFSM.login)
    await message.answer("Добрый день! Введите ваш логин:")


@router.message(UserFSM.login)
async def enter_login(message: Message, state: FSMContext):
    await state.update_data(login=message.text)
    await state.set_state(UserFSM.password)
    await message.answer("Введите ваш пароль:")


@router.message(UserFSM.password)
async def enter_password(message: Message, state: FSMContext):
    data = await state.get_data()
    login = data["login"]
    password = message.text

    response = requests.post("https://campus.fa.ru/login/index.php", data={"username": login, "password": password})
    soup = BeautifulSoup(response.text, 'html.parser')
    title = soup.title.string if soup.title else ""

    if "Личный кабинет" in title:
        await state.set_state(UserFSM.group)
        await message.answer("Успешно: авторизация прошла.\nВведите название вашей группы:")
    else:
        await state.clear()
        await message.answer("Неправильный логин или пароль. Попробуйте снова. Введите /start для начала.")


@router.message(UserFSM.group)
async def enter_group(message: Message, state: FSMContext):
    group_name = message.text
    group_id = validate_group(group_name)

    if group_id:
        await state.update_data(group=group_name, group_id=group_id)
        await state.set_state(UserFSM.schedule_action)
        await message.answer(f"Группа {group_name} успешно зарегистрирована!\nВыберите действие:", reply_markup=keyboard)
    else:
        await message.answer(f"Группа {group_name} не найдена. Попробуйте снова.")


@router.message(UserFSM.schedule_action)
async def handle_schedule_action(message: Message, state: FSMContext):
    data = await state.get_data()
    group_id = data.get("group_id")
    action = message.text.lower().replace(" ", "_")

    if action not in ["сегодня", "завтра", "эта_неделя", "следующая_неделя"]:
        await message.answer("Выберите действие с клавиатуры.")
        return

    schedule = get_schedule(group_id, action)

    if schedule:
        await message.answer(f"Расписание для группы {data['group']}:\n\n{schedule}")
    else:
        await message.answer(f"Расписание для группы {data['group']} не найдено.")


def validate_group(group_name):
    url = f"https://ruz.fa.ru/api/search?term={group_name}&type=group"
    response = requests.get(url)

    if response.status_code == 200:
        groups = response.json()
        for group in groups:
            if group.get("label") == group_name:
                return group.get("id")
    return None


def get_schedule(group_id, period):
    base_url = "https://ruz.fa.ru/api/schedule/group"

    today = datetime.now()
    if period == "сегодня":
        start_date = finish_date = today.strftime("%Y.%m.%d")
    elif period == "завтра":
        start_date = finish_date = (today + timedelta(days=1)).strftime("%Y.%m.%d")
    elif period == "эта_неделя":
        start_date = (today - timedelta(days=today.weekday())).strftime("%Y.%m.%d")
        finish_date = (today + timedelta(days=6 - today.weekday())).strftime("%Y.%m.%d")
    elif period == "следующая_неделя":
        start_date = (today + timedelta(days=7 - today.weekday())).strftime("%Y.%m.%d")
        finish_date = (today + timedelta(days=13 - today.weekday())).strftime("%Y.%m.%d")
    else:
        return None

    url = f"{base_url}/{group_id}?start={start_date}&finish={finish_date}&lng=1"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return parse_schedule(data)
    else:
        return None
# def parse_schedule(data):
#     if not data:
#         return "Нет данных о расписании."
#     schedule = []
#     count = 1
#     for lesson in data:
#         subject = lesson.get("discipline", "").strip()
#         if not subject:
#             continue
        
#         lesson_info=[
#             f'📆<b>{str(count)}</b>. {lesson.get("dayOfWeekString", "")}, {lesson.get("date", "")}',
#             f'⏱️ {lesson.get("beginLesson", "")} - {lesson.get("endLesson", "")} ⏱️',
#             f'<b>{subject}</b>', 
#             f'Преподаватель: {lesson.get("lecturer", "")}',
#             f'Аудитория: {lesson.get("auditorium", "")}\n'
#         ]
#         schedule.append("\n".join(lesson_info))
#         count += 1
    
#     return "\n\n".join(schedule)

def parse_schedule(data):
    if not data:
        return "Нет данных о расписании."
    
    schedule = []
    count = 1
    day_schedule = {}  # Для хранения расписания по дням недели

    # Группируем занятия по дням недели
    for lesson in data:
        subject = lesson.get("discipline", "").strip()
        if not subject:
            continue

        day = lesson.get("dayOfWeekString", "")
        date = lesson.get("date", "")
        
        # Форматируем информацию о предмете и времени
        lesson_info = f'⏱️ {lesson.get("beginLesson", "")} - {lesson.get("endLesson", "")} ⏱️\n' \
                      f'<b>{subject}</b>\n' \
                      f'Преподаватель: {lesson.get("lecturer", "")}\n' \
                      f'Аудитория: {lesson.get("auditorium", "")}\n'

        # Если день недели уже есть в словаре, добавляем урок
        if day in day_schedule:
            day_schedule[day].append(f'{lesson_info}')
        else:
            day_schedule[day] = [f'📆 <b>{day}</b>, {date}\n' + lesson_info]

    # Формируем итоговое расписание
    for day, lessons in day_schedule.items():
        schedule.append("\n".join(lessons))

    return "\n\n".join(schedule)

