import asyncio
import sys
import os
import django


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()


async def main():
    from create_bot import dp, bot, scheduler, register_global_middlewares, config
    from handlers.main import router as main_block
    from handlers.sign_up_block import router as sign_up_block
    from handlers.confirmation_for_proctoring import router as confirmation_for_proctoring
    from handlers.settings import router as settings_block
    from handlers.discounts import router as discounts_block

    dp.include_routers(main_block, sign_up_block,
                       confirmation_for_proctoring, settings_block, discounts_block)
    logger.info("Starting bot")

    try:
        # scheduler.start()
        register_global_middlewares(dp, config)
        await dp.start_polling(bot)
    finally:
        await dp.storage.close()
        await bot.session.close()
        # scheduler.shutdown(True)


if __name__ == '__main__':
    from create_bot import logger

    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.error("Bot stopped!")
