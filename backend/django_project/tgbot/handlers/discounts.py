from asgiref.sync import sync_to_async
from aiogram import Router, F
from aiogram.types import Message
from api_students.models import Discount

router = Router()


@router.message(F.text == "Акции")
async def discounts(message: Message):
    discounts = await sync_to_async(lambda: list(Discount.objects.all()))()
    if not discounts:
        await message.answer("На данный момент акций нет")
        return

    await message.answer(f"Текущие акции: \n\n" + "\n".join(f"{discounts.index(discount) + 1}. {discount.content}" for discount in discounts))
    # for discount in discounts:
    #     await message.answer(discount.content)
