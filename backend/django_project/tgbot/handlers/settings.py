import random
import string
from asgiref.sync import sync_to_async
from aiogram import F, Router
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from django.core.exceptions import ValidationError

from backend.global_functions import send_whatsapp_sms
from api_students.models import Student, StudentRecord
from tgbot.create_bot import bot
from misc.states import UserFSM
from handlers.helpers import get_student, validate_group
from keyboards.inline import UserInlineKeyboard

router = Router()


@router.message(F.text == "Настройки")
async def settings(message: Message, state: FSMContext):
    try:
        student = await get_student(message.from_user.id)
    except Student.DoesNotExist:
        await message.answer("Вы не зарегистрированы в системе. Запишитесь на экзамен, чтобы получить доступ к этому разделу")
        return
    await render_settings(message, state, student)


async def render_settings(message: Message, state: FSMContext, student: Student):
    await state.clear()
    await state.set_data({"student": student})
    kb = UserInlineKeyboard.settings_kb()
    await message.answer('Вы находитесь в разделе "Настройки". Пожалуйста, выберите действие:', reply_markup=kb)


@router.callback_query(F.data == "back_to_settings")
async def back_to_settings_query(callback: CallbackQuery, state: FSMContext):
    await render_settings(callback.message, state, await get_student(callback.from_user.id))


@router.callback_query(F.data == "change_login")
async def change_login_query(callback: Message | CallbackQuery, state: FSMContext):
    message = callback.message if isinstance(
        callback, CallbackQuery) else callback
    kb = UserInlineKeyboard.go_back_btn("back_to_settings")
    await message.answer("Введите ваш новый логин от сайта campus.fa.ru", reply_markup=kb)
    await state.set_state(UserFSM.change_login)


@router.message(UserFSM.change_login)
async def change_login(message: Message, state: FSMContext):
    kb = UserInlineKeyboard.go_back_btn("change_login")
    await state.update_data(new_login=message.text)
    await state.set_state(UserFSM.change_password)
    await message.answer(f"Введите пароль для логина {message.text}", reply_markup=kb)


@router.message(UserFSM.change_password)
async def change_password(message: Message, state: FSMContext):
    data = await state.get_data()
    new_login = data.get("new_login")

    try:
        student: Student = await get_student(message.from_user.id)
        student.fa_login = new_login
        student.fa_password = message.text
        await sync_to_async(student.save)()
        await message.answer("Логин и пароль успешно изменены")
        await render_settings(message, state, student)
    except ValidationError as e:
        await message.answer(e.message)
        await change_login_query(message, state)


@router.callback_query(F.data == "change_group")
async def change_group_query(callback: Message | CallbackQuery, state: FSMContext):
    message = callback.message if isinstance(
        callback, CallbackQuery) else callback
    kb = UserInlineKeyboard.go_back_btn("back_to_settings")
    await message.answer("Напишите название вашей группы \n\nНапример, «ПИ18-1»", reply_markup=kb)
    await state.set_state(UserFSM.change_group)


@router.message(UserFSM.change_group)
async def change_group(message: Message, state: FSMContext):
    group = await validate_group(message.text)
    if group:
        student = await get_student(message.from_user.id)
        student.group = group
        await sync_to_async(student.save)()
        await message.answer(f"Группа успешно изменена на {message.text}")
        await render_settings(message, state, student)
    else:
        await message.answer(f"Группа «{message.text}» не существует \n\nПроверьте название группы на http://ruz.fa.ru/ruz")
        await change_group_query(message, state)


@router.callback_query(F.data == "change_whatsapp")
async def change_whatsapp_query(callback: Message | CallbackQuery, state: FSMContext):
    message = callback.message if isinstance(
        callback, CallbackQuery) else callback
    kb = UserInlineKeyboard.go_back_btn("back_to_settings")
    await message.answer("Введите ваш номер телефона в формате WhatsApp \n\nНапример, +79991234567", reply_markup=kb)
    await state.set_state(UserFSM.change_whatsapp)


@router.message(UserFSM.change_whatsapp)
async def change_whatsapp(message: Message, state: FSMContext):
    code = ''.join(random.choices(string.digits, k=4))
    send_whatsapp_sms(message.text, f"Код подтверждения: {code}")
    await state.update_data(new_whatsapp_number=message.text, confirmation_code=code)
    await state.set_state(UserFSM.confirm_change_whatsapp)

    kb = UserInlineKeyboard.go_back_btn("change_whatsapp")
    await message.answer("На ваш номер отправлено сообщение с кодом подтверждения. Пожалуйста, введите его", reply_markup=kb)


@router.message(UserFSM.confirm_change_whatsapp)
async def confirm_whatsapp(message: Message, state: FSMContext):
    state_data = await state.get_data()
    if message.text != state_data["confirmation_code"]:
        kb = UserInlineKeyboard.go_back_btn("change_whatsapp")
        await message.answer("Неверный код подтверждения. Попробуйте еще раз", reply_markup=kb)
        return

    student = await get_student(message.from_user.id)
    student.phone = state_data["new_whatsapp_number"]
    await sync_to_async(student.save)()
    await message.answer("Номер WhatsApp успешно изменен")
    await render_settings(message, state, student)


@router.callback_query(F.data == "change_student_records")
async def change_student_records(callback: CallbackQuery):
    student = await get_student(callback.from_user.id)
    records: list[StudentRecord] = await sync_to_async(lambda: list(student.records.all()))()
    for record in records:
        activity = await sync_to_async(lambda: str(record.activity))()
        kb = UserInlineKeyboard.change_record(
            record.pk, record.marked_as_proctoring)
        await callback.message.answer(f"Запись #{record.pk}: <b>{activity}</b>", reply_markup=kb)


@router.callback_query(F.data.startswith("toggle_proctoring"))
async def toggle_proctoring_query(callback: CallbackQuery):
    record_id = int(callback.data.split(":")[1])
    record = await sync_to_async(StudentRecord.objects.get)(pk=record_id)
    record.marked_as_proctoring = not record.marked_as_proctoring
    await sync_to_async(record.save)()
    kb = UserInlineKeyboard.change_record(
        record.pk, record.marked_as_proctoring)
    await callback.message.edit_reply_markup(reply_markup=kb)


@router.callback_query(F.data.startswith("confirm_delete"))
async def confirm_delete_query(callback: CallbackQuery):
    record_id = int(callback.data.split(":")[1])
    kb = UserInlineKeyboard.confirm_delete(
        record_id, callback.message.message_id)
    await callback.message.answer(f"Вы уверены, что хотите удалить запись #{record_id}?", reply_markup=kb)


@router.callback_query(F.data.startswith("delete_record"))
async def delete_record_query(callback: CallbackQuery):
    record_id, message_id = map(int, callback.data.split(":")[1:])
    record = await sync_to_async(lambda: StudentRecord.objects.get(pk=record_id))()
    record_name = await sync_to_async(lambda: str(record.activity))()
    await sync_to_async(record.delete)()
    await bot.delete_message(callback.from_user.id, message_id)
    await callback.message.delete()
    await callback.message.answer(f"Запись #{record_id}: <b>{record_name}</b> успешно удалена")


@router.callback_query(F.data.startswith("cancel_delete"))
async def cancel_delete_query(callback: CallbackQuery):
    await callback.message.delete()
