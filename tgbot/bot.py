import asyncio
from handlers.echo import router as echo_router
from handlers.sign_up_block import router as sign_up_block 
from handlers.write_to_personal import router as write_to_personal
from create_bot import bot, dp, scheduler, logger, register_global_middlewares, config

routers = [
    sign_up_block,
    write_to_personal
]


async def main():
    logger.info("Starting bot")
    dp.include_routers(*routers, echo_router)

    try:
        scheduler.start()
        register_global_middlewares(dp, config)
        await dp.start_polling(bot)
    finally:
        await dp.storage.close()
        await bot.session.close()
        scheduler.shutdown(True)


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.error("Bot stopped!")
