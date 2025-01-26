import asyncio
from tgbot.create_bot import bot, logger
from .models import Message, Student


def send_message_task(message_id):
    try:
        message = Message.objects.get(pk=message_id)
        if message.is_sent:
            return

        if message.student:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            loop.run_until_complete(bot.send_message(
                message.student.telegram_id, message.text))
            loop.close()
        elif message.group:
            students: list[Student] = message.group.students.all()
            for student in students:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

                loop.run_until_complete(bot.send_message(
                    student.telegram_id, message.text))
                loop.close()

        message.is_sent = True
        message.save()

    except Message.DoesNotExist:
        logger.error(f"Message with ID {message_id} does not exist")
    except Exception as e:
        logger.error(f"Error while sending message: {e}")
