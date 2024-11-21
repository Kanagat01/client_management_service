from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from keyboards.inline import UserSignUpInline

router = Router()


@router.message(F.text == "Старт")
@router.message(Command("start"))
async def sign_up(message: Message):
    first_name = "Баха"
    text = [
        f'Добрый день, {first_name}!',
        "Вот так создаешь большие текста"
    ]
    kb = UserSignUpInline.create_reg_gender_kb()
    await message.answer("\n".join(text), reply_markup=kb)


@router.callback_query(F.data == "sign_up")
async def sign_up(callback: CallbackQuery):
    first_name = "Баха"
    text = [
        f'Добрый день, {first_name}!',
        "Вот так создаешь большие текста"
    ]
    kb = UserSignUpInline.create_reg_gender_kb()
    await callback.message.answer("\n".join(text), reply_markup=kb)
