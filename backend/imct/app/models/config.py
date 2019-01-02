from sqlalchemy import Column, Integer, String, Text

from imct.app.models.base import Base, BaseMixin
import pickle
from sqlalchemy.sql.schema import UniqueConstraint


class ConfigModel(Base, BaseMixin):

    id = Column(Integer, primary_key=True)
    group = Column(String(50), nullable=False)
    name = Column(String(50), nullable=False)
    value = Column(Text(), nullable=False, default='')

    __tablename__ = 'config'
    UniqueConstraint('group', 'name', name='config_group_name_uniq')

    @property
    def value_obj(self):
        return pickle.loads(self.value)

    @value_obj.setter
    def value_obj(self, data):
        self.value = pickle.dumps(data)
