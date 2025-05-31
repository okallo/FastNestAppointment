"""Add day_of_week column to availability

Revision ID: aa7a54da75c5
Revises: 7e8996c0e8e2
Create Date: 2025-05-31 08:11:06.364936
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa7a54da75c5'
down_revision: Union[str, None] = '7e8996c0e8e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('availability', sa.Column('day_of_week', sa.Integer(), nullable=False, server_default='0'))
    op.alter_column('availability', 'day_of_week', server_default=None)  


def downgrade() -> None:
    op.drop_column('availability', 'day_of_week')
