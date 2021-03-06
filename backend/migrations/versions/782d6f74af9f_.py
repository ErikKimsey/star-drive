"""empty message

Revision ID: 782d6f74af9f
Revises: 9b391c53128c
Create Date: 2019-01-16 11:18:23.728781

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '782d6f74af9f'
down_revision = '9b391c53128c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('demographics_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('guardian_id', sa.Integer(), nullable=True),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('middle_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('is_first_name_preferred', sa.Boolean(), nullable=True),
    sa.Column('nickname', sa.String(), nullable=True),
    sa.Column('birthdate', sa.Date(), nullable=True),
    sa.Column('birth_city', sa.String(), nullable=True),
    sa.Column('birth_state', sa.String(), nullable=True),
    sa.Column('birth_sex', sa.String(), nullable=True),
    sa.Column('current_gender', sa.String(), nullable=True),
    sa.Column('race_ethnicity', sa.String(), nullable=True),
    sa.Column('is_english_primary', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['guardian_id'], ['stardrive_user.id'], ),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('guardian_demographics_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('guardian_id', sa.Integer(), nullable=True),
    sa.Column('birthdate', sa.Date(), nullable=True),
    sa.Column('sex', sa.String(), nullable=True),
    sa.Column('race_ethnicity', sa.String(), nullable=True),
    sa.Column('is_english_primary', sa.Boolean(), nullable=True),
    sa.Column('relationship_to_child', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['guardian_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('guardian_demographics_questionnaire')
    op.drop_table('demographics_questionnaire')
    # ### end Alembic commands ###
