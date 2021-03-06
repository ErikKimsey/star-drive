"""empty message

Revision ID: 2fed03895153
Revises: 2c365502c9ab
Create Date: 2018-12-20 11:33:36.589861

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '2fed03895153'
down_revision = '2c365502c9ab'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('resource', sa.Column('image_url', sa.String(), nullable=True))
    op.drop_column('resource', 'image')
    op.add_column('study', sa.Column('current_num_participants', sa.Integer(), nullable=True))
    op.add_column('study', sa.Column('end_date', sa.DateTime(), nullable=True))
    op.add_column('study', sa.Column('enrollment_end_date', sa.DateTime(), nullable=True))
    op.add_column('study', sa.Column('enrollment_start_date', sa.DateTime(), nullable=True))
    op.add_column('study', sa.Column('max_num_participants', sa.Integer(), nullable=True))
    op.add_column('study', sa.Column('outcomes_description', sa.String(), nullable=True))
    op.add_column('study', sa.Column('start_date', sa.DateTime(), nullable=True))
    op.add_column('study', sa.Column('website', sa.String(), nullable=True))
    op.drop_column('study', 'enrollment_date')
    op.drop_column('study', 'study_start')
    op.drop_column('study', 'outcomes')
    op.drop_column('study', 'total_participants')
    op.drop_column('study', 'study_end')
    op.drop_column('study', 'current_enrolled')
    op.add_column('training', sa.Column('image_url', sa.String(), nullable=True))
    op.add_column('training', sa.Column('outcomes_description', sa.String(), nullable=True))
    op.add_column('training', sa.Column('website', sa.String(), nullable=True))
    op.drop_column('training', 'image')
    op.drop_column('training', 'outcomes')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('training', sa.Column('outcomes', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('training', sa.Column('image', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('training', 'website')
    op.drop_column('training', 'outcomes_description')
    op.drop_column('training', 'image_url')
    op.add_column('study', sa.Column('current_enrolled', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('study_end', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('total_participants', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('outcomes', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('study_start', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('enrollment_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_column('study', 'website')
    op.drop_column('study', 'start_date')
    op.drop_column('study', 'outcomes_description')
    op.drop_column('study', 'max_num_participants')
    op.drop_column('study', 'enrollment_start_date')
    op.drop_column('study', 'enrollment_end_date')
    op.drop_column('study', 'end_date')
    op.drop_column('study', 'current_num_participants')
    op.add_column('resource', sa.Column('image', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('resource', 'image_url')
    # ### end Alembic commands ###
