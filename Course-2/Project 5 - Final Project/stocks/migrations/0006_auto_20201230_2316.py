# Generated by Django 3.1.4 on 2020-12-30 14:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0005_auto_20201230_2153'),
    ]

    operations = [
        migrations.RenameField(
            model_name='acquisition',
            old_name='name',
            new_name='transacted_stock',
        ),
        migrations.RenameField(
            model_name='userstocks',
            old_name='stock_name',
            new_name='owned_stock',
        ),
    ]
