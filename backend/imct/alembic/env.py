from __future__ import with_statement
from alembic import context
from sqlalchemy import engine_from_config, pool, event
from logging.config import fileConfig
from imct.app.models import Base
from imct.app.settings import DB_CONNECTION
from sqlalchemy.engine.base import Engine


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config  # @UndefinedVariable

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata  # @UndefinedVariable

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    context.configure(url=DB_CONNECTION, target_metadata=target_metadata, literal_binds=True)  # @UndefinedVariable

    with context.begin_transaction():  # @UndefinedVariable
        context.run_migrations()  # @UndefinedVariable


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, *_):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON;")
    cursor.close()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
        url=DB_CONNECTION)

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)  # @UndefinedVariable

        with context.begin_transaction():  # @UndefinedVariable
            context.run_migrations()  # @UndefinedVariable


if context.is_offline_mode():  # @UndefinedVariable
    run_migrations_offline()
else:
    run_migrations_online()
