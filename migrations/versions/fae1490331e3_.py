"""empty message

Revision ID: fae1490331e3
Revises: c2f0c1583911
Create Date: 2024-09-20 19:19:31.150771

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fae1490331e3'
down_revision = 'c2f0c1583911'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('dates', schema=None) as batch_op:
        batch_op.add_column(sa.Column('doctor', sa.String(length=100), nullable=False))
        batch_op.drop_constraint('dates_doctor_id_fkey', type_='foreignkey')
        batch_op.drop_column('doctor_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('dates', schema=None) as batch_op:
        batch_op.add_column(sa.Column('doctor_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.create_foreign_key('dates_doctor_id_fkey', 'users', ['doctor_id'], ['id'])
        batch_op.drop_column('doctor')

    # ### end Alembic commands ###
