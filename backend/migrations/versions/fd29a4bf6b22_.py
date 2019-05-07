"""empty message

Revision ID: fd29a4bf6b22
Revises: da4c50ed75ff
Create Date: 2019-05-02 13:32:28.163056

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fd29a4bf6b22'
down_revision = 'da4c50ed75ff'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('location', sa.Column('email', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('location', 'email')
    # ### end Alembic commands ###
