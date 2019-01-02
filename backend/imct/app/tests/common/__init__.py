# -*- coding: utf-8 -*-

import requests
from imct.app.settings import TORNADO_HOST, TORNADO_PORT


def check_web_app_is_down():
    try:
        host = TORNADO_HOST if TORNADO_HOST else '127.0.0.1'
        r = requests.get("http://%s:%s/" % (host, TORNADO_PORT))
        r.text
        return False
    except Exception:
        return True
