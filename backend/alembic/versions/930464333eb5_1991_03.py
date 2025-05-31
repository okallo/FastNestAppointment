"""1991-03

Revision ID: 930464333eb5
Revises: aa7a54da75c5
Create Date: 2025-05-31 08:14:15.638860

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '930464333eb5'
down_revision: Union[str, None] = 'aa7a54da75c5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('availability', sa.Column('day_of_week', sa.Integer(), nullable=False, server_default='0'))
    op.alter_column('availability', 'day_of_week', server_default=None)  
    


def downgrade() -> None:
    op.drop_column('availability', 'day_of_week')
    
