"""adding user profile fields

Revision ID: 60e5fcc90b57
Revises: c2e6076bc3eb
Create Date: 2025-01-01 19:19:59.809780

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '60e5fcc90b57'
down_revision = 'c2e6076bc3eb'
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns to the users table
    op.add_column('users', sa.Column('location', sa.String(length=150), nullable=True))
    op.add_column('users', sa.Column('favorite_cuisine', sa.String(length=100), nullable=True))
    op.add_column('users', sa.Column('headline', sa.String(length=255), nullable=True))


def downgrade():
    # Remove the added columns from the users table
    op.drop_column('users', 'headline')
    op.drop_column('users', 'favorite_cuisine')
    op.drop_column('users', 'location')
