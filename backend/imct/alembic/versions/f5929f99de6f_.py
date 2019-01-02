#@PydevCodeAnalysisIgnore
"""empty message

Revision ID: f5929f99de6f
Revises: bd9337399193
Create Date: 2018-08-30 11:13:26.719822

"""
from alembic import op
import sqlalchemy as sa

from sqlalchemy.orm.session import Session
from imct.app.models import ConfigModel
import pickle
from imct.app.models import XmlNodeAttrModel
from obspy.core.inventory.util import Equipment

# revision identifiers, used by Alembic.
revision = 'f5929f99de6f'
down_revision = 'bd9337399193'
branch_labels = None
depends_on = None

def upgrade():
    bind = op.get_bind()
    session = Session(bind=bind)

    session.query(ConfigModel).filter(ConfigModel.group == 'channel', ConfigModel.name == 'code').update({'value': pickle.dumps("BHZ")})

    session.commit()



def downgrade():
    pass
