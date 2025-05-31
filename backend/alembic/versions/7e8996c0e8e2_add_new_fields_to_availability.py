"""add new fields to availability

Revision ID: 7e8996c0e8e2
Revises: 0334afeaeb30
Create Date: 2025-05-31 08:02:22.121329

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7e8996c0e8e2'
down_revision: Union[str, None] = '0334afeaeb30'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
