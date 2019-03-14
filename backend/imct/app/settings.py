# -*- coding: utf-8 -*-
import logging
import os
from imct.app.utils.op_sys import is_windows

ROOT_DIR = os.path.join(os.path.dirname(__file__), '..')

#if is_windows():
#    APP_DIR = os.path.join('c:', os.sep, 'IMCT')
#else:
#    APP_DIR = os.path.join(os.sep, 'opt', 'IMCT')

# REC - 3/8/19 - set APP_DIR to the cwd + IMCT
APP_DIR = os.path.join(os.sep, os.getcwd(), 'IMCT')

RUN_ROOT = os.path.join(APP_DIR, '_run')

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

DB_NAME = 'db.sqlite'
DB_FILE = os.path.join(RUN_ROOT, DB_NAME)
DB_CONNECTION = ('sqlite:///%s' % DB_FILE)  # @UnusedVariable

TORNADO_HOST = ''  # @UnusedVariable
TORNADO_PORT = 80  # @UnusedVariable

DATE_FORMAT_SYSTEM = '%d/%m/%Y %H:%M:%S'  # @UnusedVariable

try:
    from imct.settings.dev import *
except:  # @IgnorePep8
    pass

MEDIA_ROOT = os.path.join(APP_DIR, '_media')  # @UnusedVariable
LOGGING_ROOT = os.path.join(APP_DIR, '_logs')  # @UnusedVariable
TMP_ROOT = os.path.join(APP_DIR, '_tmp')  # @UnusedVariable
NRL_ROOT = os.path.join(MEDIA_ROOT, 'nrl')  # @UnusedVariable

NRL_CRON = {'hour': 23, 'minute': 0, 'second': 0}
NRL_URL = 'http://ds.iris.edu/NRL/IRIS.zip'

LOGIING_CONSOLE_CONFIG = {
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
        'console': LOGIING_CONSOLE_CONFIG
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
