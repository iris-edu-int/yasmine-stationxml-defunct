import pickle

from sqlalchemy import Column, Text, ForeignKey, DateTime, Integer
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql.functions import func
from imct.app.models.base import Base, BaseMixin


class XmlNodeAttrRelationModel(Base):
    node_id = Column(ForeignKey('xml_node.id', ondelete='CASCADE'), primary_key=True)
    attr_id = Column(ForeignKey('xml_node_attribute.id', ondelete='CASCADE'), primary_key=True)

    node = relationship("XmlNodeModel", back_populates="attrs")
    attr = relationship("XmlNodeAttrModel")

    __tablename__ = 'xml_node_attribute_relation'


class XmlNodeModel(Base, BaseMixin):
    id = Column(Integer, primary_key=True, index=True, unique=True)
    clazz = Column(Text, nullable=False)
    parent_id = Column(ForeignKey('xml_node.id', ondelete='CASCADE'), nullable=True)

    attrs = relationship("XmlNodeAttrRelationModel", back_populates="node")
    parent = relationship("XmlNodeModel", backref="children", remote_side=[id])

    __tablename__ = 'xml_node'


class XmlNodeAttrWidgetModel(Base, BaseMixin):
    name = Column(Text, nullable=False)

    __tablename__ = 'xml_node_attr_type'


class XmlNodeAttrModel(Base, BaseMixin):
    name = Column(Text, nullable=False)
    widget_id = Column(ForeignKey(XmlNodeAttrWidgetModel.id, ondelete='CASCADE'), nullable=False)
    index = Column(Integer, nullable=False, server_default='0')

    widget = relationship(XmlNodeAttrWidgetModel)

    __tablename__ = 'xml_node_attribute'


class XmlModel(Base, BaseMixin):
    name = Column(Text, nullable=False)
    source = Column(Text, nullable=True)
    module = Column(Text, nullable=True)
    uri = Column(Text, nullable=True)
    sender = Column(Text, nullable=True)
    created_at = Column(DateTime(), default=func.now(), nullable=False)
    updated_at = Column(DateTime(), nullable=False, default=func.now(), onupdate=func.now())

    nodes = relationship('XmlNodeInstModel', lazy='dynamic')
    __tablename__ = 'xml'


class XmlNodeInstModel(Base, BaseMixin):
    id = Column(Integer, primary_key=True, index=True, unique=True)
    code = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    xml_id = Column(ForeignKey(XmlModel.id, ondelete='CASCADE'), nullable=True)
    node_id = Column(ForeignKey(XmlNodeModel.id, ondelete='CASCADE'), nullable=False)
    parent_id = Column(ForeignKey('xml_node_instance.id', ondelete='CASCADE'), nullable=True)

    parent = relationship('XmlNodeInstModel', backref=backref('children', lazy='dynamic'), remote_side=[id, xml_id])
    node = relationship(XmlNodeModel)
    xml = relationship(XmlModel)
    attr_vals = relationship('XmlNodeAttrValModel', lazy="dynamic")

    __tablename__ = 'xml_node_instance'


class XmlNodeAttrValModel(Base, BaseMixin):
    value = Column(Text, nullable=True)

    attr_id = Column(ForeignKey(XmlNodeAttrModel.id, ondelete='CASCADE'), nullable=False)
    node_inst_id = Column(ForeignKey(XmlNodeInstModel.id, ondelete='CASCADE'), nullable=False)

    attr = relationship(XmlNodeAttrModel)
    node_inst = relationship(XmlNodeInstModel)

    __tablename__ = 'xml_node_attr_value'

    @property
    def attr_class(self):
        return self.attr.widget.name

    @property
    def attr_name(self):
        return self.attr.name

    @property
    def attr_index(self):
        return self.attr.index

    @property
    def value_obj(self):
        return pickle.loads(self.value)

    @value_obj.setter
    def value_obj(self, data):
        self.value = pickle.dumps(data)

    @property
    def node_id(self):
        return self.node_inst.node_id
