from dataclasses import dataclass
from environs import Env


@dataclass
class RedisConfig:
    host: str
    port: str
    db: str


@dataclass
class TgBot:
    token: str
    calendar_id: str
    use_redis: bool


@dataclass
class Config:
    tg_bot: TgBot
    rds: RedisConfig


def load_config(path: str = None):
    env = Env()
    env.read_env(path)

    return Config(
        tg_bot=TgBot(
            token=env.str("BOT_TOKEN"),
            calendar_id=env.str("CALENDAR_ID"),
            use_redis=env.bool("USE_REDIS"),
        ),
        rds=RedisConfig(
            host=env.str('REDIS_HOST'),
            port=env.str('REDIS_PORT'),
            db=env.str('REDIS_DB')
        )
    )
