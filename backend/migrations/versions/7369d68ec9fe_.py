"""empty message

Revision ID: 7369d68ec9fe
Revises: 728606db2525
Create Date: 2019-02-18 09:48:57.313844

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7369d68ec9fe'
down_revision = '728606db2525'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('current_behaviors_dependent_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('dependent_verbal_ability', sa.String(), nullable=True),
    sa.Column('concerning_behaviors', sa.String(), nullable=True),
    sa.Column('concerning_behaviors_other', sa.String(), nullable=True),
    sa.Column('has_academic_difficulties', sa.Boolean(), nullable=True),
    sa.Column('academic_difficulty_areas', sa.String(), nullable=True),
    sa.Column('academic_difficulty_other', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('current_behaviors_self_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('self_verbal_ability', sa.String(), nullable=True),
    sa.Column('has_academic_difficulties', sa.Boolean(), nullable=True),
    sa.Column('academic_difficulty_areas', sa.String(), nullable=True),
    sa.Column('academic_difficulty_other', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('current_behaviors_questionnaire')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('current_behaviors_questionnaire',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('last_updated', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('participant_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('concerning_behaviors', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('has_academic_difficulties', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('academic_difficulty_areas', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('academic_difficulty_other', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('concerning_behaviors_other', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('dependent_verbal_ability', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('self_verbal_ability', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('time_on_task_ms', sa.BIGINT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], name='current_behaviors_questionnaire_participant_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], name='current_behaviors_questionnaire_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='current_behaviors_questionnaire_pkey')
    )
    op.drop_table('current_behaviors_self_questionnaire')
    op.drop_table('current_behaviors_dependent_questionnaire')
    # ### end Alembic commands ###
