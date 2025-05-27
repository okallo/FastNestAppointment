"""Initial migrationj

Revision ID: c36cdc747a0f
Revises: becd8fa060de
Create Date: 2025-05-27 16:51:29.737445

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c36cdc747a0f'
down_revision: Union[str, None] = 'becd8fa060de'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
