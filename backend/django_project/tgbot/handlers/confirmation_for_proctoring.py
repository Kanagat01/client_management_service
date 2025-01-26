from asgiref.sync import sync_to_async
from aiogram import F, Router
from aiogram.types import Message, CallbackQuery, FSInputFile, InputMediaDocument

from api_students.models import Student, InstructionForProctoring, Code
from handlers.helpers import get_student
from handlers.sign_up_block import get_verifiction_for_proctoring
from keyboards.inline import UserInlineKeyboard

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

        kb = UserInlineKeyboard.get_code_kb()
        if len(media_group) == 0:
            await message.answer(instruction.text, reply_markup=kb)
        else:
            media_group[len(media_group) - 1].caption = instruction.text
            await message.answer_media_group(media_group)
            await message.answer("Выберите действие:", reply_markup=kb)

    except Student.DoesNotExist:
        await message.answer("Вы не зарегистрированы в системе. Запишитесь на экзамен, чтобы получить доступ к этому разделу")
        return


@router.callback_query(F.data == "get_code")
async def get_code(callback: CallbackQuery):
    student = await get_student(callback.from_user.id)
    student_code = await sync_to_async(lambda: Code.objects.filter(student=student).exists())()
    if student_code:
        await callback.message.answer("Для получения кода, обратитесь к администратору https://t.me/tteessttfa")
        return

    code: Code = await sync_to_async(lambda: Code.objects.filter(student=None).first())()
    code.student = student
    await sync_to_async(code.save)()
    await callback.message.answer(f"<b>Ваш код:</b> {code.value}")
