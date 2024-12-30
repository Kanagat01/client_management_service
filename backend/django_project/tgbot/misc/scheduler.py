from datetime import datetime
from create_bot import scheduler, bot, config


admin_ids = config.tg_bot.admin_ids


class BaseScheduler:
    event_type = None

    @classmethod
    async def delete(cls, job_id: int):
        scheduler.remove_job(job_id=f"{job_id}_{cls.event_type}")


class AutoTextScheduler(BaseScheduler):
    event_type = "auto_text"

    @classmethod
    async def func(cls, auto_text: str, user_id: int):
        await bot.send_message(chat_id=user_id, text=auto_text)

    @classmethod
    async def create(cls, auto_text: str, user_id: int, dtime: datetime):
        scheduler.add_job(
            id=f"{dtime.strftime('%d.%m.%Y %H:%M:%S')}_{auto_text}_{user_id}",
            func=cls.func,
            trigger="date",
            run_date=dtime,
            kwargs={
                "auto_text": auto_text,
                "user_id": user_id
            }
        )
