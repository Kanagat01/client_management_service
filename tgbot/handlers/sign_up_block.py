import requests
from bs4 import BeautifulSoup
from aiogram import Router, F
from aiogram.filters import Command, StateFilter
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from datetime import datetime, timedelta
from misc.states import UserFSM
from misc.button import *
from requests.exceptions import RequestException
import zipfile

BASE_URL = "http://localhost:8000/students/students/"
CAMPUS_URL = "https://campus.fa.ru/login/index.php"

router = Router()
@router.message(Command("start"))
async def start(message: Message, state: FSMContext):
    await state.set_state(UserFSM.group)
    await message.answer("Напишите название вашей группы\n\nНапример: «ПИ18-1»")


@router.message(UserFSM.group)
async def enter_group(message: Message, state: FSMContext):
    group_name = message.text
    group_id = await validate_group(group_name)

    if group_id:
        await message.answer(f"Группа {group_name} успешно зарегистрирована!", reply_markup=main_menu_keyboard)
        await state.update_data(group=group_name, group_id=group_id)
        schedule = await get_schedule(group_id, "эта_неделя")

        if not schedule:
            await message.answer("Нет данных о расписании.")
            await state.clear()
            return

        day_schedule = {}
        for lesson in schedule:
            subject = lesson.get("kindOfWork", "").strip()
            if not subject:
                continue
            day = lesson.get("dayOfWeekString", "")
            date = lesson.get("date", "")
            lesson_info = (
                f'\U0001F553 {lesson.get("beginLesson", "")} - {lesson.get("endLesson", "")}\U0001F553 \n'
                f'<b>{subject}</b>\n'
                f'Где: {lesson.get("auditorium", "")}\n'
                f'Кто: {lesson.get("lecturer", "")}\n'                
            )
            if day in day_schedule:
                day_schedule[day].append((date, lesson_info))
            else:
                day_schedule[day] = [(date, lesson_info)]

        week_colors = [f"<b><u>{i+1}</u></b>" for i in range(len(day_schedule))]


        for i, (day, lessons) in enumerate(day_schedule.items()):
            day_output = [f"{week_colors[i]} {day} ({lessons[0][0]}):"]
            day_output.extend([f"\n{lesson[1]}" for lesson in lessons])
            try:
                await message.answer("\n".join(day_output))
            except UnicodeEncodeError:
                sanitized_output = "\n".join(day_output).encode("utf-16", "surrogatepass").decode("utf-16")
                await message.answer(sanitized_output)


        await state.clear()
    else:
        await message.answer("Группа не найдена. Попробуйте снова.")

# Регистрация на экзамены
@router.message(F.text == "Запись на все экзамены")
async def register_for_exams(message: Message, state: FSMContext):
    await state.set_state(UserFSM.login)
    await message.answer("Введите ваш логин от сайта campus.fa.ru:", reply_markup=registration_keyboard)

#Mеню настроек  (которые без функционала)
@router.message(F.text == "Настройки")
async def settings(message: Message, state: FSMContext):
    # Отправляем меню настроек
    await message.answer("Выберите, что хотите изменить:", reply_markup=settings_keyboard)


# Ввод логина
@router.message(UserFSM.login)
async def enter_login(message: Message, state: FSMContext):
    await state.update_data(login=message.text)
    await state.set_state(UserFSM.password)
    await message.answer("Введите ваш пароль:", reply_markup=registration_keyboard)

# Ввод пароля
@router.message(UserFSM.password)
async def enter_password(message: Message, state: FSMContext):
    data = await state.get_data()
    login = data["login"]
    password = message.text
    response = requests.post("https://campus.fa.ru/login/index.php", data={"username": login, "password": password})
    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.title.string if soup.title else ""

    if "Личный кабинет" in title:
        # await state.clear()
        user_name_element = soup.select_one(".myprofileitem.fullname")
        user_name = user_name_element.text.strip() if user_name_element else "Неизвестный пользователь"
        await message.answer(f"Hello, {user_name}")  ##################

    # Получение номера телефона от пользователя
        await message.answer("Введите ваш номер телефона для завершения регистрации:")
        await state.update_data(login=login, password=password, user_name=user_name)
        await state.set_state(UserFSM.phone)
    else:
        await state.set_state(UserFSM.login)
        await message.answer("Неправильный логин или пароль. Попробуйте снова.")
    
