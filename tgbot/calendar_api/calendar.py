from typing import Union
from datetime import datetime as dt
from datetime import time, date, datetime
from googleapiclient.errors import HttpError
from create_bot import local_tz, local_tz_obj, calendar_id, calendar_service


def get_reg_datetime(event):
    reg_date_str = event["start"]["dateTime"].split('T')[0]
    reg_date = dt.strptime(reg_date_str, "%Y-%m-%d").date()

    time_start_str = event["start"]["dateTime"].split('T')[1][:5]
    reg_time_start = dt.strptime(time_start_str, "%H:%M").time()

    time_finish_str = event["end"]["dateTime"].split('T')[1][:5]
    reg_time_finish = dt.strptime(time_finish_str, "%H:%M").time()
    return {"reg_date": reg_date, "reg_time_start": reg_time_start, "reg_time_finish": reg_time_finish}


def async_exception_handler_decorator(func):
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except HttpError as e:
            raise ValueError(f"Произошла ошибка: {e}")
    return wrapper


tz = datetime.now(local_tz_obj).strftime('%z')


@async_exception_handler_decorator
async def get_events(schedule_date: Union[date, dt], start_time=time.min, end_time=time.max):
    start_time = dt.combine(
        schedule_date, start_time).isoformat() + tz
    end_time = dt.combine(
        schedule_date, end_time).isoformat() + tz

    events_result = (
        calendar_service.events()
        .list(
            calendarId=calendar_id,
            timeMin=start_time,
            timeMax=end_time,
            maxResults=1000,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    events = events_result.get("items", [])
    return events


@async_exception_handler_decorator
async def create_event(event_name: str, event_date: dt.date, start_time: dt.time, end_time: dt.time):
    start_time = dt.combine(event_date, start_time).isoformat()
    end_time = dt.combine(event_date, end_time).isoformat()

    event = {
        'summary': event_name,
        'start': {
            'dateTime': start_time,
            'timeZone': local_tz,
        },
        'end': {
            'dateTime': end_time,
            'timeZone': local_tz,
        },
    }

    event = calendar_service.events().insert(
        calendarId=calendar_id, body=event).execute()
    return event


@async_exception_handler_decorator
async def delete_event(event_id: int):
    calendar_service.events().delete(calendarId=calendar_id, eventId=event_id).execute()
