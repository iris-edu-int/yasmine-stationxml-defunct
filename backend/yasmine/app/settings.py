# -*- coding: utf-8 -*-
import logging
import os
from yasmine.app.utils.op_sys import is_windows

# this is the root directory where yasmine site-packages can be found
ROOT_DIR = os.path.join(os.path.dirname(__file__), '..')

#if is_windows():
#    APP_DIR = os.path.join('c:', os.sep, 'yasmine')
#else:
#    APP_DIR = os.path.join(os.sep, 'opt', 'yasmine')

# this is where the application's run time files such as logs and the db can be found
# REC - 3/8/19 - set APP_DIR to the cwd + yasmine
# REC - 11/20/2019 -- this can be set using environment variable YASMINE_APP_DIR
env_APP_DIR = os.getenv('YASMINE_APP_DIR')   # might be None
APP_DIR = os.path.join(os.sep, os.getcwd(), 'yasmine') if env_APP_DIR is None else env_APP_DIR
#
RUN_ROOT = os.path.join(APP_DIR, '_run')
MEDIA_ROOT = os.path.join(APP_DIR, '_media')  # @UnusedVariable
LOGGING_ROOT = os.path.join(APP_DIR, '_logs')  # @UnusedVariable
TMP_ROOT = os.path.join(APP_DIR, '_tmp')  # @UnusedVariable

# the alembic templates are placed in parallel to the yasmine site-packages
TEMPLATES_DIR = os.path.join(ROOT_DIR, 'templates')

TORNADO_SETTINGS = {  # @UnusedVariable
    'debug': True,
    'autoreload': True,
    'compiled_template_cache': False,
    'static_hash_cache': False,
    'serve_traceback': True,
    'static_path': os.path.join(ROOT_DIR, 'static'),
    'template_path': TEMPLATES_DIR,
    'cookie_secret': 'AC<rz+K.t_[.]z-MH!e99SH'
}

# the location of the sqlite database for yasmine
# DB file could be changed with environment variable 'YASMINE_DB_FILE'
DB_NAME = 'db.sqlite'
env_DB_FILE = os.getenv('YASMINE_DB_FILE')  # might be None
DB_FILE = os.path.join(RUN_ROOT, DB_NAME) if env_DB_FILE is None else env_APP_DIR
DB_CONNECTION = ('sqlite:///%s' % DB_FILE)  # @UnusedVariable

# tornado server host and port can be changed with environment variables
env_TORNADO_HOST = os.getenv('YASMINE_TORNADO_HOST')
TORNADO_HOST = '' if env_TORNADO_HOST is None else env_TORNADO_HOST
env_TORNADO_PORT = os.getenv('YASMINE_TORNADO_PORT')
TORNADO_PORT = 80 if env_TORNADO_PORT is None else env_TORNADO_PORT

DATE_FORMAT_SYSTEM = '%d/%m/%Y %H:%M:%S' 

try:
    from yasmine.settings.dev import *
except:  # @IgnorePep8
    pass

# here are the settings for the Nominal Response library download source and its
# destination directory
# The NRL source URL can be changed using the environment variable 'YASMINE_NRL_URL'
NRL_ROOT = os.path.join(MEDIA_ROOT, 'nrl')  # @UnusedVariable
NRL_CRON = {'hour': 23, 'minute': 0, 'second': 0}
env_NRL_URL = os.getenv('YASMINE_NRL_URL')
NRL_URL = 'http://ds.iris.edu/NRL/IRIS.zip' if env_NRL_URL is None else env_NRL_URL

LOGGING_CONSOLE_CONFIG = {
    'class': 'logging.StreamHandler',
    'level': logging.ERROR,
    'formatter': 'default',
    'stream': 'ext://sys.stdout'
}

LOGGING_CONFIG = dict(
    version=1,
    formatters={
        'default': {
            'format': '%(asctime)s - %(levelname)s - %(module)s - %(message)s'
        }
    },
    handlers={
        'access_default': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': logging.ERROR,
            'formatter': 'default',
            'maxBytes': 10485760,
            'filename': os.path.join(LOGGING_ROOT, 'access.log'),
            'backupCount': 20,
            'encoding': 'utf8'
        },
        'application_default': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': logging.ERROR,
            'formatter': 'default',
            'filename': os.path.join(LOGGING_ROOT, 'application.log'),
            'maxBytes': 10485760,
            'backupCount': 20,
            'encoding': 'utf8'
        },
        'general_default': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': logging.ERROR,
            'formatter': 'default',
            'maxBytes': 10485760,
            'filename': os.path.join(LOGGING_ROOT, 'general.log'),
            'backupCount': 20,
            'encoding': 'utf8'
        },
        'console': LOGGING_CONSOLE_CONFIG
    },
    loggers={
        'tornado.access': {
            'handlers': ['access_default', 'console'],
            'level': logging.DEBUG
        },
        'tornado.application': {
            'handlers': ['application_default', 'console'],
            'level': logging.DEBUG
        },
        'tornado.general': {
            'handlers': ['general_default', 'console'],
            'level': logging.DEBUG
        }
    }
)