# Проверка после каждого шага FSM
    data = await state.get_data()
    print(f"Текущее состояние данных: {data}")

# Обработка номера телефона
@router.message(UserFSM.phone)
async def enter_phone_number(message: Message, state: FSMContext):
    phone_number = message.text
    data = await state.get_data()
    await state.update_data(phone_number=phone_number)
    
    # Данные для запроса
    payload = {
    "full_name": data.get("user_name", ""),
    "login": data.get("login", ""),
    "phone": phone_number,
    "password": data.get("password", "")
}
    print(f"Payload для отправки: {payload}")


    try:
        # Запрос на создание студента
        response = requests.post("http://localhost:8000/students/students/", json=payload)
        response_data = response.json()

        if response.status_code == 201:  # Успешное создание
            student_id = response_data.get("id")
            await message.answer(f"Студент успешно создан! ID: {student_id}")
            # Здесь добавьте код для создания записи
        else:
            await message.answer(f"Ошибка при создании студента: {response_data.get('detail', 'Неизвестная ошибка')}")

    except RequestException as e:
        await message.answer(f"Ошибка соединения с сервером: {str(e)}")

    await state.clear()


def send_whatsapp_message(phone_number, message_text):
    url = "https://wappi.pro/api/sendMessage"  # API URL для отправки сообщений через Wappi.pro
    api_key = "eb7d10e8656f18bdb473efa8d2b8bd2906aa9d8e"  # Ваш API-ключ
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "to": phone_number,  # Номер телефона получателя
        "message": message_text,  # Текст сообщения
        "from": "YourName",  # Имя отправителя (опционально)
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            print(f"Сообщение успешно отправлено на {phone_number}")
        else:
            print(f"Ошибка при отправке сообщения: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при отправке сообщения: {str(e)}")






# Обработчик выбора прокторинга
@router.message(F.text == "Запись на прокторинг")
async def register_proctoring(message: Message, state: FSMContext):
    await state.set_state(UserFSM.proctoring_choice)
    await message.answer("Выберите способ записи на экзамен:", reply_markup=proctoring_choice_keyboard)

# Обработчик выбора способа записи
@router.message(StateFilter(UserFSM.proctoring_choice), F.text == "Все")
async def register_all_exams(message: Message, state: FSMContext):
    await state.set_state(UserFSM.notification_choice)
    await message.answer("Вы выбрали запись на все экзамены. Теперь выберите способ получения уведомлений:", reply_markup=notification_keyboard)

@router.message(StateFilter(UserFSM.proctoring_choice), F.text == "Указать номер")
async def specify_exam_number(message: Message, state: FSMContext):
    await state.set_state(UserFSM.notification_choice)
    await message.answer("Введите номер экзамена:", reply_markup=notification_keyboard)

# Обработчик выбора уведомлений
@router.message(StateFilter(UserFSM.notification_choice), F.text == "Ввести номер телефона для получения уведомлений в WhatsApp")
async def enter_phone_number(message: Message, state: FSMContext):
    await message.answer("Введите ваш номер телефона для получения уведомлений в WhatsApp:")
    await state.set_state(UserFSM.phone)

@router.message(UserFSM.phone)
async def enter_phone_number_for_notifications(message: Message, state: FSMContext):
    phone_number = message.text  # Номер телефона пользователя
    data = await state.get_data()

    # Сформируйте текст уведомления (например, расписание или информация о экзаменах)
    notification_text = "Ваше расписание на следующую неделю: \n1. Математика, 10:00 - 12:00"

    # Отправка уведомления через WhatsApp
    send_whatsapp_message(phone_number, notification_text)

    await message.answer(f"Уведомление успешно отправлено на номер {phone_number}.")
    await state.clear()


