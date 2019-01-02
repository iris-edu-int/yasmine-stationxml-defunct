#@PydevCodeAnalysisIgnore
"""empty message

Revision ID: a6fac381e718
Revises: 47d4cced3f55
Create Date: 2018-08-31 10:02:25.688444

"""
from alembic import op
import sqlalchemy as sa

from sqlalchemy.orm.session import Session
from imct.app.models import ConfigModel
import pickle
from imct.app.models import XmlNodeAttrModel


# revision identifiers, used by Alembic.
revision = 'a6fac381e718'
down_revision = '47d4cced3f55'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    session = Session(bind=bind)
    
    session.query(ConfigModel).filter(ConfigModel.group == 'station', ConfigModel.name == 'required_fields').update({'value': pickle.dumps(['code', 'start_date', 'latitude', 'longitude', 'creation_date', 'elevation', 'site'])})
        
    session.commit()


def downgrade():
    pass
