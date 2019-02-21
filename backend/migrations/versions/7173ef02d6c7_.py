"""empty message

Revision ID: 7173ef02d6c7
Revises: 7369d68ec9fe
Create Date: 2019-02-18 11:00:07.811577

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7173ef02d6c7'
down_revision = '7369d68ec9fe'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('education_dependent_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('attends_school', sa.Boolean(), nullable=True),
    sa.Column('school_name', sa.String(), nullable=True),
    sa.Column('school_type', sa.String(), nullable=True),
    sa.Column('dependent_placement', sa.String(), nullable=True),
    sa.Column('placement_other', sa.String(), nullable=True),
    sa.Column('current_grade', sa.String(), nullable=True),
    sa.Column('school_services', sa.String(), nullable=True),
    sa.Column('school_services_other', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('education_self_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('attends_school', sa.Boolean(), nullable=True),
    sa.Column('school_name', sa.String(), nullable=True),
    sa.Column('school_type', sa.String(), nullable=True),
    sa.Column('self_placement', sa.String(), nullable=True),
    sa.Column('placement_other', sa.String(), nullable=True),
    sa.Column('current_grade', sa.String(), nullable=True),
    sa.Column('school_services', sa.String(), nullable=True),
    sa.Column('school_services_other', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('education_questionnaire')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('education_questionnaire',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('last_updated', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('participant_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('attends_school', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('school_name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('current_grade', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('school_services', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('school_services_other', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('dependent_placement', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('placement_other', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('school_type', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('self_placement', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('time_on_task_ms', sa.BIGINT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], name='education_questionnaire_participant_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], name='education_questionnaire_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='education_questionnaire_pkey')
    )
    op.drop_table('education_self_questionnaire')
    op.drop_table('education_dependent_questionnaire')
    # ### end Alembic commands ###
