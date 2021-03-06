"""empty message

Revision ID: 0c9d21ed28da
Revises: 8f53dde47283
Create Date: 2019-01-30 10:59:24.920512

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0c9d21ed28da'
down_revision = '8f53dde47283'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('home_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('self_living_situation', sa.ARRAY(sa.String()), nullable=True),
    sa.Column('self_living_other', sa.String(), nullable=True),
    sa.Column('dependant_living_situation', sa.ARRAY(sa.String()), nullable=True),
    sa.Column('dependant_living_other', sa.String(), nullable=True),
    sa.Column('struggle_to_afford', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('housemate',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('home_questionnaire_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('relationship', sa.String(), nullable=True),
    sa.Column('relationship_other', sa.String(), nullable=True),
    sa.Column('age', sa.Integer(), nullable=True),
    sa.Column('has_autism', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['home_questionnaire_id'], ['home_questionnaire.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('housemate')
    op.drop_table('home_questionnaire')
    # ### end Alembic commands ###
