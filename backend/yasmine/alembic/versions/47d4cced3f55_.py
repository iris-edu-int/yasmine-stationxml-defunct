#@PydevCodeAnalysisIgnore
"""empty message

Revision ID: 47d4cced3f55
Revises: f5929f99de6f
Create Date: 2018-08-30 15:12:38.502550

"""
from alembic import op
import sqlalchemy as sa

from sqlalchemy.orm.session import Session
from yasmine.app.models import ConfigModel
import pickle
from yasmine.app.models import XmlNodeAttrModel
from obspy.core.inventory.util import Equipment


# revision identifiers, used by Alembic.
revision = '47d4cced3f55'
down_revision = 'f5929f99de6f'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    session = Session(bind=bind)
    
    session.query(ConfigModel).filter(ConfigModel.group == 'station', ConfigModel.name == 'required_fields').update({'value': pickle.dumps(['code', 'start_date', 'latitude', 'longitude', 'creation_date', 'elevation'])})
    session.query(ConfigModel).filter(ConfigModel.group == 'channel', ConfigModel.name == 'required_fields').update({'value': pickle.dumps(['code', 'start_date', 'latitude', 'longitude', 'location_code', 'elevation', 'depth'])})
        
    session.commit()


def downgrade():
    pass
