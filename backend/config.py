class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3"
    DEBUG = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'randomsecretstringtobehidden'
    SECRET_KEY = "randomkeytonotbeknown"
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'

      # cache specific
    CACHE_TYPE =  "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 10
    CACHE_REDIS_PORT = 6379

    WTF_CSRF_ENABLED = False