"""empty message

Revision ID: ccd95502a214
Revises: 564e91456850
Create Date: 2019-02-04 16:53:04.746327

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ccd95502a214'
down_revision = '564e91456850'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('developmental_questionnaire', sa.Column('birth_complications_description', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('developmental_questionnaire', 'birth_complications_description')
    # ### end Alembic commands ###
