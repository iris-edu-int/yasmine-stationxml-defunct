from yasmine.app.utils.db import get_database
from yasmine.app.models import ConfigModel
from yasmine.app.utils.config import ConfigDict
from obspy.clients.nrl.client import NRL
from yasmine.app.settings import NRL_ROOT


class NrlMixin(object):
    def __init__(self, *_, **__):
        self._nrl = None

    @property
    def nrl(self):
        if self._nrl is None:
            self._nrl = NRL(NRL_ROOT)
        return self._nrl

    @nrl.setter
    def nrl(self, value):
        self._nrl = value


class DbMixin(object):
    def __init__(self, *_, **__):
        self.db = get_database()


class ProcessMixin(DbMixin, NrlMixin):
    def __init__(self, *_, **__):
        self.__config__ = None
        self.sync_nrl_started = False

        DbMixin.__init__(self, *_, **__)
        NrlMixin.__init__(self, *_, **__)

    @property
    def config(self):
        if self.__config__ is None:
            self.__config__ = ConfigDict(self.db.query(ConfigModel).all())
        return self.__config__

    def update_config(self, group, name, value):
        with self.db.begin():
            var_type = type(value).__name__
            instance = self.db.query(ConfigModel).filter(ConfigModel.group == group, ConfigModel.name == name).first()
            if not instance:
                instance = ConfigModel(group=group, name=name, value=str(value), type=var_type)
                self.db.add(instance)
            else:
                instance.value = str(value)
                instance.type = var_type
        self.__config__ = None


class HandlerMixin(object):
    def __init__(self, application=None):
        self.application = application

    @property
    def db(self):
        return self.application.db

    @property
    def config(self):
        return self.application.config

    def update_config(self, group, name, value):
        self.application.update_config(group, name, value)

    @property
    def nrl(self):
        return self.application.nrl

    @nrl.setter
    def nrl(self, value):
        self.application.nrl = value

    @property
    def sync_nrl_started(self):
        return self.application.sync_nrl_started
