from yasmine.app.handlers.base import AsyncThreadMixin, BaseHandler
from yasmine.app.models import ConfigModel
from yasmine.app.models import XmlNodeAttrRelationModel
from sqlalchemy.orm import joinedload


class ConfigHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, db_id, **__):
        data = {'id': int(db_id)}
        for item in self.db.query(ConfigModel).all():
            data['%s__%s' % (item.group, item.name)] = item.value_obj
        return data

    def async_put(self, *_, **__):
        request_params = self.request_params
        with self.db.begin():
            for key, value in request_params.items():
                if key not in ['id']:
                    group, name = key.split('__')
                    record = self.db.query(ConfigModel).filter(ConfigModel.group == group, ConfigModel.name == name).first()
                    record.value_obj = value
        # to reset configuration
        self.application.__config__ = None
        return {'success': True}


class AttributeHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, node_id, **__):

        node_attrs = self.db.query(XmlNodeAttrRelationModel)\
            .join(XmlNodeAttrRelationModel.attr)\
            .options(joinedload(XmlNodeAttrRelationModel.attr))\
            .filter(XmlNodeAttrRelationModel.node_id == node_id)\
            .all()

        data = []
        for item in node_attrs:
            data.append({'id': item.attr.name})
        return data
