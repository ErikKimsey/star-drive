"""empty message

Revision ID: 725179176fb7
Revises: a7c9ddebaee4
Create Date: 2019-01-10 09:36:23.192777

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '725179176fb7'
down_revision = 'a7c9ddebaee4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('contact_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('nickname', sa.String(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('phone_type', sa.String(), nullable=True),
    sa.Column('can_leave_voicemail', sa.Boolean(), nullable=True),
    sa.Column('contact_times', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('street_address', sa.String(), nullable=True),
    sa.Column('city', sa.String(), nullable=True),
    sa.Column('state', sa.String(), nullable=True),
    sa.Column('zip', sa.Integer(), nullable=True),
    sa.Column('marketing_channel', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('contact_questionnaire')
    # ### end Alembic commands ###
