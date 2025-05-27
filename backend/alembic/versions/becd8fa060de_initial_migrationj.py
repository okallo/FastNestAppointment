"""Initial migrationj

Revision ID: becd8fa060de
Revises: 7c416dac4e82
Create Date: 2025-05-27 16:22:14.772623

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'becd8fa060de'
down_revision: Union[str, None] = '7c416dac4e82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