@router.message(StateFilter(UserFSM.notification_choice), F.text == "Назад")
async def go_back_to_main_menu(message: Message, state: FSMContext):
    await state.set_state(UserFSM.group)
    await message.answer("Напишите название вашей группы снова\n\nНапример: «ПИ18-1»")

@router.message(F.text == "Главное меню")
async def go_to_main_menu(message: Message):
    await message.answer("Вы вернулись в главное меню", reply_markup=main_menu_keyboard)





# Обработка нажатия кнопки "ПОДТВЕРЖДЕНИЕ ДЛЯ ПРОКТОРИНГА"
@router.message(F.text == "Подтверждение для прокторинга")
async def confirmation_for_proctoring(message:Message, state: FSMContext):
    user_data = await state.get_data() #осы жеры тоже шыкпай калды 
    # Проверка, верифицирован ли студент
    if user_data.get("verified", False):
        # Студент верифицирован: отправляем инструкцию и архив
        instruction_text = "Вот инструкция по прокторингу:\n\n" \
                           "1. Прочитайте все инструкции внимательно.\n" \
                           "2. Подготовьте ваше рабочее место.\n" \
                           "3. Пройдите верификацию и подтвердите все данные.\n" \
                           "4. Убедитесь, что ваша камера и микрофон работают.\n" \
                           "5. Следуйте указаниям инструктора.\n\n" \
                           "Дополнительные материалы прилагаются."

        # Создаем архив с инструкцией
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Добавляем текстовый файл с инструкцией в архив
            zip_file.writestr("instruction.txt", instruction_text)
            # Пример добавления дополнительных файлов
            # zip_file.write("path_to_additional_file", "additional_file.txt")
        zip_buffer.seek(0)
        # Отправляем архив и текст
        await message.answer("Верификация успешна! Вот инструкция и архив с материалами по прокторингу.",reply_markup=confirmation_button())
        # Отправка файла
        await message.answer_document(
            document=types.InputFile(zip_buffer, filename="proctoring_instruction.zip")
        )
    else:
        # Студент не верифицирован: перебрасываем на верификацию
        await message.answer(
            "Для получения инструкции по прокторингу вам нужно пройти верификацию. Пожалуйста, запросите верификацию через наш Telegram аккаунт.")
        #     reply_markup=InlineKeyboardMarkup().add(
        #         InlineKeyboardButton(text="Перейти к верификации", url="https://t.me/tteessttfa")
        #     )
        # )




# Функция для валидации группы
async def validate_group(group_name):
    url = f"https://ruz.fa.ru/api/search?term={group_name}&type=group"
    response = requests.get(url)

    if response.status_code == 200:
        groups = response.json()
    if not groups:
        return None
    for group in groups:
        if group.get("label") == group_name:
            return group.get("id")
    return None


async def get_schedule(group_id, period):
    base_url = "https://ruz.fa.ru/api/schedule/group"

    september_start = datetime(year=datetime.now().year, month=9, day=1)
    start_date = september_start
    finish_date = start_date + timedelta(days=30*3)

    start_date_str = start_date.strftime("%Y.%m.%d")
    finish_date_str = finish_date.strftime("%Y.%m.%d")

    url = f"{base_url}/{group_id}?start={start_date_str}&finish={finish_date_str}&lng=1"
    response = requests.get(url)
    
    if response.status_code == 200:
        try:
            result = response.json()
            if not result:
                return None

            next_start_date = finish_date + timedelta(days=1)
            next_finish_date = next_start_date + timedelta(days=30*3)

            next_start_date_str = next_start_date.strftime("%Y.%m.%d")
            next_finish_date_str = next_finish_date.strftime("%Y.%m.%d")

            url_next = f"{base_url}/{group_id}?start={next_start_date_str}&finish={next_finish_date_str}&lng=1"
            response_next = requests.get(url_next)

            if response_next.status_code == 200:
                result_next = response_next.json()
                if not result_next:
                    return result
                return result_next
            else:
                return result
        except ValueError:
            return None
    else:
        return None

# url1_description