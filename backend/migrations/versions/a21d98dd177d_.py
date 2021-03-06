"""empty message

Revision ID: a21d98dd177d
Revises: 6a87de41a23c
Create Date: 2019-02-01 16:41:05.240541

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a21d98dd177d'
down_revision = '6a87de41a23c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('step_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('questionnaire_name', sa.String(), nullable=True),
    sa.Column('questionnaire_id', sa.Integer(), nullable=True),
    sa.Column('flow', sa.String(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('date_completed', sa.DateTime(), nullable=True),
    sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('contact_questionnaire', sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True))
    op.add_column('demographics_questionnaire', sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True))
    op.add_column('evaluation_history_questionnaire', sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True))
    op.add_column('home_questionnaire', sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True))
    op.add_column('identification_questionnaire', sa.Column('time_on_task_ms', sa.BigInteger(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('identification_questionnaire', 'time_on_task_ms')
    op.drop_column('home_questionnaire', 'time_on_task_ms')
    op.drop_column('evaluation_history_questionnaire', 'time_on_task_ms')
    op.drop_column('demographics_questionnaire', 'time_on_task_ms')
    op.drop_column('contact_questionnaire', 'time_on_task_ms')
    op.drop_table('step_log')
    # ### end Alembic commands ###
