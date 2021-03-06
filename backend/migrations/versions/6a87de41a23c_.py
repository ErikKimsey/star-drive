"""empty message

Revision ID: 6a87de41a23c
Revises: 8e98024bd388
Create Date: 2019-01-31 11:00:38.018505

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6a87de41a23c'
down_revision = '8e98024bd388'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('home_questionnaire', sa.Column('dependent_living_other', sa.String(), nullable=True))
    op.add_column('home_questionnaire', sa.Column('dependent_living_situation', sa.String(), nullable=True))
    op.drop_column('home_questionnaire', 'dependant_living_other')
    op.drop_column('home_questionnaire', 'dependant_living_situation')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('home_questionnaire', sa.Column('dependant_living_situation', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('home_questionnaire', sa.Column('dependant_living_other', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('home_questionnaire', 'dependent_living_situation')
    op.drop_column('home_questionnaire', 'dependent_living_other')
    # ### end Alembic commands ###
