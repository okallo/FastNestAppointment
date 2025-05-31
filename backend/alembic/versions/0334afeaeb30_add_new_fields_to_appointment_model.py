"""add new fields to Appointment model

Revision ID: 0334afeaeb30
Revises: aeeeefa22f82
Create Date: 2025-05-31 07:54:07.280145

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0334afeaeb30'
down_revision: Union[str, None] = 'aeeeefa22f82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
