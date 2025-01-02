from asgiref.sync import sync_to_async
from aiogram import F, Router
from aiogram.types import Message, FSInputFile, InputMediaDocument

from api_students.models import Student, InstructionForProctoring
from handlers.sign_up_block import get_verifiction_for_proctoring

router = Router()


@router.message(F.text == "Подтверждение для прокторинга")
async def confirmation_for_proctoring(message: Message):
    try:
        student: Student = await sync_to_async(Student.objects.get)(telegram_id=message.from_user.id)
        if not student.is_verified:
            await get_verifiction_for_proctoring(message)
            return

        instruction = await sync_to_async(InstructionForProctoring.objects.first)()
        if not instruction:
            await message.answer("Инструкция для прокторинга отсутствует")
            return

        media_group = []
        if instruction.file:
            file = FSInputFile(instruction.file.path)
            media = InputMediaDocument(media=file)
            media_group.append(media)
        if instruction.video:
            file = FSInputFile(instruction.video.path)
            media = InputMediaDocument(media=file)
            media_group.append(media)

        if len(media_group) == 0:
            await message.answer(instruction.text)
        else:
            media_group[len(media_group) - 1].caption = instruction.text
            await message.answer_media_group(media_group)

    except Student.DoesNotExist:
        await message.answer("Вы не зарегистрированы в системе. Запишитесь на экзамен, чтобы получить доступ к этому разделу")
        return
