"""empty message

Revision ID: 24c1b855eeeb
Revises: b1b7d9b47b56
Create Date: 2020-10-02 14:09:04.259167

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '24c1b855eeeb'
down_revision = 'b1b7d9b47b56'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event', sa.Column('image_url', sa.String(), nullable=True))
    op.add_column('event', sa.Column('registration_url', sa.String(), nullable=True))
    op.alter_column('study_user', 'status',
               existing_type=postgresql.ENUM('inquiry_sent', 'enrolled', name='study_user_status'),
               type_=sa.Enum('inquiry_sent', 'enrolled', name='study_user_status'),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('study_user', 'status',
               existing_type=sa.Enum('inquiry_sent', 'enrolled', name='study_user_status'),
               type_=postgresql.ENUM('inquiry_sent', 'enrolled', name='study_user_status'),
               existing_nullable=True)
    op.drop_column('event', 'registration_url')
    op.drop_column('event', 'image_url')
    # ### end Alembic commands ###