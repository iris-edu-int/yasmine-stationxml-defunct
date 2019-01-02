# -*- coding: utf-8 -*-
from datetime import datetime
from glob import glob
import os

from sqlalchemy.event.api import listens_for

from imct.app.models.base import Base
from imct.app.models.config import ConfigModel
from imct.app.models.inventory import XmlModel, XmlNodeModel, XmlNodeAttrModel, XmlNodeAttrWidgetModel, XmlNodeInstModel, XmlNodeAttrValModel, XmlNodeAttrRelationModel


def init_db(engine):
    Base.metadata.create_all(bind=engine)  # @UndefinedVariable
