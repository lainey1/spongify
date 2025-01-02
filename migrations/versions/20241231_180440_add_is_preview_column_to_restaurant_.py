"""Add is_preview column to restaurant_images

Revision ID: c2e6076bc3eb
Revises: 087fcde62dff
Create Date: 2024-12-31 18:04:40.403410

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c2e6076bc3eb'
down_revision = '087fcde62dff'
branch_labels = None
depends_on = None


def upgrade():
    # Add the `is_preview` column to `restaurant_images`
    op.add_column('restaurant_images', sa.Column('is_preview', sa.Boolean(), nullable=True))


def downgrade():
    # Remove the `is_preview` column from `restaurant_images`
    op.drop_column('restaurant_images', 'is_preview')
