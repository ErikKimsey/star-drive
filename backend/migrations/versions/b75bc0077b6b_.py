"""empty message

Revision ID: b75bc0077b6b
Revises: 3e71b16bd48f
Create Date: 2020-01-16 10:14:18.958694

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b75bc0077b6b'
down_revision = '3e71b16bd48f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('resource_change_log', sa.Column('type', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('resource_change_log', 'type')
    # ### end Alembic commands ###