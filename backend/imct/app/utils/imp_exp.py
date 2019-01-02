from _collections import OrderedDict
from builtins import Exception
from itertools import groupby
import io
import traceback

from obspy.core.inventory.channel import Channel
from obspy.core.inventory.inventory import read_inventory, Inventory
from obspy.core.inventory.network import Network
from obspy.core.inventory.station import Station
from slugify import slugify
from sqlalchemy.orm import joinedload
from tornado.web import HTTPError

from imct.app.enums.xml_node import XmlNodeEnum
from imct.app.models.inventory import XmlModel, XmlNodeInstModel, XmlNodeAttrRelationModel, XmlNodeAttrValModel
from imct.app.utils.facade import HandlerMixin


class ImportStationXml(HandlerMixin):
    def __init__(self, name, file_obj, *_, **__):
        self.file_obj = file_obj
        self.name = name
        super(ImportStationXml, self).__init__(*_, **__)

    def instantiate_node(self, data, node_id, attrs_by_node_id):

        inst_node = XmlNodeInstModel(node_id=node_id,
                                     code=data.code,
                                     start_date=data.start_date.datetime if data.start_date else None,
                                     end_date=data.end_date.datetime if data.end_date else None)
        attrs = attrs_by_node_id[node_id]
        for attr in attrs:
            if hasattr(data, attr.name):
                value = getattr(data, attr.name)
                if value is not None:
                    inst_node.attr_vals.append(XmlNodeAttrValModel(attr=attr,
                                                                   node_inst=inst_node,
                                                                   value_obj=getattr(data, attr.name))
                                               )
        return inst_node

    def run(self):
        inv = read_inventory(self.file_obj)
        xml = XmlModel(name=self.name, source=inv.source, sender=inv.sender, module=inv.module, uri=inv.module_uri, created_at=inv.created.datetime)
        all_attrs = self.db.query(XmlNodeAttrRelationModel).options(joinedload(XmlNodeAttrRelationModel.attr)).all()
        attrs_by_node_id = OrderedDict((k, [o.attr for o in list(v)]) for k, v in groupby(all_attrs, lambda r: r.node_id))
        for network in inv.networks:
            network_inst_node = self.instantiate_node(network, XmlNodeEnum.NETWORK, attrs_by_node_id)
            xml.nodes.append(network_inst_node)
            for station in network.stations:
                staion_inst_node = self.instantiate_node(station, XmlNodeEnum.STATION, attrs_by_node_id)

                xml.nodes.append(staion_inst_node)
                network_inst_node.children.append(staion_inst_node)

                for channel in station.channels:
                    channel_inst_node = self.instantiate_node(channel, XmlNodeEnum.CHANNEL, attrs_by_node_id)

                    xml.nodes.append(channel_inst_node)
                    staion_inst_node.children.append(channel_inst_node)
        with self.db.begin():
            self.db.add(xml)

        return xml


class ConvertToInventory(HandlerMixin):

    def __init__(self, xml_model_id, *_, **__):
        self.xml_model_id = xml_model_id
        super(ConvertToInventory, self).__init__(*_, **__)

    def instantiate_node(self, clazz, attr_vals, params={}):
        node_atts = {}
        for attr_val in attr_vals:
            node_atts[attr_val.attr.name] = attr_val.value_obj
        node_atts.update(params)
        try:
            return clazz(**node_atts)
        except Exception as e:
            traceback.print_exc()
            raise HTTPError(reason="Unable to instantiate %s (%s): %s" % (clazz.__name__, node_atts, str(e)))

    def run(self):

        xml = self.db.query(XmlModel).get(self.xml_model_id)

        all_attrs = self.db.query(XmlNodeAttrValModel)\
            .join(XmlNodeAttrValModel.node_inst)\
            .options(joinedload(XmlNodeAttrValModel.attr))\
            .filter(XmlNodeInstModel.xml_id == self.xml_model_id)\
            .order_by(XmlNodeAttrValModel.node_inst_id)\
            .all()

        attrs_by_node_inst_id = OrderedDict((k, list(v)) for k, v in groupby(all_attrs, lambda r: r.node_inst_id))
        node_instanses = xml.nodes.order_by(XmlNodeInstModel.parent_id).all()
        node_inst_by_parent_id = OrderedDict((k, list(v)) for k, v in groupby(node_instanses, lambda r: r.parent_id))
        networks = []
        if None in node_inst_by_parent_id:
            for network_node in node_inst_by_parent_id[None]:
                network_attrs = attrs_by_node_inst_id[network_node.id]
                stations = []
                for station_node in node_inst_by_parent_id[network_node.id]:
                    station_attrs = attrs_by_node_inst_id[station_node.id]
                    chanels = []
                    for channel_node in node_inst_by_parent_id[station_node.id]:
                        channel_attrs = attrs_by_node_inst_id[channel_node.id]
                        chanels.append(self.instantiate_node(Channel, channel_attrs))
                    stations.append(self.instantiate_node(Station, station_attrs, {'channels': chanels}))
                networks.append(self.instantiate_node(Network, network_attrs, {'stations': stations}))
        return Inventory(networks, xml.source, xml.sender, xml.created_at, xml.module, xml.uri)


class ExportStationXml(HandlerMixin):
    def __init__(self, xml_model_id, *_, **__):
        self.xml_model_id = xml_model_id
        super(ExportStationXml, self).__init__(*_, **__)

    def instantiate_node(self, clazz, attr_vals, params={}):
        node_atts = {}
        for attr_val in attr_vals:
            node_atts[attr_val.attr.name] = attr_val.value_obj
        node_atts.update(params)
        return clazz(**node_atts)

    def run(self):
        try:
            inv = ConvertToInventory(self.xml_model_id, self).run()
        except Exception as e:
            raise HTTPError(reason="Unable to build XML: '%s'" % str(e))

        xml = self.db.query(XmlModel).get(self.xml_model_id)
        output = io.BytesIO()
        inv.write(output, format="STATIONXML")

        return "%s.xml" % slugify(xml.name), output
