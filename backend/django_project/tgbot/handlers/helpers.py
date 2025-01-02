import requests
from datetime import datetime, timedelta
from asgiref.sync import sync_to_async
from django.core.exceptions import ValidationError
from api_students.models import Student, Group


async def get_student(telegram_id: int) -> Student:
    return await sync_to_async(Student.objects.get)(telegram_id=telegram_id)


async def validate_group(group_name):
    group = await sync_to_async(Group.objects.filter)(code=group_name)
    if await sync_to_async(group.exists)():
        return await sync_to_async(group.first)()

    try:
        group = await sync_to_async(Group.create)(code=group_name)
        return group
    except ValidationError as e:
        print(e)
        return None


def get_schedule(group_id):
    now = datetime.now()
    if now.month >= 9:
        last_date_in_year = datetime(year=now.year + 1, month=7, day=1)
    else:
        last_date_in_year = datetime(year=now.year, month=7, day=1)

    start_date = now
    base_url = "https://ruz.fa.ru/api/schedule/group"
    work_types = ["Зачеты", "Экзамены", "Семинар+зачет",
                  "Повторная промежуточная аттестация (зачет)", "Повторная промежуточная аттестация (экзамен)"]

    data = []
    while start_date < last_date_in_year:
        finish_date = min(start_date + timedelta(days=120), last_date_in_year)
        url = f"{base_url}/{group_id}?start={start_date.strftime('%Y.%m.%d')}&finish={finish_date.strftime('%Y.%m.%d')}"
        response = requests.get(url)

        if not response.status_code == 200:
            continue

        for x in response.json():
            if not x["kindOfWork"] in work_types:
                continue

            activity = {
                "activity_type": {
                    "name": x["kindOfWork"],
                    "fa_id": x["kindOfWorkOid"]
                },
                "discipline": {
                    "name": x["discipline"],
                    "fa_id": x["disciplineOid"]
                },
                "note": x["note"],
                "teacher": x["lecturer"],
                "date": x["date"],
                "start_time": x["beginLesson"],
                "end_time": x["endLesson"]
            }
            data.append(activity)

        start_date = finish_date + timedelta(days=1)

    return data


def parse_schedule(data: list[dict]):
    if len(data) == 0:
        return ["Нет данных о расписании"]

    schedule = {}
    for lesson in data:
        subject = lesson["discipline"]["name"]
        if not subject:
            continue

        lesson_info = f'⏱️ {lesson["start_time"]} - {lesson["end_time"]} ⏱️\n' \
                      f'<b>{subject}</b>\n' \
                      f'{lesson["activity_type"]["name"]}\n' \
                      f'Кто: {lesson["teacher"]}\n'

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
