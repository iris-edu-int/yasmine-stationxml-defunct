import os

from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlalchemy.engine import create_engine
from sqlalchemy.orm.scoping import scoped_session
from sqlalchemy.orm.session import sessionmaker

from yasmine.app import models
from yasmine.app.settings import DB_CONNECTION
from yasmine.app.settings import RUN_ROOT, LOGGING_ROOT


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, *_):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.execute("PRAGMA auto_vacuum=INCREMENTAL ")
    cursor.execute("PRAGMA journal_mode=MEMORY")
    cursor.execute("PRAGMA TEMP_STORE=MEMORY")
    cursor.execute("PRAGMA cache_size=100000")
    cursor.close()


def get_database():
    engine = create_engine(DB_CONNECTION, isolation_level="SERIALIZABLE", connect_args={'timeout': 60})
    models.init_db(engine)
    return scoped_session(sessionmaker(bind=engine, autocommit=True, autoflush=True))


def syncdb(argv):
    import alembic.config
    import yasmine
    if not os.path.exists(RUN_ROOT):
        os.makedirs(RUN_ROOT)
    if not os.path.exists(LOGGING_ROOT):
        os.makedirs(LOGGING_ROOT)
    os.chdir(yasmine.__path__[0])
    alembic.config.main(argv)
